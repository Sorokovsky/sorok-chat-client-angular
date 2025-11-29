import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";
import {AccessTokenStorageService} from '@/services/access-token-storage.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {MESSAGES_HUB} from '@/constants/backend-api.constants';
import {ChatsActions} from '@/constants/chats-extions.constants';
import {type Message} from '@/schemes/message.schema';
import {type NewMessage} from '@/schemes/new-message.schema';
import {type LocalMessage, LocalMessageScheme} from '@/schemes/local.message';
import {ChatKeyStorageService} from '@/services/chat-key-storage.service';
import {CryptoService} from '@/services/crypto.service';
import {type CreateQueryResult} from '@tanstack/angular-query-experimental';
import {type User} from '@/schemes/user.schema';
import {useProfile} from '@/hooks/profile.hook';
import {ExchangeKeysStorageService} from '@/services/exchange-keys-storage.service';
import {DiffieHellmanKeysPair} from '@/schemes/diffie-hellman-key-pairs.schema';
import {RsaKeyPair} from '@/schemes/rsa-key-pair.scheme';
import {RsaKeysStorageService} from '@/services/rsa-keys-storage.service';
import {RsaSigningService} from '@/services/rsa-signing.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService implements OnDestroy {
  private readonly accessTokenService: AccessTokenStorageService;
  private readonly ngZone: NgZone;
  private readonly chatKeyExchangeService: ChatKeyStorageService;
  private readonly exchangeKeysStorageService: ExchangeKeysStorageService;
  private readonly cryptoService: CryptoService;
  private readonly rsaKeyStorageService: RsaKeysStorageService;
  private readonly rsaSigningService: RsaSigningService;
  private profile: CreateQueryResult<User> = useProfile();

  private hubConnection: HubConnection | null = null;

  private connectionStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public connectionStatus$: Observable<boolean> = this.connectionStatusSubject.asObservable();
  private messageReceivedSubject: BehaviorSubject<LocalMessage | null> = new BehaviorSubject<LocalMessage | null>(null);
  public messageReceived$: Observable<LocalMessage | null> = this.messageReceivedSubject.asObservable();

  constructor(
    accessTokenService: AccessTokenStorageService,
    ngZone: NgZone,
    chatKeyExchangeService: ChatKeyStorageService,
    cryptoService: CryptoService,
    exchangeKeysStorageService: ExchangeKeysStorageService,
    rsaKeyStorageService: RsaKeysStorageService,
    rsaSigningService: RsaSigningService,
  ) {
    this.accessTokenService = accessTokenService;
    this.ngZone = ngZone;
    this.chatKeyExchangeService = chatKeyExchangeService;
    this.cryptoService = cryptoService;
    this.exchangeKeysStorageService = exchangeKeysStorageService;
    this.rsaKeyStorageService = rsaKeyStorageService;
    this.rsaSigningService = rsaSigningService;
  }

  public async ngOnDestroy(): Promise<void> {
    await this.disconnect();
  }

  public async connectIfPossible(): Promise<void> {
    if (!!this.hubConnection && this.hubConnection?.state === HubConnectionState.Connected) return;
    await this.startConnection();
  }

  public async sendMessage(message: NewMessage, chatId: number): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) return;
    try {
      await this.hubConnection.invoke(ChatsActions.SEND_MESSAGE, message, chatId);
    } catch (error: unknown) {
      console.log("Помилка: ", error);
    }
  }

  public async disconnect(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.connectionStatusSubject.next(false);
    }
  }

  public async joinToChat(chatId: number): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) return;
    try {
      await this.hubConnection.invoke(ChatsActions.JOIN_TO_CHAT, chatId);
    } catch (error: unknown) {
      console.log("Помилка: ", error);
    }
  }

  private async startConnection(): Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(MESSAGES_HUB, {
        accessTokenFactory: (): string => this.accessTokenService.getTokenFromLocalStorage(),
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.hubConnection.start();
      this.connectionStatusSubject.next(true);
      console.log("Підключено сокет");
    } catch (error: unknown) {
      this.connectionStatusSubject.next(false);
      console.error("Помилка підключення", error);
    }

    this.hubConnection.on(ChatsActions.RECEIVE_EXCHANGE, async (
      staticPublicKey: string,
      staticSigning: string,
      ephemeralPublicKey: string,
      ephemeralSigning: string,
      user: User,
      chatId: number
    ): Promise<void> => {
      const isStaticCorrect: boolean = await this.rsaSigningService.verify(
        this.bigIntToBufferSource(BigInt(staticPublicKey)),
        this.base64ToUint8Array(staticSigning) as ArrayBuffer,
        user.publicRsaKey
      );
      const isEphemeralCorrect: boolean = await this.rsaSigningService.verify(
        this.bigIntToBufferSource(BigInt(ephemeralPublicKey)),
        this.base64ToUint8Array(ephemeralSigning) as ArrayBuffer,
        user.publicRsaKey
      );
      const currentUserId: number = this.profile.data()!.id;
      if (!isStaticCorrect || !isEphemeralCorrect) {
        await this.handshake(currentUserId, chatId);
      } else {
        if (currentUserId !== user.id) {
          localStorage.setItem(`static-public-chat-${chatId}`, staticPublicKey);
          localStorage.setItem(`ephemeral-public-chat-${chatId}`, ephemeralPublicKey);
        }
      }

    });
    this.hubConnection.on(ChatsActions.CONNECTED, (chatId: number, user: User): void => {
      const id = this.profile.data()!.id;
      this.handshake(id, chatId);
    });
    this.hubConnection.onclose((): void => this.connectionStatusSubject.next(false));
    this.hubConnection.onreconnected((): void => this.connectionStatusSubject.next(true));
    this.receiveMessageHandle();
  }

  private receiveMessageHandle(): void {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) return;
    this.hubConnection.on(ChatsActions.RECEIVE_MESSAGE, (message: Message, chatId: number): void => {
      this.ngZone.run(async (): Promise<void> => {
        const chatsString: string = localStorage.getItem(`messages`) ?? "[]";
        const messages: LocalMessage[] = LocalMessageScheme.array().parse(JSON.parse(chatsString));
        const key: string = await this.chatKeyExchangeService.getChatKey(chatId);
        const localMessage: LocalMessage = {
          id: message.id,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          author: message.author,
          chatId,
          text: this.cryptoService.decrypt(message.text, key),
          isValid: this.cryptoService.isSigned(message.text, message.mac, key),
        };
          messages.push(localMessage);
          localStorage.setItem(`messages`, JSON.stringify(messages));
          this.messageReceivedSubject.next(localMessage);
      });
    });
  }

  private async handshake(userId: number, chatId: number): Promise<void> {
    const staticKeys: DiffieHellmanKeysPair = this.exchangeKeysStorageService.getMyStaticKeys();
    const ephemeralKeys: DiffieHellmanKeysPair = this.exchangeKeysStorageService.getMyEphemeralKeys(chatId);
    const rsaKeys: RsaKeyPair = await this.rsaKeyStorageService.getKeyPair();
    const staticSigning: string = await this.sign(staticKeys.publicKey, rsaKeys.privateKey);
    const ephemeralSigning: string = await this.sign(ephemeralKeys.publicKey, rsaKeys.privateKey);
    this.hubConnection?.invoke(
      ChatsActions.SEND_EXCHANGE,
      staticKeys.publicKey.toString(),
      staticSigning,
      ephemeralKeys.publicKey.toString(),
      ephemeralSigning,
      chatId,
      userId
    );
  }

  private uint8ToBase64(uint8Array: Uint8Array): string {
    return btoa(String.fromCharCode(...uint8Array));
  }

  private async sign(key: bigint, privateRsa: string): Promise<string> {
    const signed: ArrayBuffer = await this.rsaSigningService.sign(this.bigIntToBufferSource(key), privateRsa);
    return this.uint8ToBase64(new Uint8Array(signed));
  }

  private bigIntToBufferSource(value: bigint): BufferSource {
    let hex = value.toString(16);
    if (hex.length % 2) hex = '0' + hex;

    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }

    const firstNonZero = bytes.findIndex(b => b !== 0);
    return firstNonZero === -1 ? new Uint8Array([0]) : bytes.subarray(firstNonZero);
  }

  private base64ToUint8Array(base64: string): BufferSource {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  }
}

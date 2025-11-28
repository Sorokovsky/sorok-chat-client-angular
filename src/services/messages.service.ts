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

@Injectable({
  providedIn: 'root',
})
export class MessagesService implements OnDestroy {
  private readonly accessTokenService: AccessTokenStorageService;
  private readonly ngZone: NgZone;
  private readonly chatKeyExchangeService: ChatKeyStorageService;
  private readonly exchangeKeysStorageService: ExchangeKeysStorageService;
  private readonly cryptoService: CryptoService;
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
  ) {
    this.accessTokenService = accessTokenService;
    this.ngZone = ngZone;
    this.chatKeyExchangeService = chatKeyExchangeService;
    this.cryptoService = cryptoService;
    this.exchangeKeysStorageService = exchangeKeysStorageService;
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

    this.hubConnection.on(ChatsActions.RECEIVE_EXCHANGE, (
      staticPublicKey: string,
      ephemeralPublicKey: string,
      userId: number,
      chatId: number
    ): void => {
      const currentUserId: number | undefined = this.profile.data()?.id;
      if (currentUserId !== userId) {
        localStorage.setItem(`static-public-chat-${chatId}`, staticPublicKey);
        localStorage.setItem(`ephemeral-public-chat-${chatId}`, ephemeralPublicKey);
      }

    });
    this.hubConnection.on(ChatsActions.CONNECTED, (chatId: number, userId: number): void => {
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

  private handshake(userId: number, chatId: number): void {
    const staticKeys = this.exchangeKeysStorageService.getMyStaticKeys();
    const ephemeralKeys = this.exchangeKeysStorageService.getMyEphemeralKeys(chatId);
    this.hubConnection?.invoke(
      ChatsActions.SEND_EXCHANGE,
      staticKeys.publicKey.toString(),
      ephemeralKeys.publicKey.toString(),
      chatId,
      userId
    );
  }
}

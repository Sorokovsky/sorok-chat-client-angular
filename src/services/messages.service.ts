import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";
import {AccessTokenStorageService} from '@/services/access-token-storage.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {MESSAGES_HUB} from '@/constants/backend-api.constants';
import {ChatsActions} from '@/constants/chats-extions.constants';
import {type Message} from '@/schemes/message.schema';
import {NewMessage} from '@/schemes/new-message.schema';
import {LocalMessage, LocalMessageScheme} from '@/schemes/local.message';
import {ChatKeyStorageService} from '@/services/chat-key-storage.service';
import {CryptoService} from '@/services/crypto.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService implements OnDestroy {
  private readonly accessTokenService: AccessTokenStorageService;
  private readonly ngZone: NgZone;
  private readonly chatKeyExchangeService: ChatKeyStorageService;
  private readonly cryptoService: CryptoService;

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
  ) {
    this.accessTokenService = accessTokenService;
    this.ngZone = ngZone;
    this.chatKeyExchangeService = chatKeyExchangeService;
    this.cryptoService = cryptoService;
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

    this.hubConnection.on(ChatsActions.RECEIVE_MESSAGE, (message: Message, chatId: number): void => {
      this.ngZone.run(async (): Promise<void> => {
        const chatsString: string = localStorage.getItem(`messages`) ?? "[]";
        const messages: LocalMessage[] = LocalMessageScheme.array().parse(JSON.parse(chatsString));
        var key: string = await this.chatKeyExchangeService.getChatKey(chatId);
        const localMessage: LocalMessage = {
          id: message.id,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          author: message.author,
          chatId,
          text: this.cryptoService.decrypt(message.text, key),
          isValid: this.cryptoService.isSigned(message.text, message.mac, key),
        };
        if (localMessage.isValid) {
          messages.push(localMessage);
          localStorage.setItem(`messages`, JSON.stringify(messages));
          this.messageReceivedSubject.next(localMessage);
        }
      });
    });
    this.hubConnection.onclose((): void => this.connectionStatusSubject.next(false));
    this.hubConnection.onreconnected((): void => this.connectionStatusSubject.next(true));
  }
}

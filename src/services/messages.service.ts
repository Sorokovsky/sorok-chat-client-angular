import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";
import {AccessTokenStorageService} from '@/services/access-token-storage.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {ReceivedMessage} from '@/schemes/received-message.scheme';
import {MESSAGES_HUB} from '@/constants/backend-api.constants';
import {ChatsActions} from '@/constants/chats-extions.constants';
import {type Message} from '@/schemes/message.schema';
import {NewMessage} from '@/schemes/new-message.schema';

@Injectable({
  providedIn: 'root',
})
export class MessagesService implements OnDestroy {
  private readonly accessTokenService: AccessTokenStorageService;
  private readonly ngZone: NgZone;

  private hubConnection: HubConnection | null = null;

  private connectionStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public connectionStatus$: Observable<boolean> = this.connectionStatusSubject.asObservable();
  private messageReceivedSubject: BehaviorSubject<ReceivedMessage | null> = new BehaviorSubject<ReceivedMessage | null>(null);
  public messageReceived$: Observable<ReceivedMessage | null> = this.messageReceivedSubject.asObservable();

  constructor(accessTokenService: AccessTokenStorageService, ngZone: NgZone) {
    this.accessTokenService = accessTokenService;
    this.ngZone = ngZone;
  }

  public async ngOnDestroy(): Promise<void> {
    await this.disconnect();
  }

  public async connectIfPossible(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) return;
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

  private async startConnection(): Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(MESSAGES_HUB, {
        accessTokenFactory: (): string => this.accessTokenService.getTokenFromLocalStorage(),
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on(ChatsActions.RECEIVE_MESSAGE, (message: Message, chatId: number): void => {
      this.ngZone.run((): void => {
        this.messageReceivedSubject.next({message, chatId});
      });
    });
    this.hubConnection.onclose((): void => this.connectionStatusSubject.next(false));
    this.hubConnection.onreconnected((): void => this.connectionStatusSubject.next(true));
    try {
      await this.hubConnection.start();
      this.connectionStatusSubject.next(true);
      console.log("Підключено сокет");
    } catch (error: unknown) {
      this.connectionStatusSubject.next(false);
      console.error("Помилка підключення", error);
    }
  }
}

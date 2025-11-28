import {Component, effect, type OnInit, Signal, signal, type WritableSignal} from '@angular/core';
import {ActivatedRoute, type ParamMap} from '@angular/router';
import {useChatsByMe} from '@/hooks/chats-by-me.hook';
import {type CreateQueryResult} from '@tanstack/angular-query-experimental';
import {type Chat as ChatType} from "@/schemes/chat.schema";
import {toSignal} from '@angular/core/rxjs-interop';
import {CryptoService} from '@/services/crypto.service';
import {FormsModule} from '@angular/forms';
import {type User} from '@/schemes/user.schema';
import {useProfile} from '@/hooks/profile.hook';
import {MessagesService} from '@/services/messages.service';
import {MessageList} from '@/components/common/message-list/message-list';
import {SendMessage} from '@/components/common/send-message/send-message';
import {type SentMessage} from '@/schemes/sent-message.scheme';
import {ChatHeading} from '@/components/common/chat-heading/chat-heading';
import {LocalMessage, LocalMessageScheme} from '@/schemes/local.message';

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    MessageList,
    SendMessage,
    ChatHeading
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit {
  private readonly idName: string = 'id';

  private readonly activatedRoute: ActivatedRoute;
  private readonly messagesService: MessagesService;

  protected cryptoService: CryptoService;
  protected profile: CreateQueryResult<User> = useProfile();

  protected chat: WritableSignal<ChatType | undefined> = signal<ChatType | undefined>(undefined);
  private chats: CreateQueryResult<ChatType[]> = useChatsByMe();
  protected messages: WritableSignal<LocalMessage[]> = signal<LocalMessage[]>([])
  private parameters: Signal<ParamMap | undefined>;

  constructor(activatedRoute: ActivatedRoute, cryptoService: CryptoService, messagesService: MessagesService) {
    this.activatedRoute = activatedRoute;
    this.cryptoService = cryptoService;
    this.messagesService = messagesService;
    this.parameters = toSignal<ParamMap | undefined>(this.activatedRoute.paramMap);

    effect((): void => {
      const id: string | null = this.parameters()?.get(this.idName) || null;
      if (id) {
        this.chat.set((this.chats.data() || []).find((chat: ChatType): boolean => chat.id === +id));
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.messagesService.connectIfPossible()
    const messagesString: string = localStorage.getItem('messages') || '[]';
    this.messages.set(LocalMessageScheme.array().parse(JSON.parse(messagesString)));
    this.messagesService.messageReceived$
      .subscribe((received: LocalMessage | null): void => {
        const chats: ChatType[] | undefined = this.chats.data()
        if (received === null || chats === undefined) return;
        this.messages.set([...this.messages(), received]);
      });
  }

  protected getMessagesByChat(chat: ChatType): LocalMessage[] {
    return this.messages().filter(x => x.chatId == chat.id);
  }

  public async sendMessage(message: SentMessage): Promise<void> {
    await this.messagesService.sendMessage(message.message, message.chatId);
  }
}

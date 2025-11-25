import {Component, effect, OnInit, Signal, signal, type WritableSignal} from '@angular/core';
import {ActivatedRoute, type ParamMap} from '@angular/router';
import {useChatsByMe} from '@/hooks/chats-by-me.hook';
import {type CreateQueryResult} from '@tanstack/angular-query-experimental';
import {type Chat as ChatType} from "@/schemes/chat.schema";
import {toSignal} from '@angular/core/rxjs-interop';
import {CryptoService} from '@/services/crypto.service';
import {type Message} from '@/schemes/message.schema';
import {formatDate} from '@/helpers/format-date.helper';
import {Input} from '@/components/ui/input/input';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {TypedFormControl} from '@/schemes/input.schema';
import {Button} from '@/components/ui/button/button';
import {type User} from '@/schemes/user.schema';
import {useProfile} from '@/hooks/profile.hook';
import {type NewMessage} from '@/schemes/new-message.schema';
import {MessagesService} from '@/services/messages.service';
import {type ReceivedMessage} from '@/schemes/received-message.scheme';
import {MessageList} from '@/components/common/message-list/message-list';

@Component({
  selector: 'app-chat',
  imports: [
    Input,
    Button,
    FormsModule,
    MessageList
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit {
  private readonly idName: string = 'id';

  private readonly activatedRoute: ActivatedRoute;
  private readonly messagesService: MessagesService;

  protected cryptoService: CryptoService;
  private profile: CreateQueryResult<User> = useProfile();

  protected messageForm: FormGroup;
  protected textInput: TypedFormControl;

  protected chat: WritableSignal<ChatType | undefined> = signal<ChatType | undefined>(undefined);
  private chats: CreateQueryResult<ChatType[]> = useChatsByMe();
  private parameters: Signal<ParamMap | undefined>;

  constructor(activatedRoute: ActivatedRoute, cryptoService: CryptoService, formBuilder: FormBuilder, messagesService: MessagesService) {
    this.activatedRoute = activatedRoute;
    this.cryptoService = cryptoService;
    this.messagesService = messagesService;
    this.parameters = toSignal<ParamMap | undefined>(this.activatedRoute.paramMap);
    this.textInput = formBuilder.control('', [Validators.required]) as TypedFormControl;
    this.messageForm = formBuilder.group({
      text: this.textInput,
    })
    this.textInput.meta = {label: "Повідомлення"};
    effect((): void => {
      const id: string | null = this.parameters()?.get(this.idName) || null;
      if (id) {
        this.chat.set((this.chats.data() || []).find((chat: ChatType): boolean => chat.id === +id));
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.messagesService.connectIfPossible()
    this.messagesService.messageReceived$
      .subscribe((received: ReceivedMessage | null): void => {
        const chats: ChatType[] | undefined = this.chats.data()
        if (received === null || chats === undefined) return;
        const chat: ChatType | undefined = chats.find((chat: ChatType): boolean => chat.id === received.chatId);
        if (chat === undefined) return;
        chat.messages.push(received.message);
      });
  }

  public isMessageNotChanged(message: Message): boolean {
    return this.cryptoService.isSigned(message.text, message.mac, message.author.macSecret);
  }

  public async sendMessage(): Promise<void> {
    const data: unknown = this.messageForm.value;
    if (data && typeof data == "object" && "text" in data && typeof data.text === "string") {
      const macSecret: string = this.profile.data()?.macSecret!;
      const text: string = this.cryptoService.encrypt(data.text, macSecret);
      const mac: string = this.cryptoService.sign(text, macSecret);
      const newMessage: NewMessage = {text, mac};
      this.messageForm.reset();
      await this.messagesService.sendMessage(newMessage, this.chat()!.id);
    }
  }

  protected readonly formatDate: (date: Date) => string = formatDate;
}

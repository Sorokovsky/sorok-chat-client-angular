import {Component, effect, Signal, signal, type WritableSignal} from '@angular/core';
import {ActivatedRoute, type ParamMap} from '@angular/router';
import {useChatsByMe} from '@/hooks/chats-by-me.hook';
import {type CreateQueryResult} from '@tanstack/angular-query-experimental';
import {type Chat as ChatType} from "@/schemes/chat.schema";
import {toSignal} from '@angular/core/rxjs-interop';
import {Avatar} from '@/components/ui/avatar/avatar';
import {CryptoService} from '@/services/crypto.service';
import {type Message} from '@/schemes/message.schema';
import {formatDate} from '@/helpers/format-date.helper';
import {Input} from '@/components/ui/input/input';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TypedFormControl} from '@/schemes/input.schema';
import {Button} from '@/components/ui/button/button';

@Component({
  selector: 'app-chat',
  imports: [
    Avatar,
    Input,
    Button
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {
  private readonly idName: string = 'id';

  private activatedRoute: ActivatedRoute;
  protected cryptoService: CryptoService;

  protected messageForm: FormGroup;
  protected textInput: TypedFormControl;

  protected chat: WritableSignal<ChatType | undefined> = signal<ChatType | undefined>(undefined);
  private chats: CreateQueryResult<ChatType[]> = useChatsByMe();
  private parameters: Signal<ParamMap | undefined>;

  constructor(activatedRoute: ActivatedRoute, cryptoService: CryptoService, formBuilder: FormBuilder) {
    this.activatedRoute = activatedRoute;
    this.cryptoService = cryptoService;
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

  public isMessageNotChanged(message: Message): boolean {
    return this.cryptoService.isSigned(message.text, message.mac, message.author.macSecret);
  }

  protected readonly formatDate: (date: Date) => string = formatDate;
}

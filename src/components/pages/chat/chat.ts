import {Component, effect, Signal, signal, type WritableSignal} from '@angular/core';
import {ActivatedRoute, type ParamMap} from '@angular/router';
import {useChatsByMe} from '@/hooks/chats-by-me.hook';
import {type CreateQueryResult} from '@tanstack/angular-query-experimental';
import {type Chat as ChatType} from "@/schemes/chat.schema";
import {toSignal} from '@angular/core/rxjs-interop';
import {Avatar} from '@/components/ui/avatar/avatar';
import {CryptoService} from '@/services/crypto.service';
import {Message} from '@/schemes/message.schema';

@Component({
  selector: 'app-chat',
  imports: [
    Avatar
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {
  private readonly idName: string = 'id';

  private activatedRoute: ActivatedRoute;
  protected cryptoService: CryptoService;

  protected chat: WritableSignal<ChatType | undefined> = signal<ChatType | undefined>(undefined);
  private chats: CreateQueryResult<ChatType[]> = useChatsByMe();
  private parameters: Signal<ParamMap | undefined>;

  constructor(activatedRoute: ActivatedRoute, cryptoService: CryptoService) {
    this.activatedRoute = activatedRoute;
    this.cryptoService = cryptoService;
    this.parameters = toSignal<ParamMap | undefined>(this.activatedRoute.paramMap);
    effect((): void => {
      const id: string | null = this.parameters()?.get(this.idName) || null;
      if (id)
        this.chat.set((this.chats.data() || []).find((chat: ChatType) => chat.id === +id));
    });
  }

  public isMessageNotChanged(message: Message): boolean {
    return this.cryptoService.isSigned(message.text, message.mac, message.author.macSecret);
  }
}

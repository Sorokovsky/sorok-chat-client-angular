import {Component, input, type InputSignal} from '@angular/core';
import {Avatar} from "@/components/ui/avatar/avatar";
import {formatDate} from '@/helpers/format-date.helper';
import {type Message} from '@/schemes/message.schema';
import {CryptoService} from '@/services/crypto.service';

@Component({
  selector: 'app-message-item',
  imports: [
    Avatar
  ],
  templateUrl: './message-item.html',
  styleUrl: './message-item.scss',
})
export class MessageItem {
  public message: InputSignal<Message> = input.required<Message>();
  protected readonly formatDate: (date: Date) => string = formatDate;
  private readonly cryptoService: CryptoService;

  constructor(cryptoService: CryptoService) {
    this.cryptoService = cryptoService;
  }

  protected decryptMessage(message: Message): string {
    return this.cryptoService.decrypt(message.text, message.author.macSecret);
  }

  protected isMessageNotChanged(message: Message): boolean {
    return this.cryptoService.isSigned(message.text, message.mac, message.author.macSecret);
  }
}

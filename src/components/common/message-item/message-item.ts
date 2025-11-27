import {Component, input, type InputSignal} from '@angular/core';
import {Avatar} from "@/components/ui/avatar/avatar";
import {formatDate} from '@/helpers/format-date.helper';
import {type Message} from '@/schemes/message.schema';
import {CryptoService} from '@/services/crypto.service';
import {Chat} from '@/schemes/chat.schema';
import {ChatKeyStorageService} from '@/services/chat-key-storage.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-message-item',
  imports: [
    Avatar,
    AsyncPipe
  ],
  templateUrl: './message-item.html',
  styleUrl: './message-item.scss',
})
export class MessageItem {
  public message: InputSignal<Message> = input.required<Message>();
  public chat: InputSignal<Chat> = input.required<Chat>();
  protected readonly formatDate: (date: Date) => string = formatDate;
  private readonly cryptoService: CryptoService;
  private readonly chatKeyStorageService: ChatKeyStorageService;

  constructor(cryptoService: CryptoService, chatKeyStorageService: ChatKeyStorageService) {
    this.cryptoService = cryptoService;
    this.chatKeyStorageService = chatKeyStorageService;
  }

  protected async decryptMessage(message: Message): Promise<string> {
    const key: string = await this.getChatKey();
    return this.cryptoService.decrypt(message.text, key);
  }

  protected async isMessageNotChanged(message: Message): Promise<boolean> {
    const key: string = await this.getChatKey();
    return this.cryptoService.isSigned(message.text, message.mac, key);
  }

  private async getChatKey(): Promise<string> {
    return await this.chatKeyStorageService.getChatKey(this.chat().staticPublicKey, this.chat().ephemeralPublicKey);
  }
}

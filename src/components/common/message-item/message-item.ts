import {Component, computed, input, type InputSignal, Signal} from '@angular/core';
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

  private chatKey: Signal<Promise<string>> = computed(async (): Promise<string> => {
    const chat: Chat = this.chat();
    return await this.chatKeyStorageService.getChatKey(chat.staticPublicKey, chat.ephemeralPublicKey, chat.id);
  });

  public decryptedText: Signal<Promise<string>> = computed(async (): Promise<string> => {
    const message: Message = this.message();
    const key: string = await this.chatKey();
    try {
      console.log(key);
      return this.cryptoService.decrypt(message.text, key);
    } catch {
      return "[Не вдалося розшифрувати]"
    }
  });

  public isValid: Signal<Promise<boolean>> = computed(async (): Promise<boolean> => {
    const message: Message = this.message();
    if (!message.mac) return false;
    const key: string = await this.chatKey();
    return this.cryptoService.isSigned(message.text, message.mac, key);
  });
}

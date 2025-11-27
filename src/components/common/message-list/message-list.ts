import {AfterViewChecked, Component, input, type InputSignal} from '@angular/core';
import {type Message} from '@/schemes/message.schema';
import {MessageItem} from '@/components/common/message-item/message-item';
import {Chat} from '@/schemes/chat.schema';

@Component({
  selector: 'app-message-list',
  imports: [
    MessageItem
  ],
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
})
export class MessageList implements AfterViewChecked {
  public messages: InputSignal<Message[]> = input.required<Message[]>();
  public chat: InputSignal<Chat> = input.required<Chat>();

  public ngAfterViewChecked(): void {

  }
}

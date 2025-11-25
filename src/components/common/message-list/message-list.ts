import {Component, input, type InputSignal} from '@angular/core';
import {type Message} from '@/schemes/message.schema';
import {MessageItem} from '@/components/common/message-item/message-item';

@Component({
  selector: 'app-message-list',
  imports: [
    MessageItem
  ],
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
})
export class MessageList {
  public messages: InputSignal<Message[]> = input.required<Message[]>();
}

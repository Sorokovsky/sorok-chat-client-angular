import {AfterViewChecked, Component, input, type InputSignal} from '@angular/core';
import {MessageItem} from '@/components/common/message-item/message-item';
import {Chat} from '@/schemes/chat.schema';
import {LocalMessage} from '@/schemes/local.message';

@Component({
  selector: 'app-message-list',
  imports: [
    MessageItem
  ],
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
})
export class MessageList implements AfterViewChecked {
  public messages: InputSignal<LocalMessage[]> = input.required<LocalMessage[]>();
  public chat: InputSignal<Chat> = input.required<Chat>();

  public ngAfterViewChecked(): void {

  }
}

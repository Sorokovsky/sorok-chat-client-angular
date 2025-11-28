import {Component, input, type InputSignal} from '@angular/core';
import {Avatar} from "@/components/ui/avatar/avatar";
import {formatDate} from '@/helpers/format-date.helper';
import {LocalMessage} from '@/schemes/local.message';

@Component({
  selector: 'app-message-item',
  imports: [
    Avatar,
  ],
  templateUrl: './message-item.html',
  styleUrl: './message-item.scss',
})
export class MessageItem {
  public message: InputSignal<LocalMessage> = input.required<LocalMessage>();
  protected readonly formatDate: (date: Date) => string = formatDate;

}

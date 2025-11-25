import {Component, input, type InputSignal} from '@angular/core';
import {type Chat} from "@/schemes/chat.schema";

@Component({
  selector: 'app-chat-heading',
  imports: [],
  templateUrl: './chat-heading.html',
  styleUrl: './chat-heading.scss',
})
export class ChatHeading {
  public chat: InputSignal<Chat> = input.required<Chat>();
}

import {Component} from '@angular/core';
import {ChatsSidebar} from '@/components/common/chats-sidebar/chats-sidebar';
import {Header} from '@/components/common/header/header';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-chats-layout',
  imports: [
    ChatsSidebar,
    Header,
    RouterOutlet
  ],
  templateUrl: './chats-layout.html',
  styleUrl: './chats-layout.scss',
})
export class ChatsLayout {
}

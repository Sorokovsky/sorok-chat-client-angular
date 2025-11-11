import {Component} from '@angular/core';
import {ChatsSidebar} from '@/components/common/chats-sidebar/chats-sidebar';
import {Header} from '@/components/common/header/header';

@Component({
  selector: 'app-main-layout',
  imports: [
    ChatsSidebar,
    Header
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
}

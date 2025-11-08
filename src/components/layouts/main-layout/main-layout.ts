import {Component} from '@angular/core';
import {ChatsSidebar} from '@/components/common/chats-sidebar/chats-sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [
    ChatsSidebar
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

}

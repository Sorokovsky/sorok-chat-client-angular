import {Component} from '@angular/core';
import {SiteLogo} from '@/components/common/site-logo/site-logo';
import {ChatsSidebarToggler} from '@/components/common/chats-sidebar-toggler/chats-sidebar-toggler';

@Component({
  selector: 'app-header',
  imports: [
    SiteLogo,
    ChatsSidebarToggler
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

}

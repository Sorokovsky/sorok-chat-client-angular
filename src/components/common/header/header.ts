import {Component, Signal} from '@angular/core';
import {SiteLogo} from '@/components/common/site-logo/site-logo';
import {ChatsSidebarToggler} from '@/components/common/chats-sidebar-toggler/chats-sidebar-toggler';
import {useIsAuthenticated} from '@/hooks/is-authenticated.hook';

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
  protected isAuthenticated: Signal<boolean> = useIsAuthenticated();
}

import {Component, type Signal} from '@angular/core';
import {type CreateQueryResult} from "@tanstack/angular-query-experimental";
import {SiteLogo} from '@/components/common/site-logo/site-logo';
import {ChatsSidebarToggler} from '@/components/common/chats-sidebar-toggler/chats-sidebar-toggler';
import {useIsAuthenticated} from '@/hooks/is-authenticated.hook';
import {useProfile} from '@/hooks/profile.hook';
import {type User} from '@/schemes/user.schema';
import {Avatar} from '@/components/common/avatar/avatar';

@Component({
  selector: 'app-header',
  imports: [
    SiteLogo,
    ChatsSidebarToggler,
    Avatar
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected isAuthenticated: Signal<boolean> = useIsAuthenticated();
  protected profile: CreateQueryResult<User> = useProfile();
}

import {Component} from '@angular/core';
import {SiteLogo} from '@/components/common/site-logo/site-logo';
import {ChatsSidebarToggler} from '@/components/common/chats-sidebar-toggler/chats-sidebar-toggler';
import {useProfile} from '@/hooks/profile.hook';
import {type CreateQueryResult} from '@tanstack/angular-query-experimental';
import {type User} from '@/schemes/user.schema';

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
  protected profile: CreateQueryResult<User> = useProfile();
}

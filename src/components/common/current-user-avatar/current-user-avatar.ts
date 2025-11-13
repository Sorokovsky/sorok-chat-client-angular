import {Component, signal, type WritableSignal} from '@angular/core';
import {Avatar} from '@/components/ui/avatar/avatar';
import {useProfile} from '@/hooks/profile.hook';
import {type CreateQueryResult} from '@tanstack/angular-query-experimental';
import {type User} from '@/schemes/user.schema';
import {UserLinks} from '@/components/common/user-links/user-links';

@Component({
  selector: 'app-current-user-avatar',
  imports: [
    Avatar,
    UserLinks
  ],
  templateUrl: './current-user-avatar.html',
  styleUrl: './current-user-avatar.scss',
})
export class CurrentUserAvatar {
  protected profile: CreateQueryResult<User> = useProfile();
  protected isActive: WritableSignal<boolean> = signal<boolean>(false);

  public toggleLinks(): void {
    this.isActive.update((previous: boolean): boolean => !previous);
  }
}

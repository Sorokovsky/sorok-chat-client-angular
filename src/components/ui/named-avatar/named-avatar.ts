import {Component, input, type InputSignal} from '@angular/core';
import {type User} from '@/schemes/user.schema';

@Component({
  selector: 'app-named-avatar',
  imports: [],
  templateUrl: './named-avatar.html',
})
export class NamedAvatar {
  public user: InputSignal<User> = input.required<User>();

  get avatarText(): string {
    const user: User = this.user()!;
    return `${user.firstName[0]}.${user.middleName[0]}.`;
  }
}

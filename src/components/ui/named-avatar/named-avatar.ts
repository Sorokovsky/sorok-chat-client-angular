import {Component, Input} from '@angular/core';
import {type User} from '@/schemes/user.schema';

@Component({
  selector: 'app-named-avatar',
  imports: [],
  templateUrl: './named-avatar.html',
})
export class NamedAvatar {
  @Input({required: true}) public user!: User;

  get avatarText(): string {
    return `${this.user.firstName[0]}.${this.user.lastName[0]}.`;
  }
}

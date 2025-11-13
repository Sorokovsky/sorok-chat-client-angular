import {Component, EventEmitter, Input, Output} from '@angular/core';
import {type User} from '@/schemes/user.schema';
import {NamedAvatar} from '@/components/ui/named-avatar/named-avatar';
import {DefaultAvatar} from '@/components/ui/default-avatar/default-avatar';

@Component({
  selector: 'app-avatar',
  imports: [
    NamedAvatar,
    DefaultAvatar
  ],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class Avatar {
  @Input() public user: User | undefined = undefined;
  @Output() public clickHandler: EventEmitter<void> = new EventEmitter();
}

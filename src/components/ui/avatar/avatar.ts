import {Component, input, type InputSignal, output, type OutputEmitterRef} from '@angular/core';
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
  public user: InputSignal<User | undefined> = input<User | undefined>(undefined);
  public onAvatarClick: OutputEmitterRef<void> = output<void>()

  public onClick(): void {
    this.onAvatarClick.emit();
  }
}

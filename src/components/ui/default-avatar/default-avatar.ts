import {Component, Input} from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {DEFAULT_AVATAR_SIZE} from '@/constants/media.constants';

@Component({
  selector: 'app-default-avatar',
  imports: [
    LucideAngularModule
  ],
  templateUrl: './default-avatar.html',
})
export class DefaultAvatar {
  @Input() public size: number = DEFAULT_AVATAR_SIZE;
}

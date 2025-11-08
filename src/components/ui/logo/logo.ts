import {Component, input, type InputSignal} from '@angular/core';
import {DEFAULT_LOGO, DEFAULT_LOGO_SIZE} from '@/constants/media.constants';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-logo',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class Logo {
  public image: InputSignal<string> = input<string>(DEFAULT_LOGO);
  public size: InputSignal<number> = input<number>(DEFAULT_LOGO_SIZE);
}

import {Component, input, InputSignal} from '@angular/core';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-button',
  imports: [
    MatButton
  ],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  public disabled: InputSignal<boolean> = input<boolean>(false);
  public text: InputSignal<string> = input.required<string>();
  public type: InputSignal<string> = input<string>("submit");

}

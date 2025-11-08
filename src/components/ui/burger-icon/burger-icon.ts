import {Component, EventEmitter, input, type InputSignal, Output} from '@angular/core';

@Component({
  selector: 'app-burger-icon',
  imports: [],
  templateUrl: './burger-icon.html',
  styleUrl: './burger-icon.scss',
})
export class BurgerIcon {

  public isOpen: InputSignal<boolean> = input<boolean>(false);

  @Output() public clicked: EventEmitter<void> = new EventEmitter<void>();

  protected onClick() {
    this.clicked.emit();
  }
}

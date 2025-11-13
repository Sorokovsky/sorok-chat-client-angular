import {Component, input, type InputSignal, output, type OutputEmitterRef} from '@angular/core';

@Component({
  selector: 'app-burger-icon',
  imports: [],
  templateUrl: './burger-icon.html',
  styleUrl: './burger-icon.scss',
})
export class BurgerIcon {

  public isOpen: InputSignal<boolean> = input<boolean>(false);

  public clicked: OutputEmitterRef<void> = output<void>();

  protected onClick() {
    this.clicked.emit();
  }
}

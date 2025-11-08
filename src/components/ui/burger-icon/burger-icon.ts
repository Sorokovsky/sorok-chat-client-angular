import {Component, signal, type WritableSignal} from '@angular/core';

@Component({
  selector: 'app-burger-icon',
  imports: [],
  templateUrl: './burger-icon.html',
  styleUrl: './burger-icon.scss',
})
export class BurgerIcon {
  protected isActive: WritableSignal<boolean> = signal<boolean>(false);

  public onClick() {
    this.isActive.set(!this.isActive());
  }
}

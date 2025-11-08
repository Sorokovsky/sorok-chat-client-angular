import {Component, input, type InputSignal} from '@angular/core';
import {SidebarPosition} from '@/schemes/sidebar-position.scheme';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  public isOpen: InputSignal<boolean> = input.required<boolean>();
  public position: InputSignal<SidebarPosition> = input<SidebarPosition>(SidebarPosition.left)
}

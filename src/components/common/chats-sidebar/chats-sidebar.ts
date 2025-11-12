import {Component, input, InputSignal, type Signal} from '@angular/core';
import {Sidebar} from '@/components/ui/sidebar/sidebar';
import {Store} from '@ngrx/store';
import {toSignal} from '@angular/core/rxjs-interop';
import {isChatsSidebarOpenSidebar} from '@/stores/chats-sidebar/chats-sidebar.selectors';
import {initialState} from '@/stores/chats-sidebar/chats-sidebar.reducers';
import {SidebarPosition} from '@/schemes/sidebar-position.scheme';

@Component({
  selector: 'app-chats-sidebar',
  imports: [
    Sidebar
  ],
  templateUrl: './chats-sidebar.html',
  styleUrl: './chats-sidebar.scss',
})
export class ChatsSidebar {
  public isSidebarOpen: Signal<boolean>;
  public position: InputSignal<SidebarPosition> = input<SidebarPosition>(SidebarPosition.left)
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
    this.isSidebarOpen = toSignal(this.store.select(isChatsSidebarOpenSidebar), {
      initialValue: initialState.isOpen
    });
  }
}

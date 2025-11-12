import {Component, type Signal} from '@angular/core';
import {Store} from '@ngrx/store';
import {toggleChats} from '@/stores/chats-sidebar/chats-sidebar.actions';
import {BurgerIcon} from '@/components/ui/burger-icon/burger-icon';
import {toSignal} from '@angular/core/rxjs-interop';
import {isChatsSidebarOpenSidebar} from '@/stores/chats-sidebar/chats-sidebar.selectors';
import {initialState} from '@/stores/chats-sidebar/chats-sidebar.reducers';

@Component({
  selector: 'app-chats-sidebar-toggler',
  imports: [
    BurgerIcon
  ],
  templateUrl: './chats-sidebar-toggler.html',
  styleUrl: './chats-sidebar-toggler.scss',
})
export class ChatsSidebarToggler {
  protected store: Store;
  protected isOpen: Signal<boolean>;

  constructor(store: Store) {
    this.store = store;
    this.isOpen = toSignal(this.store.select(isChatsSidebarOpenSidebar), {
      initialValue: initialState.isOpen
    });
  }

  public toggleSidebar(): void {
    this.store.dispatch(toggleChats());
  }
}

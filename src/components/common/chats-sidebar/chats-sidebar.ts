import {Component, inject, Signal} from '@angular/core';
import {Sidebar} from '@/components/ui/sidebar/sidebar';
import {Store} from '@ngrx/store';
import {toSignal} from '@angular/core/rxjs-interop';
import {isChatsSidebarOpenSidebar} from '@/stores/chats-sidebar/chats-sidebar.selectors';
import {initialState} from '@/stores/chats-sidebar/chats-sidebar.reducers';

@Component({
  selector: 'app-chats-sidebar',
  imports: [
    Sidebar
  ],
  templateUrl: './chats-sidebar.html',
  styleUrl: './chats-sidebar.scss',
})
export class ChatsSidebar {
  private readonly store: Store = inject(Store);

  public isOpen: Signal<boolean> = toSignal(this.store.select(isChatsSidebarOpenSidebar), {
    initialValue: initialState.isOpen
  });
}

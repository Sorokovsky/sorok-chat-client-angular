import {Component, input, type InputSignal, type Signal} from '@angular/core';
import {Sidebar} from '@/components/ui/sidebar/sidebar';
import {Store} from '@ngrx/store';
import {toSignal} from '@angular/core/rxjs-interop';
import {isChatsSidebarOpenSidebar} from '@/stores/chats-sidebar/chats-sidebar.selectors';
import {initialState} from '@/stores/chats-sidebar/chats-sidebar.reducers';
import {SidebarPosition} from '@/schemes/sidebar-position.scheme';
import {Heading} from '@/components/ui/heading/heading';
import {useChatsByMe} from '@/hooks/chats-by-me.hook';
import {type CreateQueryResult} from '@tanstack/angular-query-experimental';
import {type Chat} from '@/schemes/chat.schema';
import {RouterLink} from '@angular/router';
import {CHATS_PAGE} from '@/constants/pages.constants';
import {type Page} from '@/schemes/page.schema';

@Component({
  selector: 'app-chats-sidebar',
  imports: [
    Sidebar,
    Heading,
    RouterLink,
  ],
  templateUrl: './chats-sidebar.html',
  styleUrl: './chats-sidebar.scss',
  standalone: true
})
export class ChatsSidebar {
  public isSidebarOpen: Signal<boolean>;
  public position: InputSignal<SidebarPosition> = input<SidebarPosition>(SidebarPosition.left);
  private readonly store: Store;
  protected chats: CreateQueryResult<Chat[]> = useChatsByMe();
  protected readonly CHATS_PAGE: Page = CHATS_PAGE;

  constructor(store: Store) {
    this.store = store;
    this.isSidebarOpen = toSignal(this.store.select(isChatsSidebarOpenSidebar), {
      initialValue: initialState.isOpen
    });
  }
}

import {type ActionReducer, createReducer, on} from '@ngrx/store';
import type {ChatsSidebar} from './chats-sidebar.types';
import {hideChats, showChats, toggleChats} from './chats-sidebar.actions';

export const initialState: ChatsSidebar = {
  isOpen: false
}

export const chatsSidebarReducer: ActionReducer<ChatsSidebar> =
  createReducer<ChatsSidebar>(
    initialState,
    on(showChats, (state: ChatsSidebar): ChatsSidebar => ({...state, isOpen: true})),
    on(hideChats, (state: ChatsSidebar): ChatsSidebar => ({...state, isOpen: false})),
    on(toggleChats, (state: ChatsSidebar): ChatsSidebar => ({...state, isOpen: !state.isOpen})),
  );

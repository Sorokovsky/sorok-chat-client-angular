import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from '@ngrx/store';
import type {ChatsSidebar} from './chats-sidebar.types';

export const chatsSidebarState: MemoizedSelector<object, ChatsSidebar, DefaultProjectorFn<ChatsSidebar>> =
  createFeatureSelector<ChatsSidebar>("chatsSidebar")

export const isChatsSidebarOpenSidebar =
  createSelector(
    chatsSidebarState,
    state => state.isOpen
  )

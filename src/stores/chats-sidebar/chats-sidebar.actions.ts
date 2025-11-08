import {createAction} from '@ngrx/store';

export const showChats = createAction("show-chats-sidebar");
export const hideChats = createAction("hide-chats-sidebar");
export const toggleChats = createAction("toggle-chats-sidebar");

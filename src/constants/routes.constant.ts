import type {Routes} from '@angular/router';
import {ChatsLayout} from '@/components/layouts/chats-layout/chats-layout.component';
import {privateGuard} from '@/guards/private.guard';
import {Chats} from '@/components/pages/chats/chats';
import {publicGuard} from '@/guards/public.guard';
import {Login} from '@/components/pages/login/login';
import {AuthLayout} from '@/components/layouts/auth-layout/auth-layout';
import {Logout} from '@/components/pages/logout/logout';
import {AUTH_PAGE, CHATS_PAGE, CREATE_CHAT, LOGIN_PAGE, LOGOUT_PAGE} from '@/constants/pages.constants';
import {Chat} from '@/components/pages/chat/chat';
import {CreateChat} from '@/components/pages/create-chat/create-chat';

export const ROUTES: Routes = [
  {
    path: "",
    redirectTo: CHATS_PAGE.lastPath,
    pathMatch: "full"
  },
  {
    path: CHATS_PAGE.lastPath,
    component: ChatsLayout,
    children: [
      {
      path: "",
      component: Chats
      },
      {
        path: LOGOUT_PAGE.lastPath,
        component: Logout,
        pathMatch: "full"
      },
      {
        path: CREATE_CHAT.lastPath,
        component: CreateChat,
        pathMatch: "full"
      },
      {
        path: ":id",
        component: Chat
      },
    ],
    canActivateChild: [privateGuard],
  },
  {
    path: AUTH_PAGE.lastPath,
    component: AuthLayout,
    children: [
      {
        path: LOGIN_PAGE.lastPath,
      component: Login
      }
    ],
    canActivateChild: [publicGuard]
  }
];

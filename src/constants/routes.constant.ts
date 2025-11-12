import type {Routes} from '@angular/router';
import {ChatsLayout} from '@/components/layouts/chats-layout/chats-layout.component';
import {privateGuard} from '@/guards/private.guard';
import {Chats} from '@/components/pages/chats/chats';
import {publicGuard} from '@/guards/public.guard';
import {Login} from '@/components/pages/login/login';
import {AuthLayout} from '@/components/layouts/auth-layout/auth-layout';
import {Logout} from '@/components/pages/logout/logout';

export const ROUTES: Routes = [
  {
    path: "",
    redirectTo: "chats",
    pathMatch: "full"
  },
  {
    path: "chats",
    component: ChatsLayout,
    children: [
      {
      path: "",
      component: Chats
      },
      {
        path: "logout",
        component: Logout
      }
    ],
    canActivateChild: [privateGuard],
  },
  {
    path: "auth",
    component: AuthLayout,
    children: [
      {
      path: "login",
      component: Login
      }
    ],
    canActivateChild: [publicGuard]
  }
];

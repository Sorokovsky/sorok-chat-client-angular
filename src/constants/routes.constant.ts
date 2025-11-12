import type {Routes} from '@angular/router';
import {MainLayout} from '@/components/layouts/main-layout/main-layout';
import {privateGuard} from '@/guards/private.guard';
import {Chats} from '@/components/pages/chats/chats';
import {publicGuard} from '@/guards/public.guard';
import {Login} from '@/components/pages/login/login';

export const ROUTES: Routes = [
  {
    path: "chats",
    component: MainLayout,
    children: [{
      path: "",
      component: Chats
    }],
    canActivateChild: [privateGuard],
  },
  {
    path: "auth",
    component: MainLayout,
    children: [{
      path: "login",
      component: Login
    }],
    canActivateChild: [publicGuard]
  }
];

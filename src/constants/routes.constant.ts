import type {Routes} from '@angular/router';
import {MainLayout} from '@/components/layouts/main-layout/main-layout';
import {privateGuardGuard} from '@/guards/private.guard-guard';
import {Chats} from '@/components/pages/chats/chats';

export const ROUTES: Routes = [
  {
    path: "chats",
    component: MainLayout,
    children: [{
      path: "",
      component: Chats
    }],
    canActivateChild: [privateGuardGuard],
  },
  {
    path: "auth",
    component: MainLayout,
  }
];

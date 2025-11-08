import type {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {ROUTES} from '@/constants/routes.constant';
import {provideStore} from '@ngrx/store';
import {chatsSidebarReducer} from '@/stores/chats-sidebar/chats-sidebar.reducers';
import {provideEffects} from '@ngrx/effects';
import {provideStoreDevtools} from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(ROUTES),
    provideHttpClient(),
    provideStore({
      chatsSidebar: chatsSidebarReducer
    }),
    provideEffects(),
    provideStoreDevtools()
  ],
};

import type {ApplicationConfig} from '@angular/core';
import {provideTanStackQuery, QueryClient} from "@tanstack/angular-query-experimental"
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ROUTES} from '@/constants/routes.constant';
import {provideStore} from '@ngrx/store';
import {chatsSidebarReducer} from '@/stores/chats-sidebar/chats-sidebar.reducers';
import {provideEffects} from '@ngrx/effects';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {authenticationInterceptor} from '@/interceptors/authentication.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(ROUTES),
    provideHttpClient(
      withInterceptors([authenticationInterceptor])
    ),
    provideStore({
      chatsSidebar: chatsSidebarReducer
    }),
    provideEffects(),
    provideStoreDevtools(),
    provideTanStackQuery(new QueryClient())
  ],
};

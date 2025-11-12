import {Router, type UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {AccessTokenStorageService} from '@/services/access-token-storage.service';
import {CHATS_PAGE} from '@/constants/pages.constants';

export function publicGuard(): boolean | UrlTree {
  const router: Router = inject(Router);
  const accessTokenStorageService: AccessTokenStorageService = inject(AccessTokenStorageService);
  const isAuthenticated: boolean = accessTokenStorageService.getTokenFromLocalStorage() !== AccessTokenStorageService.DEFAULT_TOKEN
  return isAuthenticated ? router.createUrlTree(CHATS_PAGE.pathsArray) : true;
}

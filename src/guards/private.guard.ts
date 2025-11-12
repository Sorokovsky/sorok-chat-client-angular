import {Router, type UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {AccessTokenStorageService} from '@/services/access-token-storage.service';
import {LOGIN_PAGE} from '@/constants/pages.constants';

export function privateGuard(): boolean | UrlTree {
  const router: Router = inject(Router);
  const accessTokenStorageService: AccessTokenStorageService = inject(AccessTokenStorageService);
  const isAuthenticated: boolean = accessTokenStorageService.getTokenFromLocalStorage() !== AccessTokenStorageService.DEFAULT_TOKEN
  return isAuthenticated ? true : router.createUrlTree(LOGIN_PAGE.pathsArray);
}

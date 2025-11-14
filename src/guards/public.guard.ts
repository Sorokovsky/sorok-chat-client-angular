import {Router, type UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {AccessTokenStorageService} from '@/services/access-token-storage.service';
import {CHATS_PAGE} from '@/constants/pages.constants';

export function publicGuard(): boolean | UrlTree {
  const router: Router = inject(Router);
  const pats: string[] = location.href.split("/");
  const lastPath: string = pats[pats.length - 1];
  let id: number | null;
  try {
    id = Number(lastPath);
  } catch (error) {
    id = null;
  }
  const urlTree: string[] = CHATS_PAGE.pathsArray;
  if (id) urlTree.push(String(id));
  const accessTokenStorageService: AccessTokenStorageService = inject(AccessTokenStorageService);
  const isAuthenticated: boolean = accessTokenStorageService.getTokenFromLocalStorage() !== AccessTokenStorageService.DEFAULT_TOKEN;
  return isAuthenticated ? router.createUrlTree(urlTree) : true;
}

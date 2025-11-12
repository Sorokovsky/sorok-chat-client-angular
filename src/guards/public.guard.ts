import {Router, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import type {CreateQueryResult} from '@tanstack/angular-query-experimental';
import type {User} from '@/schemes/user.schema';
import {useProfile} from '@/hooks/profile.hook';

export function publicGuard(): boolean | UrlTree {
  const router: Router = inject(Router);

  const profile: CreateQueryResult<User> = useProfile();
  const notAuthenticated: boolean = !profile.isSuccess();
  if (notAuthenticated) {
    return true;
  }
  return router.createUrlTree(["chats"])
}

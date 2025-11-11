import {Router, type UrlTree} from '@angular/router';
import {type CreateQueryResult} from '@tanstack/angular-query-experimental';
import {useProfile} from '@/hooks/profile.hook';
import {type User} from '@/schemes/user.schema';
import {inject} from '@angular/core';

export function privateGuardGuard(): boolean | UrlTree {
  const router: Router = inject(Router);

  const profile: CreateQueryResult<User> = useProfile();
  const authenticated: boolean = profile.isError();
  if (authenticated) {
    return true;
  }
  return router.createUrlTree(["/auth"])
}

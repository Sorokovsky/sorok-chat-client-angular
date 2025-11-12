import {computed, Signal} from '@angular/core';
import {useProfile} from '@/hooks/profile.hook';
import {type CreateQueryResult} from '@tanstack/angular-query-experimental';
import {type User} from '@/schemes/user.schema';

export function useIsAuthenticated(): Signal<boolean> {
  const profile: CreateQueryResult<User> = useProfile();
  return computed((): boolean => profile.isSuccess() && !!profile.data())
}

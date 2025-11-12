import {AuthorizationService} from '@/services/authorization.service';
import {inject} from '@angular/core';
import {type CreateQueryOptions, type CreateQueryResult, injectQuery} from '@tanstack/angular-query-experimental';
import {PROFILE_KEY} from '@/constants/queries.constants';
import {lastValueFrom} from 'rxjs';
import {type User} from '@/schemes/user.schema';

export function useProfile(): CreateQueryResult<User> {
  const authorizationService: AuthorizationService = inject(AuthorizationService);
  return injectQuery((): CreateQueryOptions<User> => ({
    queryKey: [PROFILE_KEY],
    queryFn: async (): Promise<User> => {
      return await lastValueFrom(authorizationService.getProfile());
    },
    retry: 0,
  }))
}

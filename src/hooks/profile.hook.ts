import {AuthorizationService} from '@/services/authorization.service';
import {inject} from '@angular/core';
import {injectQuery} from '@tanstack/angular-query-experimental';
import {PROFILE_KEY} from '@/constants/queries.constants';
import {lastValueFrom} from 'rxjs';
import {type User} from '@/schemes/user.schema';

export const useProfile = () => {
  const authorizationService: AuthorizationService = inject(AuthorizationService);
  return injectQuery(() => ({
    queryKey: [PROFILE_KEY],
    queryFn: async (): Promise<User> => {
      return await lastValueFrom(authorizationService.getProfile());
    },
    retry: 0
  }))
}

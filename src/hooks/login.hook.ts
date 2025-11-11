import {AuthorizationService} from '@/services/authorization.service';
import {
  type CreateMutationOptions,
  type CreateMutationResult,
  injectMutation
} from '@tanstack/angular-query-experimental';
import {inject} from '@angular/core';
import type {User} from '@/schemes/user.schema';
import {lastValueFrom} from 'rxjs';
import {LOGIN_KEY} from '@/constants/queries.constants';
import {LoginUser} from '@/schemes/login-user.schema';

export function useLogin(): CreateMutationResult<User, Error, LoginUser, void> {
  const authorizationService: AuthorizationService = inject(AuthorizationService);
  return injectMutation<User, Error, LoginUser, void>((): CreateMutationOptions<User, Error, LoginUser, void> => ({
      mutationKey: [LOGIN_KEY],
      mutationFn: async (data: LoginUser): Promise<User> => {
        return await lastValueFrom<User>(authorizationService.login(data))
      },
    })
  )
}

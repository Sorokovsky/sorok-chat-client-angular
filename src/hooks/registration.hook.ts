import {
  type CreateMutationOptions,
  type CreateMutationResult,
  injectMutation,
  QueryClient
} from '@tanstack/angular-query-experimental';
import {type User} from '@/schemes/user.schema';
import {type RegisterUser} from '@/schemes/register-user.schema';
import {PROFILE_KEY, REGISTER_KEY} from '@/constants/queries.constants';
import {lastValueFrom} from 'rxjs';
import {AuthorizationService} from '@/services/authorization.service';
import {inject} from '@angular/core';

export function useRegistration(): CreateMutationResult<User, Error, RegisterUser, void> {
  const authorizationService: AuthorizationService = inject(AuthorizationService);
  const queryClient = new QueryClient();
  return injectMutation<User, Error, RegisterUser, void>((): CreateMutationOptions<User, Error, RegisterUser, void> => ({
    mutationKey: [REGISTER_KEY],
    mutationFn: async (dto: RegisterUser): Promise<User> => {
      return await lastValueFrom(authorizationService.register(dto));
    },
    async onSettled(): Promise<void> {
      await queryClient.refetchQueries({queryKey: [PROFILE_KEY], exact: false});
    }
  }));
}

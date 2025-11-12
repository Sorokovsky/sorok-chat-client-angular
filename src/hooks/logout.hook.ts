import {
  type CreateMutationOptions,
  type CreateMutationResult,
  injectMutation,
  QueryClient
} from '@tanstack/angular-query-experimental';
import {LOGOUT_KEY, PROFILE_KEY} from '@/constants/queries.constants';
import {AuthorizationService} from '@/services/authorization.service';
import {inject} from '@angular/core';
import {lastValueFrom} from 'rxjs';

export function useLogout(): CreateMutationResult<unknown, Error, void, void> {
  const authorizationService: AuthorizationService = inject(AuthorizationService)
  const queryClient: QueryClient = inject(QueryClient);
  return injectMutation((): CreateMutationOptions<unknown, Error, void, void> => ({
    mutationKey: [LOGOUT_KEY],
    mutationFn: async (): Promise<void> => {
      return await lastValueFrom(authorizationService.logout())
    },
    async onSettled(): Promise<void> {
      await queryClient.refetchQueries({queryKey: [PROFILE_KEY], exact: false});
    }
  }));
}

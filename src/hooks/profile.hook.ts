import {AuthorizationService} from '@/services/authorization.service';
import {inject} from '@angular/core';
import {type CreateQueryOptions, type CreateQueryResult, injectQuery} from '@tanstack/angular-query-experimental';
import {PROFILE_KEY} from '@/constants/queries.constants';
import {lastValueFrom} from 'rxjs';
import {type User} from '@/schemes/user.schema';
import {RsaKeysStorageService} from '@/services/rsa-keys-storage.service';

export function useProfile(): CreateQueryResult<User> {
  const authorizationService: AuthorizationService = inject(AuthorizationService);
  const rsaKeyStorageService: RsaKeysStorageService = inject(RsaKeysStorageService);
  return injectQuery((): CreateQueryOptions<User> => ({
    queryKey: [PROFILE_KEY],
    queryFn: async (): Promise<User> => {
      const user: User = await lastValueFrom(authorizationService.getProfile());
      const keys = await rsaKeyStorageService.getKeyPair();
      await lastValueFrom(authorizationService.setPublicRsaKey(keys.publicKey));
      return user;
    },
    retry: 0,
  }))
}

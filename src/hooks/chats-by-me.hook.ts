import {inject} from '@angular/core';
import {ChatsService} from '@/services/chats.service';
import {type CreateQueryOptions, type CreateQueryResult, injectQuery} from '@tanstack/angular-query-experimental';
import {type Chat} from '@/schemes/chat.schema';
import {GET_CHATS_KEY} from '@/constants/queries.constants';
import {lastValueFrom} from 'rxjs';

export function useChatsByMe(): CreateQueryResult<Chat[]> {
  const chatsService: ChatsService = inject(ChatsService);

  return injectQuery((): CreateQueryOptions<Chat[]> => ({
    queryKey: [GET_CHATS_KEY],
    queryFn: async (): Promise<Chat[]> => {
      return await lastValueFrom(chatsService.getByMe());
    }
  }));
}

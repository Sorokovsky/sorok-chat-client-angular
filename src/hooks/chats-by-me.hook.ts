import {inject} from '@angular/core';
import {ChatsService} from '@/services/chats.service';
import {type CreateQueryOptions, type CreateQueryResult, injectQuery} from '@tanstack/angular-query-experimental';
import {type Chat} from '@/schemes/chat.schema';
import {GET_CHATS_KEY} from '@/constants/queries.constants';
import {lastValueFrom} from 'rxjs';
import {MessagesService} from '@/services/messages.service';

export function useChatsByMe(): CreateQueryResult<Chat[]> {
  const chatsService: ChatsService = inject(ChatsService);
  const messagesService: MessagesService = inject(MessagesService);

  return injectQuery((): CreateQueryOptions<Chat[]> => ({
    queryKey: [GET_CHATS_KEY],
    queryFn: async (): Promise<Chat[]> => {
      const chats = await lastValueFrom(chatsService.getByMe());
      await messagesService.connectIfPossible();
      chats.forEach((chat: Chat) => {
        messagesService.joinToChat(chat.id);
      })
      return chats;
    },
  }));
}

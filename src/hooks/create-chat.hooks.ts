import {
  type CreateMutationOptions,
  type CreateMutationResult,
  injectMutation,
  QueryClient
} from '@tanstack/angular-query-experimental';
import {type Chat} from '@/schemes/chat.schema';
import {CREATE_CHAT_KEY, GET_CHATS_KEY} from '@/constants/queries.constants';
import {lastValueFrom} from 'rxjs';
import {ChatsService} from '@/services/chats.service';
import {inject} from '@angular/core';
import {type NewChat} from '@/schemes/new-chat.scheme';
import {Router} from '@angular/router';
import {CHATS_PAGE} from '@/constants/pages.constants';

export function useCreateChat(): CreateMutationResult<Chat, Error, NewChat, void> {
  const client: QueryClient = inject(QueryClient);
  const router: Router = inject(Router);
  const chatsService: ChatsService = inject(ChatsService);
  return injectMutation((): CreateMutationOptions<Chat, Error, NewChat, void> => ({
    mutationKey: [CREATE_CHAT_KEY],
    mutationFn: async (chat: NewChat): Promise<Chat> => {
      return await lastValueFrom(chatsService.createChat(chat))
    },
    async onSuccess(chat: Chat): Promise<void> {
      await client.invalidateQueries({queryKey: [GET_CHATS_KEY]});
      const paths: string[] = [...CHATS_PAGE.pathsArray, `${chat.id}`];
      await router.navigate(paths);
    }
  }));
}

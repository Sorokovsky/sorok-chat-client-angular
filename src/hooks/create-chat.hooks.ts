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
import {Router} from '@angular/router';
import {CHATS_PAGE} from '@/constants/pages.constants';
import {MessagesService} from '@/services/messages.service';
import {type CreateChat} from '@/schemes/create-chat.schema';

export function useCreateChat(): CreateMutationResult<Chat, Error, CreateChat, void> {
  const client: QueryClient = inject(QueryClient);
  const router: Router = inject(Router);
  const chatsService: ChatsService = inject(ChatsService);
  const messagesService: MessagesService = inject(MessagesService);
  return injectMutation((): CreateMutationOptions<Chat, Error, CreateChat, void> => ({
    mutationKey: [CREATE_CHAT_KEY],
    mutationFn: async (chat: CreateChat): Promise<Chat> => {
      return await lastValueFrom(chatsService.createChat(chat, chat.opponentEmail))
    },
    async onSuccess(chat: Chat): Promise<void> {
      await messagesService.connectIfPossible();
      await messagesService.joinToChat(chat.id);
      await client.invalidateQueries({queryKey: [GET_CHATS_KEY]});
      const paths: string[] = [...CHATS_PAGE.pathsArray, `${chat.id}`];
      await router.navigate(paths);
    }
  }));
}

import {
  type CreateMutationOptions,
  type CreateMutationResult,
  injectMutation
} from '@tanstack/angular-query-experimental';
import {type Chat} from '@/schemes/chat.schema';
import {type WriteMessage} from '@/schemes/write-message.scheme';
import {WRITE_MESSAGE_URL} from '@/constants/backend-api.constants';
import {lastValueFrom} from 'rxjs';
import {ChatsService} from '@/services/chats.service';
import {inject} from '@angular/core';

export function useWriteMessage(): CreateMutationResult<Chat, Error, WriteMessage, void> {
  const chatsService: ChatsService = inject(ChatsService);
  return injectMutation((): CreateMutationOptions<Chat, Error, WriteMessage, void> => ({
    mutationKey: [WRITE_MESSAGE_URL],
    mutationFn: async ({message, chatId}: WriteMessage): Promise<Chat> => {
      return await lastValueFrom(chatsService.sendMessage(message, chatId));
    }
  }));
}

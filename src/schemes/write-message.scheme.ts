import {type NewMessage} from '@/schemes/new-message.schema';

export type WriteMessage = {
  chatId: number;
  message: NewMessage;
};

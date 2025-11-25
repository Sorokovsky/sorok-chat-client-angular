import {type NewMessage} from '@/schemes/new-message.schema';

export type SentMessage = {
  chatId: number;
  message: NewMessage;
};

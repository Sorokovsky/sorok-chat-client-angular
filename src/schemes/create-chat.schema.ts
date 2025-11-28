import {NewChatScheme} from '@/schemes/new-chat.scheme';
import {z as zod} from 'zod';

export const CreateChatScheme = NewChatScheme.extend({
  opponentEmail: zod.email()
});

export type CreateChat = zod.infer<typeof CreateChatScheme>;

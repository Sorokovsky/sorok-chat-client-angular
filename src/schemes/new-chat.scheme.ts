import {z as zod} from 'zod';
import {ChatSchema} from '@/schemes/chat.schema';

export const NewChatScheme = ChatSchema.pick({
  title: true,
  description: true,
});

export type NewChat = zod.infer<typeof NewChatScheme>;

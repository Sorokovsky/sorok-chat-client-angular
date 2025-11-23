import {z as zod} from 'zod';
import {MessageSchema} from '@/schemes/message.schema';

export const ReceivedMessageScheme = zod.object({
  message: MessageSchema,
  chatId: zod.number().positive()
});

export type ReceivedMessage = zod.infer<typeof ReceivedMessageScheme>;

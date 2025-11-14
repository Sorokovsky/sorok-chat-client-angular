import {z as zod} from 'zod';
import {MessageSchema} from '@/schemes/message.schema';

export const NewMessageSchema = MessageSchema.pick({
  mac: true,
  text: true,
});

export type NewMessage = zod.infer<typeof NewMessageSchema>;

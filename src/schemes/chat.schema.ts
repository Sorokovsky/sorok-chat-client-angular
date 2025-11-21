import {z as zod} from "zod";
import {BaseScheme} from '@/schemes/base.scheme';
import {UserSchema} from '@/schemes/user.schema';
import {MessageSchema} from '@/schemes/message.schema';

export const ChatSchema = BaseScheme.extend({
  title: zod.string(),
  description: zod.string(),
  members: UserSchema.array(),
  messages: MessageSchema.array()
});

export type Chat = zod.infer<typeof ChatSchema>;

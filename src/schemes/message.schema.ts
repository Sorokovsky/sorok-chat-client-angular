import {z as zod} from 'zod';
import {BaseScheme} from '@/schemes/base.scheme';
import {UserSchema} from '@/schemes/user.schema';

export const MessageSchema = BaseScheme.extend({
  text: zod.string(),
  mac: zod.string(),
  author: UserSchema
});

export type Message = zod.infer<typeof MessageSchema>;

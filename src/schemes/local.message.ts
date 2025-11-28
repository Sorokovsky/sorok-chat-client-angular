import {MessageSchema} from '@/schemes/message.schema';
import {z as zod} from 'zod';

export const LocalMessageScheme = MessageSchema.omit({
  mac: true
}).extend({
  isValid: zod.boolean(),
  chatId: zod.number().positive()
});

export type LocalMessage = zod.infer<typeof LocalMessageScheme>;

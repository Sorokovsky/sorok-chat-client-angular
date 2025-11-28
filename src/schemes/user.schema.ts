import {z as zod} from "zod"
import {RegisterUserSchema} from '@/schemes/register-user.schema';

export const UserSchema = RegisterUserSchema.omit({
  password: true
});

export type User = zod.infer<typeof UserSchema>;

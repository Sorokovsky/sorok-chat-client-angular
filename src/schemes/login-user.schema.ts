import {z as zod} from 'zod';
import {RegisterUserSchema} from '@/schemes/register-user.schema';

export const LoginUserSchema = RegisterUserSchema.pick({
  email: true,
  password: true,
});

export type LoginUser = zod.infer<typeof LoginUserSchema>;

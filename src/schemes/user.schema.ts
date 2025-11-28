import {z as zod} from "zod"
import {RegisterUserSchema} from '@/schemes/register-user.schema';

export const UserSchema = RegisterUserSchema.omit({
  password: true
}).extend({
  id: zod.number(),
  createdAt: zod.coerce.date({
    message: "Дата створення має бути у форматі дати."
  }),
  updatedAt: zod.coerce.date({
    message: "Дата оновлення має бути у форматі дати."
  }),
});

export type User = zod.infer<typeof UserSchema>;

import {z as zod} from "zod";
import {MIN_PASSWORD_LENGTH} from '@/constants/validation.constants';

export const RegisterUserSchema = zod.object({
  email: zod.email({
    message: "Не корнктна електронна адреса."
  }),
  password: zod.string().min(MIN_PASSWORD_LENGTH, {
    message: `Папроль має мати довжину не меньше ${MIN_PASSWORD_LENGTH} символів.`
  }),
  firstName: zod.string({
    message: "Ім`я має бути рядком."
  }),
  lastName: zod.string({
    message: "Прізвище має бути рядком."
  }),
  middleName: zod.string({
    message: "Побатькові має бути рядком"
  }),
  publicRsaKey: zod.string()
});

export type RegisterUser = zod.infer<typeof RegisterUserSchema>;

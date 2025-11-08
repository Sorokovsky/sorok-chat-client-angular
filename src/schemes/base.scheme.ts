import {z as zod} from "zod";

export const BaseScheme = zod.object({
  id: zod.number({
    message: "Унікальний ідентифікатор має бути числом."
  }),
  createdAt: zod.date({
    message: "Дата створення має бути у форматі дати."
  }),
  updatedAt: zod.date({
    message: "Дата оновлення має бути у форматі дати."
  }),
});

import { z } from "zod";

export const TodoItemSchema = z.object({
  date: z.date(),
  description: z.string(),
});

export type TodoItem = z.infer<typeof TodoItemSchema>;

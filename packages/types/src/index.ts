import { z } from "zod";

export const TodoItemSchema = z.object({
  dateTime: z.date(),
  description: z.string(),
  duration: z.number(),
  recurring: z.boolean(),
});

export type TodoItem = z.infer<typeof TodoItemSchema>;

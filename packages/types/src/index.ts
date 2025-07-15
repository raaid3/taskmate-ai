import { z } from "zod";

export const TodoItemSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string().nullable().optional(),
  startDateTime: z.date({ error: "Not a valid date" }),
  endDateTime: z.date({ error: "Not a valid date" }).nullable().optional(),
  isRecurring: z.boolean(),
  recurrenceRule: z.string().nullable().optional(),
  authorId: z.number().int(),
});

export const TodoItemCreateSchema = TodoItemSchema.omit({
  id: true,
  authorId: true,
});
export type TodoItemCreate = z.infer<typeof TodoItemCreateSchema>;
export type TodoItem = z.infer<typeof TodoItemSchema>;

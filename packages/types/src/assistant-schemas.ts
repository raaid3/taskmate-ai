import { TodoItemSchema, type TodoItem } from "./todo-event-schemas.js";
import { z } from "zod";

export const AssistantResponseFormat = z.object({
  rescheduled_events: z.array(TodoItemSchema),
  reason: z.string(),
  new_events: z.array(TodoItemSchema),
  delete_events: z.array(z.int()),
});

// export type AssistantResponse = z.infer<typeof AssistantResponseFormat>;
export type AssistantResponse = {
  rescheduled_events: TodoItem[];
  reason: string;
  new_events: TodoItem[];
  delete_events: number[];
};

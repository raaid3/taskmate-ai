import { z } from "zod";
import { rruleStringSchema } from "./rrule-schema.js";

const BaseSchema = z.object({
  id: z.number(),
  authorId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
});

// schemas used to move todos events around in the backend
const SimpleEventSchema = z.object({
  ...BaseSchema.shape,
  startDateTime: z.iso.datetime({ precision: -1 }),
  endDateTime: z.iso.datetime({ precision: -1 }),
});

const RecurringEventSchema = SimpleEventSchema.extend({
  rrule: rruleStringSchema,
});

function preprocessTodoItem(item: Record<string, any>) {
  return {
    ...item,
    description: item.description ? item.description : undefined,
  };
}

export const TodoItemSchema = z.preprocess(
  preprocessTodoItem,
  z.discriminatedUnion("type", [
    SimpleEventSchema.extend({ type: z.literal("simple") }),
    RecurringEventSchema.extend({ type: z.literal("recurring") }),
  ])
);

export const TodoItemCreateSchema = z.discriminatedUnion("type", [
  SimpleEventSchema.omit({ id: true, authorId: true }).extend({
    type: z.literal("simple"),
  }),
  RecurringEventSchema.omit({ id: true, authorId: true }).extend({
    type: z.literal("recurring"),
  }),
]);

export type TodoItem = z.infer<typeof TodoItemSchema>;
export type TodoItemCreate = z.infer<typeof TodoItemCreateSchema>;

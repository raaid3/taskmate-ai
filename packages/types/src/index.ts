import { z } from "zod";

// Base schema with common fields
const BaseEventSchema = z.object({
  title: z.string({ message: "Title is required" }),
  description: z.string().optional(),
});

export const SimpleEventSchema = BaseEventSchema.extend({
  start: z.iso.datetime({ local: true }),
  end: z.iso.datetime({ local: true }).or(z.literal("")).optional(),
});

export const RecurringEventSchema = BaseEventSchema.extend({
  daysOfWeek: z
    .array(
      z.enum(["0", "1", "2", "3", "4", "5", "6"], { error: "Invalid day" }),
      "Select at least one day of the week"
    )
    .min(1, { message: "Select at least one day of the week" }),
  startTime: z.iso.time(),
  endTime: z.iso.time().or(z.literal("")).optional(),
});

export const EventSchema = z.discriminatedUnion("type", [
  SimpleEventSchema.extend({ type: z.literal("simple") }),
  RecurringEventSchema.extend({ type: z.literal("recurring") }),
]);

export const TodoItemSchema = z
  .object({
    id: z.number().int(),
    authorId: z.number().int(),
  })
  .and(EventSchema);

export const TodoItemCreateSchema = EventSchema;

// Type exports
export type SimpleEvent = z.infer<typeof SimpleEventSchema>;
export type RecurringEvent = z.infer<typeof RecurringEventSchema>;
export type Event = z.infer<typeof EventSchema>;
export type TodoItem = z.infer<typeof TodoItemSchema>;
export type TodoItemCreate = z.infer<typeof TodoItemCreateSchema>;

import { z } from "zod";
import { RRule } from "rrule/dist/esm/index.js";

const NewBaseSchema = z.object({
  id: z.number(),
  authorId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
});

// schemas used to move todos events around in the backend
export const NewSimpleEventSchema = z.object({
  ...NewBaseSchema.shape,
  startDateTime: z.iso.datetime({ precision: -1 }),
  endDateTime: z.iso.datetime({ precision: -1 }),
});

export const rruleStringSchema = z.string().refine(
  (val) => {
    try {
      RRule.fromString(val);
      return true;
    } catch {
      return false;
    }
  },
  {
    message: "Invalid rrule string",
  }
);

export const NewRecurringEventSchema = NewSimpleEventSchema.extend({
  rrule: rruleStringSchema,
});

export const NewTodoItemSchema = z.discriminatedUnion("type", [
  NewSimpleEventSchema.extend({ type: z.literal("simple") }),
  NewRecurringEventSchema.extend({ type: z.literal("recurring") }),
]);

export const NewTodoItemCreateSchema = z.discriminatedUnion("type", [
  NewSimpleEventSchema.omit({ id: true, authorId: true }).extend({
    type: z.literal("simple"),
  }),
  NewRecurringEventSchema.omit({ id: true, authorId: true }).extend({
    type: z.literal("recurring"),
  }),
]);

export type NewTodoItem = z.infer<typeof NewTodoItemSchema>;
export type NewTodoItemCreate = z.infer<typeof NewTodoItemCreateSchema>;

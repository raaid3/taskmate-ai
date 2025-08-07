import { z } from "zod";

// Base schema with common fields
const BaseEventSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, { message: "Title is required" }),
  description: z.string().optional(),
});

export const SimpleEventSchema = BaseEventSchema.extend({
  type: z.literal("simple"),
  start: z.iso.datetime({ local: true }),
  end: z.iso.datetime({ local: true }).or(z.literal("")).optional(),
});

export const RecurringEventSchema = BaseEventSchema.extend({
  type: z.literal("recurring"),
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

export const TodoItemSchema = z.preprocess(
  (val: Record<string, any>) => {
    for (const key in val) {
      if (val[key] === null) {
        val[key] = undefined;
      } else if (
        key === "daysOfWeek" &&
        Array.isArray(val[key]) &&
        val[key].length === 0
      ) {
        val[key] = undefined;
      }
    }
    return val;
  },
  z
    .object({
      id: z.number().int(),
      authorId: z.string(),
    })
    .and(EventSchema)
);

export const TodoItemCreateSchema = EventSchema;

export const UserSchema = z.object({
  sub: z.string().describe("Subject (User ID)"),
  name: z.string().optional().describe("User's full name"),
});

// Type exports

export interface PrismaReturnType {
  type: string;
  title: string;
  description: string | null;
  start: string | null;
  end: string | null;
  daysOfWeek: string[];
  startTime: string | null;
  endTime: string | null;
  id: number;
  authorId: string;
}

export const AssistantResponseFormat = z.object({
  rescheduled_events: z.array(TodoItemSchema),
  reason: z.string(),
  new_events: z.array(TodoItemSchema),
  delete_events: z.array(z.int()),
});

export type SimpleEvent = z.infer<typeof SimpleEventSchema>;
export type RecurringEvent = z.infer<typeof RecurringEventSchema>;
export type Event = SimpleEvent | RecurringEvent;
export type TodoItemCreate = Event;
export type TodoItem = { id: number; authorId: string } & Event;
export type User = z.infer<typeof UserSchema>;
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;
export type AssistantResponse = {
  rescheduled_events: TodoItem[];
  reason: string;
  new_events: TodoItem[];
  delete_events: number[];
};

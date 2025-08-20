import { z } from "zod";

// Base schema with common fields
const BaseEventSchema = z.object({
  title: z
    .string("Title: title must be a string")
    .min(1, "Title: title is required"),
  description: z.string().optional(),
});

const SimpleEventSchema = BaseEventSchema.extend({
  type: z.literal("simple", "Event type: must be 'simple'"),
  start: z.iso.datetime({
    local: true,
    error: "Start Date & Time: must be a valid ISO datetime string (required)",
  }),
  end: z.iso
    .datetime({
      local: true,
      error:
        "End Date & Time: must be a valid ISO datetime string or an empty string",
    })
    .or(z.literal(""))
    .optional(),
});

const RecurringEventSchema = BaseEventSchema.extend({
  type: z.literal("recurring", "Event type: must be 'recurring'"),
  daysOfWeek: z
    .array(
      z.enum(
        ["0", "1", "2", "3", "4", "5", "6"],
        "Recurring days: must be a valid day (0-6)"
      ),
      "Recurring days: at least one day must be selected"
    )
    .min(1, "Recurring days: at least one day must be selected"),
  startTime: z.iso.time(
    "Start time: must be a valid ISO time string (required)"
  ),
  endTime: z.iso
    .time("End time: must be a valid ISO time string or an empty string")
    .or(z.literal(""))
    .optional(),
});

const EventSchema = z.discriminatedUnion("type", [
  SimpleEventSchema.extend({ type: z.literal("simple") }),
  RecurringEventSchema.extend({ type: z.literal("recurring") }),
]);

const TodoItemSchema = z.preprocess(
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

const TodoItemCreateSchema = EventSchema;

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

type SimpleEvent = z.infer<typeof SimpleEventSchema>;
type RecurringEvent = z.infer<typeof RecurringEventSchema>;
type Event = SimpleEvent | RecurringEvent;
export type OldTodoItem = { id: number; authorId: string } & Event;
export type User = z.infer<typeof UserSchema>;
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;
export type AssistantResponse = {
  rescheduled_events: OldTodoItem[];
  reason: string;
  new_events: OldTodoItem[];
  delete_events: number[];
};

export * from "./form-schema.js";
export * from "./todo-event-schemas.js";
export * from "./full-calendar-event-schemas.js";

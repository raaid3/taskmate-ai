import { z } from "zod";
import { type TodoItem } from "./todo-event-schemas.js";
import { DateTime } from "luxon";
import { rruleStringSchema } from "./rrule-schema.js";

const SimpleEventSchema = z.object({
  id: z.string(),
  start: z.iso.datetime(),
  end: z.iso.datetime(),
  title: z.string(),
  description: z.string().optional(),
  type: z.literal("simple"),
});

export const FcSimpleEventSchema = z.preprocess(
  (val: Extract<TodoItem, { type: "simple" }>) => {
    return {
      id: val.id.toString(),
      start: val.startDateTime,
      end: val.endDateTime,
      title: val.title,
      description: val.description,
      type: "simple",
    };
  },
  SimpleEventSchema
);

const RecurringEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  rrule: rruleStringSchema,
  duration: z.iso.time(),
});

export const FcRecurringEventSchema = z.preprocess(
  (val: Extract<TodoItem, { type: "recurring" }>) => {
    const duration = DateTime.fromISO(val.endDateTime)
      .diff(DateTime.fromISO(val.startDateTime))
      .toFormat("hh:mm");

    const res = {
      id: val.id.toString(),
      title: val.title,
      description: val.description,
      rrule: `DTSTART:${DateTime.fromISO(val.startDateTime).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")}\n${val.rrule}`, // until has already been set, dtstart should be set here
      duration: duration,
    };

    return res;
  },
  RecurringEventSchema
);

export type FullCalendarEvent =
  | z.infer<typeof SimpleEventSchema>
  | z.infer<typeof RecurringEventSchema>;

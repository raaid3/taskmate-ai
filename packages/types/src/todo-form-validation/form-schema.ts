import { z } from "zod";

function emptyStrToUndefined(val: string | undefined) {
  return val === "" ? undefined : val;
}

// Defined schemas that describe the shape of the data being submitted
// through the TodoForm

export const BaseFormSchema = z.object({
  title: z.string().min(1, "Title: Title is required"),
  description: z
    .preprocess(emptyStrToUndefined, z.string().optional())
    .optional(),
});

export const SimpleEventFormSchema = z.object({
  ...BaseFormSchema.shape,
  startDate: z.iso.date("Date: Enter a valid ISO Date"),
  startTime: z.iso.time("Start Time: Enter a valid ISO Time"),
  endTime: z.iso.time("End Time: Enter a valid ISO Time"),
});

export const RecurringEventFormSchema = z.object({
  ...BaseFormSchema.shape,
  startDate: z.iso.date("Date: Enter a valid ISO Date"),
  startTime: z.iso.time("Start Time: Enter a valid ISO Time"),
  endTime: z.iso.time("End Time: Enter a valid ISO Time"),
  daysOfWeek: z
    .array(
      z.enum(["0", "1", "2", "3", "4", "5", "6"]),
      "Recurring Days: Must be a valid day (0-6)"
    )
    .min(1, "Recurring Days: Select atleast 1 day"),
  endDate: z
    .preprocess(
      emptyStrToUndefined,
      z.iso.date("End Date: Enter a valid ISO Date (optional)").optional()
    )
    .optional(),
});

export const TodoFormSchema = z.discriminatedUnion("type", [
  SimpleEventFormSchema.extend({ type: z.literal("simple") }),
  RecurringEventFormSchema.extend({ type: z.literal("recurring") }),
]);

export type TodoForm = z.infer<typeof TodoFormSchema>;

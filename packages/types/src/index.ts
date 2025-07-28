import { z } from "zod";

export type NullAsUndefined<T> = {
  [P in keyof T]: T[P] extends null ? undefined : T[P];
};

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
    authorId: z.string(),
  })
  .and(EventSchema);

export const TodoItemCreateSchema = EventSchema;

export const UserSchema = z.object({
  iss: z.string().url().describe("Issuer (Auth0 domain)"),
  sub: z.string().describe("Subject (User ID)"),
  aud: z.union([z.string(), z.array(z.string())]).describe("Audience"),
  iat: z.number().int().describe("Issued At (Unix timestamp)"),
  exp: z.number().int().describe("Expiration Time (Unix timestamp)"),
  azp: z.string().describe("Authorized Party (Client ID)"),
  scope: z.string().optional().describe("Scopes granted to the access token"),
  permissions: z
    .array(z.string())
    .optional()
    .describe("Permissions granted to the access token"),
  // Common user profile claims (if requested in scope)
  email: z.string().email().optional().describe("User's email address"),
  email_verified: z
    .boolean()
    .optional()
    .describe("Whether the user's email has been verified"),
  name: z.string().optional().describe("User's full name"),
  nickname: z.string().optional().describe("User's nickname"),
  picture: z
    .string()
    .url()
    .optional()
    .describe("URL to the user's profile picture"),
  given_name: z.string().optional().describe("User's given name"),
  family_name: z.string().optional().describe("User's family name"),
});

// Type exports
export type SimpleEvent = z.infer<typeof SimpleEventSchema>;
export type RecurringEvent = z.infer<typeof RecurringEventSchema>;
export type Event = z.infer<typeof EventSchema>;
export type TodoItem = z.infer<typeof TodoItemSchema>;
export type TodoItemCreate = z.infer<typeof TodoItemCreateSchema>;
export type User = z.infer<typeof UserSchema>;

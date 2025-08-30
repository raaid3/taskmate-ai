import { z } from "zod";
export const UserSchema = z.object({
  sub: z.string().describe("Subject (User ID)"),
  name: z.string().optional().describe("User's full name"),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export * from "./form-schema.js";
export * from "./todo-event-schemas.js";
export * from "./full-calendar-event-schemas.js";
export * from "./assistant-schemas.js";

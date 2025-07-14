import { publicProcedure, router } from "./trpc.js";
import { TodoItemSchema } from "@repo/types";
import * as db from "../db/db.js";
export const appRouter = router({
  getTodos: publicProcedure.query(() => {
    return db.getTodos();
  }),

  addTodo: publicProcedure.input(TodoItemSchema).mutation(async ({ input }) => {
    await db.addTodo(input);
    return { success: true };
  }),
});

export type AppRouter = typeof appRouter;

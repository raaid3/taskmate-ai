import { router, publicProcedure } from "../trpc.js";
import * as db from "../../db/db.js";
import { TodoItemSchema } from "@repo/types";

export const todosRouter = router({
  getTodos: publicProcedure.query(() => {
    return db.getTodos();
  }),

  addTodo: publicProcedure.input(TodoItemSchema).mutation(async ({ input }) => {
    await db.addTodo(input);
    return { success: true };
  }),
});

import { router, publicProcedure } from "../trpc.js";
import * as db from "../../db/db.js";
import { TodoItemCreateSchema } from "@repo/types";

export const todosRouter = router({
  getTodos: publicProcedure.query(() => {
    return db.getTodos();
  }),

  addTodo: publicProcedure
    .input(TodoItemCreateSchema)
    .mutation(async ({ input }) => {
      await db.addTodo({ ...input, authorId: 1 }); // example authorId
      return { success: true };
    }),
});

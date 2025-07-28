import { router, publicProcedure, protectedProcedure } from "../trpc.js";
import * as db from "../../db/db.js";
import {
  type TodoItem,
  TodoItemSchema,
  type TodoItemCreate,
  TodoItemCreateSchema,
} from "@repo/types";

export const todosRouter = router({
  getTodos: protectedProcedure
    .output(TodoItemSchema.array())
    .query(async ({ ctx }) => {
      console.log("Fetching todos for user:", ctx.user.sub);
      const todos = (await db.getTodos(ctx.user.sub)) as TodoItem[];
      return todos;
    }),

  addTodo: protectedProcedure
    .input(TodoItemCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const inputWithAuthId = { ...input, authorId: ctx.user.sub };

      const newTodo = await db.addTodo(inputWithAuthId);
      return newTodo as TodoItem;
    }),
});

import { router, protectedProcedure } from "../trpc.js";
import * as db from "../../db/db.js";
import {
  TodoItemCreateSchema,
  type TodoItemCreate,
  TodoItemSchema,
  type TodoItem,
} from "@repo/types";
import { z } from "zod";
import { getTodosResolver } from "../resolvers/get-todos-resolver.js";

export const todosRouter = router({
  getTodos: protectedProcedure.query(getTodosResolver),

  addTodo: protectedProcedure
    .input(TodoItemCreateSchema)
    .mutation(async ({ input, ctx }): Promise<TodoItemCreate> => {
      const inputWithAuthId = { ...input, authorId: ctx.user.id };

      const newTodo = await db.addTodo(inputWithAuthId);
      // console.log(JSON.stringify(input));
      return input;
    }),

  deleteTodo: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      console.log("Deleting todo with ID:", input.id, "for user:", ctx.user.id);
      await db.deleteTodo(input.id, ctx.user.id);
    }),

  updateTodo: protectedProcedure
    .input(TodoItemSchema)
    .mutation(async ({ input }): Promise<TodoItem> => {
      return await db.updateTodo(input);
    }),
});

import { router, publicProcedure, protectedProcedure } from "../trpc.js";
import * as db from "../../db/db.js";
import {
  type TodoItem,
  TodoItemSchema,
  type TodoItemCreate,
  TodoItemCreateSchema,
} from "@repo/types";
import { z } from "zod";

export const todosRouter = router({
  getTodos: protectedProcedure.query(async ({ ctx }): Promise<TodoItem[]> => {
    console.log("Fetching todos for user:", ctx.user.id);
    const todos = await db.getTodos(ctx.user.id);
    return todos;
  }),

  addTodo: protectedProcedure
    .input(TodoItemCreateSchema)
    .mutation(async ({ input, ctx }): Promise<TodoItem> => {
      const inputWithAuthId = { ...input, authorId: ctx.user.id };

      const newTodo = await db.addTodo(inputWithAuthId);
      return newTodo;
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

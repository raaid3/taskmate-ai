import { router, publicProcedure } from "../trpc.js";
import * as db from "../../db/db.js";
import {
  type TodoItem,
  TodoItemSchema,
  type TodoItemCreate,
  TodoItemCreateSchema,
} from "@repo/types";

export const todosRouter = router({
  getTodos: publicProcedure.output(TodoItemSchema.array()).query(async () => {
    const todos = (await db.getTodos()) as TodoItem[];

    // set of daysOfWeek from empty array to undefined
    // since empty daysOfWeek array will break calendar
    return todos.map((todo) => {
      if (todo.type === "simple") {
        if (
          "daysOfWeek" in todo &&
          (todo.daysOfWeek as string[]).length === 0
        ) {
          return {
            ...todo,
            daysOfWeek: undefined,
          };
        }
      }
      return todo;
    });
  }),

  addTodo: publicProcedure
    .input(TodoItemCreateSchema)
    .mutation(async ({ input }: { input: TodoItemCreate }) => {
      // add authorId to input
      // sample authorId for now
      const inputWithAuthId = { ...input, authorId: 1 };

      const newTodo = await db.addTodo(inputWithAuthId);
      return newTodo as TodoItem;
    }),
});

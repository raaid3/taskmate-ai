import { publicProcedure, router } from "./trpc.js";
import { TodoItemSchema } from "@repo/types";
import * as db from "../db/db.js";
import { todosRouter } from "./routes/todos.js";

export const appRouter = router({
  todos: todosRouter,
});

export type AppRouter = typeof appRouter;

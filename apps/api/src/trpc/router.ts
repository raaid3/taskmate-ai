import { publicProcedure, router } from "./trpc.js";
import { TodoItemSchema } from "@repo/types";
import * as db from "../db/db.js";
import { todosRouter } from "./routes/todos.js";
import { assistantRouter } from "./routes/assistant.js";
export const appRouter = router({
  todos: todosRouter,
  assistant: assistantRouter,
});

export type AppRouter = typeof appRouter;

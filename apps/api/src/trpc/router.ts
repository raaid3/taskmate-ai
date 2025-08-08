import { router } from "./trpc.js";
import { todosRouter } from "./routes/todos.js";
import { assistantRouter } from "./routes/assistant.js";
export const appRouter = router({
  todos: todosRouter,
  assistant: assistantRouter,
});

export type AppRouter = typeof appRouter;

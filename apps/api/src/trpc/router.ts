import { publicProcedure, router } from "./trpc.js";

export const appRouter = router({
  greeting: publicProcedure.query(() => "hello from tRPC!"),
});

export type AppRouter = typeof appRouter;

import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { getToken } from "./token.js";
// import type { AppRouter } from "api/dist/trpc/router.d.ts";
import type { AppRouter } from "../../../api/src/trpc/router.js";
import superjson from "superjson";
export const queryClient = new QueryClient();
const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === "development" &&
          typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: import.meta.env.VITE_API_URL,
      transformer: superjson,
      headers: async () => {
        console.log("Setting headers for TRPC client...");
        const token = await getToken();
        if (!token) {
          return {};
        }
        return {
          Authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
});
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

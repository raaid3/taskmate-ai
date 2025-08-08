import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc/router.js";
import { createContext } from "./trpc/context.js";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 3000;
console.log("Allowed origins: ", process.env.ALLOWED_ORIGINS);
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") }));

app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(PORT, () => {
  console.log(`Server running on por t: ${PORT}`);
});

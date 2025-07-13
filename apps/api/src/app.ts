import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc/router.js";
const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your client app's URL
  })
);

app.get("/", (req, res) => {
  res.send("Hello !");
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

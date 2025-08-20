import type { AuthenticatedContext } from "../context.js";
import { type TodoItem } from "@repo/types";
import * as db from "../../db/db.js";

export async function getTodosResolver({
  ctx,
}: {
  ctx: AuthenticatedContext;
}): Promise<TodoItem[]> {
  console.log("Fetching todos for user:", ctx.user.id);

  // if (ctx.user.id.slice(0, 13) === "google-oauth2") {
  //   console.log("Google user signed in");
  //   const todos = await listGoogleCalendarEvents(ctx.user.id);
  //   return todos;
  // }

  const todos = await db.getTodos(ctx.user.id);
  return todos;
}

import { type TodoItem } from "@repo/types";
import { PrismaClient } from "../generated/prisma/index.js";
import type { NullAsUndefined } from "@repo/types";
const prisma = new PrismaClient();

function sanitizeTodoItem<T extends Record<string, any>>(
  item: T
): NullAsUndefined<T> {
  const result: Record<string, any> = { ...item };
  for (const key in result) {
    if (result[key] === null) {
      result[key] = undefined;
    } else if (
      key === "daysOfWeek" &&
      Array.isArray(result[key]) &&
      result[key].length === 0
    ) {
      result[key] = undefined;
    }
  }
  return result as NullAsUndefined<T>;
}

export async function addTodo(todo: Omit<TodoItem, "id">) {
  return await prisma.todoItem.create({
    data: todo,
  });
}

export async function getTodos(userId: string) {
  const todos = await prisma.todoItem.findMany({
    where: {
      authorId: userId,
    },
  });
  return todos.map(sanitizeTodoItem);
}

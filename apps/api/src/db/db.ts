import { type TodoItem } from "@repo/types";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

type NullAsUndefined<T> = {
  [P in keyof T]: T[P] extends null ? undefined : T[P];
};

function sanitizeTodoItem<T extends Record<string, any>>(
  item: T
): NullAsUndefined<T> {
  const result: Record<string, any> = { ...item };
  for (const key in result) {
    if (result[key] === null) {
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

export async function getTodos() {
  const todos = await prisma.todoItem.findMany();
  return todos.map(sanitizeTodoItem);
}

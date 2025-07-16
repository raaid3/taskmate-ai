import { type TodoItem } from "@repo/types";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function addTodo(todo: Omit<TodoItem, "id">) {
  await prisma.todoItem.create({
    data: todo,
  });
}

export async function getTodos() {
  return await prisma.todoItem.findMany();
}

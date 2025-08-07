import {
  type TodoItem,
  type DistributiveOmit,
  TodoItemSchema,
} from "@repo/types";
import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export async function addTodo(
  todo: DistributiveOmit<TodoItem, "id">
): Promise<TodoItem> {
  const res = await prisma.todoItem.create({
    data: todo,
  });
  return TodoItemSchema.parse(res);
}

export async function getTodos(userId: string): Promise<TodoItem[]> {
  const todos = await prisma.todoItem.findMany({
    where: {
      authorId: userId,
    },
  });
  return TodoItemSchema.array().parse(todos);
}

export async function deleteTodo(id: number, userId: string) {
  await prisma.todoItem.delete({
    where: {
      id: id,
      authorId: userId,
    },
  });
}

export async function updateTodo(todoItem: TodoItem): Promise<TodoItem> {
  const { id, authorId, ...newTodo } = todoItem;
  const res = await prisma.todoItem.update({
    where: {
      id,
      authorId,
    },
    data: newTodo,
  });
  return TodoItemSchema.parse(res);
}

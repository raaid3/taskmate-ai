import { type TodoItem } from "@repo/types";

const todos: TodoItem[] = [
  {
    dateTime: new Date().toISOString(),
    description: "Sample Todo Item",
    duration: 30,
    recurring: false,
  },
];

export function addTodo(todo: TodoItem) {
  todos.push(todo);
}

export function getTodos() {
  return todos;
}

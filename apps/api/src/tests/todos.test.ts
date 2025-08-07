import { todosRouter } from "../trpc/routes/todos";
import { type TodoItem, type DistributiveOmit, type User } from "@repo/types";
import { testUser1 } from "./test-data/users";
import { seed, cleanup } from "./seed";
const user = testUser1;
const caller = todosRouter.createCaller({ user: user });
describe("Todos Router", () => {
  beforeAll(async () => {
    await seed();
  });

  afterAll(async () => {
    await cleanup();
  });

  test("getTodos route", async () => {
    const todos = await caller.getTodos();
    expect(todos.length).toBe(2);
  });

  test("addTodo route", async () => {
    const newTodo: DistributiveOmit<TodoItem, "id"> = {
      title: "New TOdo",
      authorId: user.id,
      type: "simple",
      start: "2023-10-01T10:00:00Z",
    };

    await caller.addTodo(newTodo);
    const todos = await caller.getTodos();
    expect(todos.length).toBe(3);
  });

  test("deleteTodo route", async () => {
    const todos = await caller.getTodos();
    expect(todos.length).toBe(3);
    const todoToDelete = todos[0];
    await caller.deleteTodo({ id: todoToDelete!.id });
    const updatedTodos = await caller.getTodos();
    expect(updatedTodos.length).toBe(2);
  });

  test("updateTodo route", async () => {
    const todos = await caller.getTodos();
    expect(todos.length).toBe(2);
    const todoToUpdate = todos[0];
    const updatedTodo: TodoItem = {
      ...todoToUpdate!,
      title: "Updated Todo",
    };
    const result = await caller.updateTodo(updatedTodo);
    expect(result.title).toBe("Updated Todo");
    const updatedTodos = await caller.getTodos();
    const updatedTodoItem = updatedTodos.find(
      (todo) => todo.id === todoToUpdate!.id
    );
    expect(updatedTodoItem?.title).toBe("Updated Todo");
  });
});

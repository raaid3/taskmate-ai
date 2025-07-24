// import type { TodoItem } from "@repo/types";
import Calendar from "../components/Calendar";
import TodoForm from "../components/TodoForm";
import Button from "@repo/ui/button";
import { useState } from "react";
import { type TodoItem, type TodoItemCreate } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc, queryClient } from "../utils/trpc";
// const testEvents: TodoItem[] = [
//   {
//     id: 1,
//     authorId: 1,
//     title: "Sample Todo",
//     description: "This is a sample todo item",
//     type: "simple",
//     start: new Date().toISOString(),
//     end: new Date(new Date().getTime() + 3600000).toISOString(),
//   },
//   {
//     id: 2,
//     authorId: 1,
//     title: "Recurring Todo",
//     description: "This is a recurring todo item",
//     type: "recurring",
//     daysOfWeek: ["1", "3", "5"],
//     startTime: "09:00",
//     endTime: "10:00",
//   },
// ];

export default function TodosPage() {
  const [showForm, setShowForm] = useState(false);
  // const [events, setEvents] = useState<TodoItem[] | null>(null);
  // test states (temporary)
  // const [loading, setLoading] = useState(true);
  const queryUtils = useQuery(trpc.todos.getTodos.queryOptions());

  const { data }: { data: TodoItem[] | undefined } = queryUtils;
  const { isLoading, error } = queryUtils;

  // mutation for adding a new todo
  const addTodoMutation = useMutation(
    trpc.todos.addTodo.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.todos.getTodos.queryKey(), // invalidate the todos query
        });
      },
    })
  );

  async function addTodo(item: TodoItemCreate) {
    // if (!events) return;

    await addTodoMutation.mutateAsync(item);

    // setEvents([...events, newEvent]);
  }

  // // fetch events here
  // // ...
  // // const { data, isLoading, error } = trpc.todo.getAll.useQuery();
  // useEffect(() => {
  //   // Simulate fetching events
  //   setTimeout(() => {
  //     setEvents(testEvents);
  //     setLoading(false);
  //   }, 1000);
  // }, []);

  if (error) {
    return <p>Error loading todos: {error.message}</p>;
  }

  return (
    <div>
      <h1>Todos Page</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Calendar events={data!} />
          <Button onClick={() => setShowForm(true)}>Add Todo</Button>
        </>
      )}

      {showForm && (
        <TodoForm
          onSubmitted={() => setShowForm(false)}
          addTodo={addTodo}
          type="create"
        />
      )}
    </div>
  );
}

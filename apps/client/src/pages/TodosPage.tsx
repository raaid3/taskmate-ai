// import type { TodoItem } from "@repo/types";
import Calendar from "../components/Calendar";
import TodoForm from "../components/TodoForm";
import Button from "@repo/ui/button";
import LogoutButton from "../components/LogoutButton";
import { useState } from "react";
import { type TodoItem, type TodoItemCreate } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc, queryClient } from "../utils/trpc";
import { useAuth0 } from "@auth0/auth0-react";
export default function TodosPage() {
  const [showForm, setShowForm] = useState(false);
  const queryUtils = useQuery(trpc.todos.getTodos.queryOptions());
  const { isAuthenticated } = useAuth0();
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
    await addTodoMutation.mutateAsync(item);
  }

  if (error) {
    return <p>Error loading todos: {error.message}</p>;
  }

  return (
    <div>
      {isAuthenticated && <LogoutButton />}
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

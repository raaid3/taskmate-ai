import Calendar from "../components/Calendar";
import TodoForm from "../components/TodoForm";
import Button from "@repo/ui/components/button";
import { useState } from "react";
import { type TodoItemCreate } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc, queryClient } from "../utils/trpc";
import AIAssistant from "../components/AIAssistant";
import { Plus } from "lucide-react";

export default function TodosPage() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, error } = useQuery(
    trpc.todos.getTodos.queryOptions()
  );

  const addTodoMutation = useMutation(
    trpc.todos.addTodo.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.todos.getTodos.queryKey(),
        });
      },
    })
  );

  function onEscapeKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      setShowForm(false);
    }
  }

  async function addTodo(item: TodoItemCreate) {
    await addTodoMutation.mutateAsync(item);
  }

  if (error) {
    return <p>Error loading todos: {error.message}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          {isLoading ? <p>Loading...</p> : <Calendar events={data || []} />}
        </div>

        <div className="flex flex-col gap-8">
          <AIAssistant />
          <Button onClick={() => setShowForm(true)}>
            <div className="flex items-center justify-center gap-2">
              <Plus />
              <span>Add Event</span>
            </div>
          </Button>
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          tabIndex={0}
          onKeyDown={onEscapeKeyDown}
        >
          <TodoForm
            onSubmitted={() => setShowForm(false)}
            addTodo={addTodo}
            type="create"
          />
        </div>
      )}
    </div>
  );
}

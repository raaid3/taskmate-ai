import Calendar from "../components/Calendar";
import TodoForm from "../components/TodoForm";
import Button from "@repo/ui/components/button";
import { useState } from "react";
import {
  type TodoItemCreate,
  FcSimpleEventSchema,
  FcRecurringEventSchema,
  type TodoItem,
  type FullCalendarEvent,
} from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc, queryClient } from "../utils/trpc";
import AIAssistant from "../components/AIAssistant";
import { AlertCircle, Plus } from "lucide-react";

function processData(data: TodoItem[]): FullCalendarEvent[] {
  try {
    return data.map((item) => {
      if (item.type === "simple") {
        return FcSimpleEventSchema.parse(item);
      } else {
        return FcRecurringEventSchema.parse(item);
      }
    });
  } catch (err) {
    console.error("Error processing data into calendar compatible data: ", err);
    console.log(`Data being processed: ${JSON.stringify(data, null, 2)}`);
    return [];
  }
}

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
    return (
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg mx-4 my-4 shadow-lg flex items-center gap-4">
        <AlertCircle className="w-10 h-10" />
        <div>
          <h1 className="font-bold text-xl mb-1">
            Uh-oh! Something went awry!
          </h1>
          <p>
            There was an error loading your calendar. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Calendar events={data ? processData(data) : []} />
          )}
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-scroll"
          tabIndex={0}
          onKeyDown={onEscapeKeyDown}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div className="max-h-[80vh] overflow-scroll rounded-2xl">
            <TodoForm
              onSubmitted={() => setShowForm(false)}
              addTodo={addTodo}
              type="create"
            />
          </div>
        </div>
      )}
    </div>
  );
}

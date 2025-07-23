import type { TodoItem } from "@repo/types";
import Calendar from "../components/Calendar";
import TodoForm from "../components/TodoForm";
import Button from "@repo/ui/button";
import { useEffect, useState } from "react";
import { type TodoItemCreate } from "@repo/types";

const testEvents: TodoItem[] = [
  {
    id: 1,
    authorId: 1,
    title: "Sample Todo",
    description: "This is a sample todo item",
    type: "simple",
    start: new Date().toISOString(),
    end: new Date(new Date().getTime() + 3600000).toISOString(),
  },
  {
    id: 2,
    authorId: 1,
    title: "Recurring Todo",
    description: "This is a recurring todo item",
    type: "recurring",
    daysOfWeek: ["1", "3", "5"],
    startTime: "09:00",
    endTime: "10:00",
  },
];

export default function TodosPage() {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<TodoItem[] | null>(null);
  // test states (temporary)
  const [loading, setLoading] = useState(true);

  async function addTodo(item: TodoItemCreate) {
    if (!events) return;

    // Logic to add to the backend and get todo details
    // ...
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const newEvent: TodoItem = {
      id: events.length + 1,
      authorId: 1,
      ...item,
    };

    setEvents([...events, newEvent]);
  }

  // fetch events here
  // ...
  // const { data, isLoading, error } = trpc.todo.getAll.useQuery();
  useEffect(() => {
    // Simulate fetching events
    setTimeout(() => {
      setEvents(testEvents);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      <h1>Todos Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Calendar events={events!} />
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

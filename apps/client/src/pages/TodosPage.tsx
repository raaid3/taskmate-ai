import TodosView from "../components/TodosView";
import TodoForm from "../components/TodoForm";
import Button from "@repo/ui/button";
import { useState } from "react";
export default function TodosPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <h1>Todos Page</h1>
      <TodosView />
      <Button onClick={() => setShowForm(true)}>Add Todo</Button>

      {showForm && <TodoForm onSubmitted={() => setShowForm(false)} />}
    </div>
  );
}

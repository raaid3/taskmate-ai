import { useQuery } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";

export default function TodosView() {
  const { data, isLoading, error } = useQuery(
    trpc.todos.getTodos.queryOptions()
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {data?.map((todo, i) => (
          <li key={i}>
            <h2 className="font-bold">{todo.title}</h2>
            <p>Description: {todo.description} minutes</p>
            <p>Date: {todo.startDateTime.toISOString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

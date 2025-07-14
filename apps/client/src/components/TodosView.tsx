import { useQuery } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";

export default function TodosView() {
  const { data, isLoading, error } = useQuery(trpc.getTodos.queryOptions());

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {data?.map((todo, i) => (
          <li key={i}>
            <p>{todo.description}</p>
            <p>Duration: {todo.duration} minutes</p>
            <p>Date: {todo.dateTime}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

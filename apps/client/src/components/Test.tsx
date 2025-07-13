import { useQuery } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";

export default function Test() {
  const { data, isLoading, error } = useQuery(trpc.greeting.queryOptions());

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data}</div>;
}

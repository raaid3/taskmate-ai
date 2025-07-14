import { TodoItemSchema, type TodoItem } from "@repo/types";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { trpc, queryClient } from "../utils/trpc";
interface TodoFormProps {
  onSubmitted?: () => void;
}

export default function TodoForm({ onSubmitted }: TodoFormProps) {
  const addTodoMutation = useMutation(
    trpc.addTodo.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.getTodos.queryKey() });
      },
    })
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TodoItem>({
    resolver: zodResolver(TodoItemSchema),
    defaultValues: {
      recurring: false,
    },
  });

  const onSubmit: SubmitHandler<TodoItem> = async (data) => {
    try {
      console.debug("Form submitting with data:", data);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await addTodoMutation.mutateAsync(data);
      reset();
      if (onSubmitted) {
        onSubmitted();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <fieldset className="space-y-4" disabled={isSubmitting}>
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
            Create Todo Item
          </h2>
          <div>
            <label
              htmlFor="dateTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              {...register("dateTime")}
              required={true}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              {...register("description")}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Duration (min)
            </label>
            <input
              type="number"
              id="duration"
              {...register("duration", { valueAsNumber: true })}
              min="0"
              required={true}
              onKeyDown={(e) => {
                const allowedKeys = [
                  "0",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "Backspace",
                  "Delete",
                  "Tab",
                  "ArrowLeft",
                  "ArrowRight",
                  "ArrowUp",
                  "ArrowDown",
                ];
                if (!allowedKeys.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recurring"
              {...register("recurring")}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="recurring"
              className="text-sm font-medium text-gray-700"
            >
              Recurring task
            </label>
          </div>
          <div className="text-red-500 text-sm mt-2">
            {Object.values(errors).map((error, i) => (
              <p key={i} className="text-red-500">
                Error: {error.message}
              </p>
            ))}
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Create Todo
          </button>
        </fieldset>
      </form>
    </div>
  );
}

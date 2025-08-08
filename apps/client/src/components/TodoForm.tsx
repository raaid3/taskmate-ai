import { type TodoItemCreate, TodoItemCreateSchema } from "@repo/types";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EventTimeFields from "./EventTimeFields";
import Button from "./Button.tsx";

interface TodoFormProps {
  onSubmitted?: () => void;
  type: "create" | "edit";
  initialValues?: TodoItemCreate;
  addTodo?: (item: TodoItemCreate) => Promise<void>;
}

export default function TodoForm({ onSubmitted, addTodo }: TodoFormProps) {
  const methods = useForm<TodoItemCreate>({
    resolver: zodResolver(TodoItemCreateSchema),
    defaultValues: {
      type: "simple",
      end: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  const onSubmit: SubmitHandler<TodoItemCreate> = async (data) => {
    try {
      await addTodo?.(data);
      reset();
      onSubmitted?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      reset();
      onSubmitted?.();
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-700 backdrop-blur-md p-8 rounded-2xl shadow-lg text-white">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={isSubmitting}>
            <h2 className="text-3xl font-bold text-center mb-6">
              Create Event
            </h2>

            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                {...register("title")}
                placeholder="What's the plan?"
                required={true}
                className="w-full bg-white/10 placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                {...register("description")}
                placeholder="Tell me more..."
                className="w-full bg-white/10 placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Event Type
              </label>
              <div className="flex bg-white/10 rounded-lg p-1">
                <label className="flex-1 text-center py-2 rounded-lg cursor-pointer has-[:checked]:bg-purple-600 transition-colors">
                  <input
                    type="radio"
                    value="simple"
                    {...register("type")}
                    className="sr-only"
                  />
                  <span>Simple</span>
                </label>
                <label className="flex-1 text-center py-2 rounded-lg cursor-pointer has-[:checked]:bg-purple-600 transition-colors">
                  <input
                    type="radio"
                    value="recurring"
                    {...register("type")}
                    className="sr-only"
                  />
                  <span>Recurring</span>
                </label>
              </div>
            </div>

            <EventTimeFields />

            {Object.entries(errors).length > 0 && (
              <div className="text-red-400 text-sm mt-2">
                {Object.entries(errors).map(([field, error]) => (
                  <p key={field} className="text-red-400">
                    {error?.message || "Invalid value"}
                  </p>
                ))}
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </fieldset>
        </form>
      </FormProvider>
    </div>
  );
}

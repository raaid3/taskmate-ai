import { type TodoItemCreate, TodoItemCreateSchema } from "@repo/types";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EventTimeFields from "./EventTimeFields";

interface TodoFormProps {
  onSubmitted?: () => void;
  type: "create" | "edit";
  initialValues?: TodoItemCreate;
  addTodo?: (item: TodoItemCreate) => Promise<void>;
}

export default function TodoForm({ onSubmitted, addTodo }: TodoFormProps) {
  // Mutation for editing an existing todo
  // ...

  // Init form with default values and validation schema
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

  // handle form submission
  const onSubmit: SubmitHandler<TodoItemCreate> = async (data) => {
    try {
      console.debug("Form submitting with data:", data);
      await addTodo?.(data);
      reset();
      if (onSubmitted) {
        onSubmitted();
      }
    } catch (error) {
      reset();
      if (onSubmitted) {
        onSubmitted();
      }
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <fieldset className="space-y-4" disabled={isSubmitting}>
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
              Create Todo Item
            </h2>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                {...register("title")}
                placeholder="Title of your todo"
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
              <textarea
                id="description"
                {...register("description")}
                placeholder="What needs to be done?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="simple"
                    {...register("type")}
                    className="mr-2"
                  />
                  <span>Simple</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="recurring"
                    {...register("type")}
                    className="mr-2"
                  />
                  <span>Recurring</span>
                </label>
              </div>
            </div>
            <EventTimeFields />

            <div className="text-red-500 text-sm mt-2">
              {Object.entries(errors).map(([field, error]) => (
                <p key={field} className="text-red-500">
                  {field}: {error?.message || "Invalid value"}
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
      </FormProvider>
    </div>
  );
}

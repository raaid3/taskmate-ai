import { type TodoItemCreate } from "@repo/types";
import { type TodoForm, TodoFormSchema } from "@repo/types";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EventTimeFields from "./EventTimeFields";
import Button from "@repo/ui/components/button";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { RRule } from "rrule";

interface TodoFormProps {
  onSubmitted?: () => void;
  type: "create" | "edit";
  initialValues?: TodoForm;
  addTodo?: (item: TodoItemCreate) => Promise<void>;
}

export default function TodoForm({ onSubmitted, addTodo }: TodoFormProps) {
  const methods = useForm<TodoForm>({
    resolver: zodResolver(TodoFormSchema),
    defaultValues: {
      type: "simple",
      title: "",
      startDate: "",
      startTime: "",
      endTime: "",
      description: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = methods;

  const [duration, setDuration] = useState<string | null>(null);
  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const type = watch("type");

  useEffect(() => {
    if (startTime && endTime) {
      const start = DateTime.fromISO(startTime);
      let end = DateTime.fromISO(endTime);

      if (end < start) {
        end = end.plus({ days: 1 });
      }

      const diff = end.diff(start);
      setDuration(diff.toFormat("h 'hour(s)' m 'minute(s)'"));
    } else {
      setDuration(null);
    }
  }, [startTime, endTime]);

  const onSubmit: SubmitHandler<TodoForm> = async (data) => {
    try {
      console.log(`Form Submitted with data: ${JSON.stringify(data)}`);

      // process data using user's local time zone
      const localStartDateTime = data.startDate + "T" + data.startTime;
      const startDateTime = DateTime.fromISO(localStartDateTime)
        .startOf("minute")
        .toUTC();
      const localEndDateTime = data.startDate + "T" + data.endTime;
      let endDateTime = DateTime.fromISO(localEndDateTime)
        .startOf("minute")
        .toUTC();
      if (endDateTime < startDateTime) {
        endDateTime = endDateTime.plus({ days: 1 });
      }

      if (data.type === "simple") {
        await addTodo?.({
          type: "simple",
          title: data.title,
          description: data.description,
          startDateTime: startDateTime.toFormat("yyyy-MM-dd'T'HH:mm'Z'"),
          endDateTime: endDateTime.toFormat("yyyy-MM-dd'T'HH:mm'Z'"),
        });
      } else {
        await addTodo?.({
          type: "recurring",
          title: data.title,
          description: data.description,
          startDateTime: startDateTime.toFormat("yyyy-MM-dd'T'HH:mm'Z'"),
          endDateTime: endDateTime.toFormat("yyyy-MM-dd'T'HH:mm'Z'"),
          rrule: new RRule({
            freq: RRule.WEEKLY,
            byweekday: data.daysOfWeek.map((day) => parseInt(day)),
            until: data.endDate
              ? DateTime.fromISO(data.endDate).endOf("day").toUTC().toJSDate()
              : undefined,
          }).toString(),
        });
      }

      reset();
      onSubmitted?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      reset();
      onSubmitted?.();
    }
  };

  return (
    <div className="w-full max-w-4xl bg-gray-700 backdrop-blur-md p-8 rounded-2xl shadow-lg text-white">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={isSubmitting}>
            <h2 className="text-3xl font-bold text-center mb-6">
              Create Event
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2"
                >
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
            </div>

            <div className="grid gap-6 md:grid-cols-2">
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

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium mb-2"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    {...register("startDate")}
                    className="w-full bg-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-invalid={!!errors.startDate}
                  />
                </div>

                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium mb-2"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    {...register("startTime")}
                    className="w-full bg-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-invalid={!!errors.startTime}
                  />
                </div>

                <div>
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-medium mb-2"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    {...register("endTime")}
                    className="w-full bg-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-invalid={!!errors.endTime}
                  />
                </div>
              </div>
              <EventTimeFields />
            </div>

            {duration && (
              <div className="text-center text-gray-400">
                Duration: {duration}
              </div>
            )}

            {Object.entries(errors).length > 0 && (
              <div className="text-red-400 text-sm mt-2">
                {Object.entries(errors).map(([field, error]) => {
                  if (field === "daysOfWeek" || field === "endDate") {
                    if (type === "simple") {
                      return null;
                    }
                  }

                  return (
                    <p key={field} className="text-red-400">
                      {error?.message || "Invalid value"}
                    </p>
                  );
                })}
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

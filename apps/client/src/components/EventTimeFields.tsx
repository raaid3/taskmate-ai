import { useFormContext } from "react-hook-form";
import { type TodoForm } from "@repo/types";

export default function EventTimeFields() {
  const { register, watch } = useFormContext<TodoForm>();
  const eventType = watch("type");

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const inputClasses =
    "w-full bg-white/10 placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500";

  return (
    <div className="space-y-4">
      {eventType === "recurring" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Recurring Days
            </label>
            <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
              {dayNames.map((day, index) => (
                <label
                  key={index}
                  className="text-center p-2 rounded-lg cursor-pointer has-[:checked]:bg-purple-600 transition-colors bg-white/10"
                >
                  <input
                    type="checkbox"
                    value={index}
                    {...register("daysOfWeek")}
                    className="sr-only"
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium mb-2"
              >
                Until
              </label>
              <input
                id="endDate"
                type="date"
                {...register("endDate")}
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useFormContext } from "react-hook-form";
import { type TodoItemCreate } from "@repo/types";

export default function EventTimeFields() {
  const { register, watch } = useFormContext<TodoItemCreate>();
  const eventType = watch("type");

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const inputClasses = "w-full bg-white/10 placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500";

  return (
    <div className="space-y-4">
      {eventType === "simple" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start" className="block text-sm font-medium mb-2">Start Date & Time</label>
            <input id="start" type="datetime-local" {...register("start")} className={inputClasses} />
          </div>
          <div>
            <label htmlFor="end" className="block text-sm font-medium mb-2">End Date & Time</label>
            <input id="end" type="datetime-local" {...register("end")} className={inputClasses} />
          </div>
        </div>
      )}

      {eventType === "recurring" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Recurring Days</label>
            <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
              {dayNames.map((day, index) => (
                <label key={index} className="text-center p-2 rounded-lg cursor-pointer has-[:checked]:bg-purple-600 transition-colors bg-white/10">
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
              <label htmlFor="startTime" className="block text-sm font-medium mb-2">Start Time</label>
              <input id="startTime" type="time" {...register("startTime")} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium mb-2">End Time</label>
              <input id="endTime" type="time" {...register("endTime")} className={inputClasses} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

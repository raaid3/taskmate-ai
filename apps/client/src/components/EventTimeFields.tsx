import { useFormContext } from "react-hook-form";
import { type TodoItemCreate } from "@repo/types";

export default function EventTimeFields() {
  const { register, watch } = useFormContext<TodoItemCreate>();
  const eventType = watch("type");

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <>
      {eventType === "simple" && (
        <>
          <div>
            <label htmlFor="start">Start Date & Time</label>
            <input id="start" type="datetime-local" {...register("start")} />
          </div>
          <div>
            <label htmlFor="end">End Date & Time</label>
            <input id="end" type="datetime-local" {...register("end")} />
          </div>
        </>
      )}

      {eventType === "recurring" && (
        <>
          <div>
            <label>Recurring Days</label>
            <div>
              {dayNames.map((day, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    value={index}
                    {...register("daysOfWeek")}
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="startTime">Start Time</label>
            <input id="startTime" type="time" {...register("startTime")} />
          </div>
          <div>
            <label htmlFor="endTime">End Time</label>
            <input id="endTime" type="time" {...register("endTime")} />
          </div>
        </>
      )}
    </>
  );
}

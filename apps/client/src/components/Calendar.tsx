import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { type TodoItem } from "@repo/types";

interface CalendarProps {
  events: TodoItem[];
}

export default function Calendar({ events }: CalendarProps) {
  return (
    <FullCalendar
      headerToolbar={{ center: "dayGridMonth,timeGridWeek" }}
      plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      events={events!.map((e) => ({ ...e, id: e.id.toString() }))} // make id a string for FullCalendar
    />
  );
}

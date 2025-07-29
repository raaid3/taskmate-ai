import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { type TodoItem } from "@repo/types";
import "./Calendar.css";

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
      nowIndicator={true}
      // slotDuration="00:15:00"
      // nextDayThreshold="09:00:00"
    />
  );
}

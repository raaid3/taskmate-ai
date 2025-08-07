import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { type TodoItem } from "@repo/types";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "./Calendar.css";
interface CalendarProps {
  events: TodoItem[];
}

export default function Calendar({ events }: CalendarProps) {
  return (
    <>
      <FullCalendar
        headerToolbar={{ center: "dayGridMonth,timeGridWeek" }}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events!.map((e) => ({ ...e, id: e.id.toString() }))} // make id a string for FullCalendar
        nowIndicator={true}
        eventDidMount={(info) => {
          info.el.setAttribute("data-tooltip-id", "fc-event-tooltip");
          info.el.setAttribute("data-tooltip-content", info.event.title);
        }}
      />
      <Tooltip
        id="fc-event-tooltip"
        place="top"
        style={{ zIndex: 1000 }}
        // openOnClick
        opacity={1}
      />
    </>
  );
}

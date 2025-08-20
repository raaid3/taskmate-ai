import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import { type FullCalendarEvent } from "@repo/types";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "./Calendar.css";
interface CalendarProps {
  events: FullCalendarEvent[];
}

export default function Calendar({ events }: CalendarProps) {
  return (
    <>
      <FullCalendar
        headerToolbar={{ center: "dayGridMonth,timeGridWeek" }}
        plugins={[
          rrulePlugin,
          timeGridPlugin,
          dayGridPlugin,
          interactionPlugin,
        ]}
        initialView="timeGridWeek"
        events={events}
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

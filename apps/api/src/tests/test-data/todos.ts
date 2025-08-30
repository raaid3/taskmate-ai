import { type TodoItemCreate } from "@repo/types";
export const todoItem1 = {
  title: "test todo",
  authorId: "user1-id",
  type: "simple",
  startDateTime: "2023-10-01T10:00:00Z",
  endDateTime: "2023-10-01T11:00:00Z",
};

export const todoItem2 = {
  title: "test todo 2",
  authorId: "user1-id",
  type: "recurring",
  rrule: "FREQ=WEEKLY;BYDAY=MO,WE",
  startDateTime: "2023-10-01T10:00:00Z",
  endDateTime: "2023-10-01T11:00:00Z",
};

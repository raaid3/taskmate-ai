import { router, protectedProcedure } from "../trpc.js";
import * as db from "../../db/db.js";
import { rescheduleEvents } from "../../openai/client.js";
import { z } from "zod";
import { updateTodo, addTodo, deleteTodo } from "../../db/db.js";
export const assistantRouter = router({
  rescheduleTodos: protectedProcedure
    .input(
      z.object({
        userPrompt: z.string(),
        currentDateTime: z.iso.datetime({ local: true }),
        userTimeZone: z.string(),
      })
    )
    .mutation(async ({ input, ctx }): Promise<string> => {
      // debug
      try {
        console.log("Rescheduling todos for user:", ctx.user.id);

        const { userPrompt, userTimeZone, currentDateTime } = input;
        const userEvents = await db.getTodos(ctx.user.id);
        // console.log("User events:", userEvents);
        const response = await rescheduleEvents(
          userPrompt,
          userEvents,
          ctx.user.id,
          currentDateTime,
          userTimeZone
        );
        // console.log("AI response:", response);
        const updatedTodos = response.rescheduled_events;

        // Update each todo in the database
        for (const todo of updatedTodos) {
          await updateTodo(todo);
        }

        // Add new events to the database
        for (const newTodo of response.new_events) {
          const { id: _id, ...todoWithoutId } = newTodo;
          await addTodo(todoWithoutId);
        }

        // Delete specified events
        for (const deleteId of response.delete_events) {
          await deleteTodo(deleteId, ctx.user.id);
        }

        // return response;
        return response.reason;
      } catch (error) {
        console.error("Error in rescheduleTodos:", error);
        return "An error occurred while rescheduling, please try again later.";
      }
    }),
});

import { AzureOpenAI } from "openai";
import { config } from "dotenv";
import {
  type OldTodoItem,
  AssistantResponseFormat,
  type AssistantResponse,
} from "@repo/types";
import { z } from "zod";
import { minimalPrompt } from "./prompts.js";
config();
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2025-01-01-preview";
const modelName = "o3-mini";
const deployment = "o3-mini";
if (!endpoint || !apiKey) {
  throw new Error(
    "Azure OpenAI endpoint and API key must be set in environment variables."
  );
}
const options = { endpoint, apiKey, deployment, apiVersion };
const client = new AzureOpenAI(options);

export async function rescheduleEvents(
  userPrompt: string,
  userEvents: OldTodoItem[],
  userId: string,
  currentDateTime: string
): Promise<AssistantResponse> {
  try {
    const completion = await client.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: "system",
          content: minimalPrompt,
        },
        {
          role: "user",
          content: JSON.stringify({
            userPrompt,
            userEvents,
            userId,
            currentDateTime,
          }),
        },
      ],
    });

    if (completion.choices.length === 0) {
      throw new Error("No response from AI");
    }

    if (!completion.choices[0]) {
      throw new Error("No message content in AI response");
    }

    if (!completion.choices[0].message.content) {
      throw new Error("No message content in AI response");
    }

    return AssistantResponseFormat.parse(
      JSON.parse(completion.choices[0].message.content)
    );
  } catch (error) {
    if (error instanceof z.core.$ZodError) {
      console.error("Error parsing response:", error.issues);
    } else {
      console.error("Error during chat completion:", error);
    }
    return {
      rescheduled_events: [],
      new_events: [],
      delete_events: [],
      reason: "Unable to reschedule events due to an error in processing.",
    };
  }
}

// async function main() {
//   const res = await rescheduleEvents(
//     "Please postpone all events by one hour.",
//     [
//       {
//         id: 1,
//         authorId: "user123",
//         title: "Team Meeting",
//         start: "2023-10-01T10:00:00",
//         type: "simple",
//         description: "Discuss project updates",
//       },
//       {
//         id: 2,
//         authorId: "user123",
//         title: "Weekly Sync",
//         daysOfWeek: ["1", "3"],
//         startTime: "09:00",
//         type: "recurring",
//         description: "Weekly team sync",
//       },
//     ]
//   );

//   console.log("Rescheduled Events:", res.rescheduled_events);
//   console.log("Reason:", res.reason);
// }

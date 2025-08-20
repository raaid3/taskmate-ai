import { google } from "googleapis";
import { GaxiosError } from "gaxios";
import { getGoogleTokensForUser } from "./idp-token.js";
import "dotenv/config";
export async function listGoogleCalendarEvents(userId: string) {
  try {
    const tokens = await getGoogleTokensForUser(userId);

    if (!tokens) {
      return undefined;
    }

    // Step 1: Create an OAuth2 client with client id and client secret
    const oauth2Client = new google.auth.OAuth2({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
    });
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });

    // Step 2: Initialize the Calendar API client
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Step 3: Call events.list
    const res = await calendar.events.list({
      calendarId: "primary", // "primary" is the main calendar
      timeMin: new Date().toISOString(), // Only future events
      maxResults: 10, // Limit results
      // orderBy: "startTime", // Sort by start time
    });

    // Step 4: Process results
    const events = res.data.items || [];
    if (!events.length) {
      console.log("No upcoming events found.");
      return [];
    }
    console.log(events);
    return events;
  } catch (err) {
    if (err instanceof GaxiosError) {
      if (err.code && err.code === 403) {
        console.error("Insufficient Scopes");
        throw err;
      }
    }
    throw err;
  }
}

console.log(
  await listGoogleCalendarEvents("google-oauth2|105212125827627654354")
);

import "dotenv/config";
import { z } from "zod";
import axios from "axios";
// check if env vars exist
if (
  !process.env.MGMT_CLIENT_ID ||
  !process.env.MGMT_CLIENT_SECRET ||
  !process.env.MGMT_AUDIENCE
) {
  throw new Error("Missing Auth0 management API credentials");
}

const tokenSchema = z.object(
  {
    access_token: z.string(),
    token_type: z.string(),
    expires_in: z.number(),
    scope: z.string(),
  },
  "Token response did not match expected shape"
);

type Token = z.infer<typeof tokenSchema>;

let tokenCache: (Token & { expires_at: number }) | null = null;

const refreshThreshold = 3600 * 1000;

export async function getToken() {
  if (tokenCache && tokenCache.expires_at - Date.now() > refreshThreshold) {
    return tokenCache;
  }

  try {
    const response = await axios.post(
      "https://dev-b8dqb1x583bd07a1.us.auth0.com/oauth/token",
      {
        client_id: process.env.MGMT_CLIENT_ID,
        client_secret: process.env.MGMT_CLIENT_SECRET,
        audience: process.env.MGMT_AUDIENCE,
        grant_type: "client_credentials",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: Token = tokenSchema.parse(response.data);
    tokenCache = { ...data, expires_at: Date.now() + data.expires_in * 1000 };
    return tokenCache;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

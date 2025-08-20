import { getToken } from "./credentials-exchange.js";
import axios from "axios";
import { z } from "zod";

const googleTokensSchema = z.object(
  {
    access_token: z.string(),
    refresh_token: z.string(),
  },
  "Missing access or refresh token for Google OAuth"
);

const identitySchema = z.object(
  {
    provider: z.string(),
    access_token: z.string().optional(),
    refresh_token: z.string().optional(),
  },
  "Not a valid identity"
);

// Will return an access token and a refresh token to make authorized calls to google api
// Uses auth0 management api to obtain identities of the user
export async function getGoogleTokensForUser(userId: string) {
  try {
    const accessCredentials = await getToken(); // obtain auth0 management api access token

    if (!accessCredentials) {
      throw new Error("Failed to obtain access credentials");
    }

    const { access_token } = accessCredentials;

    const response = await axios.get(
      `https://dev-b8dqb1x583bd07a1.us.auth0.com/api/v2/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          fields: "identities",
          include_fields: true,
        },
      }
    );

    const identities = z.array(identitySchema).parse(response.data.identities);

    const googleIdentity = identities.find(
      (id) => id.provider === "google-oauth2"
    );

    if (!googleIdentity) {
      throw new Error("User is not registered through google");
    }
    const tokens = googleTokensSchema.parse(googleIdentity);
    return tokens;
  } catch (err) {
    console.error("Error fetching user data:", err);
    return undefined;
  }
}

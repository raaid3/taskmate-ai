import * as trpcExpress from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import "dotenv/config";
import { UserSchema } from "@repo/types";
import { z } from "zod";
// created for each request
export const createContext = async ({
  req,
}: trpcExpress.CreateExpressContextOptions) => {
  const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  });

  function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    client.getSigningKey(header.kid, function (err, key) {
      if (err) {
        callback(err, undefined);
        return;
      }

      if (!key) {
        callback(new Error("No signing key found"), undefined);
        return;
      }

      if ("publicKey" in key) {
        callback(null, key.publicKey);
      } else if ("rsaPublicKey" in key) {
        callback(null, key.rsaPublicKey);
      } else {
        callback(new Error("Invalid signing key type"), undefined);
      }
    });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  if (!token) {
    return { user: null };
  }

  const user = await new Promise<z.infer<typeof UserSchema> | null>(
    (resolve) => {
      jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) return resolve(null);
        resolve(UserSchema.parse(decoded));
      });
    }
  ).catch((err) => {
    console.log("Error parsing JWT payload:", err);
    return null;
  });

  if (!user) {
    return { user: null };
  } else {
    return { user: { id: user.sub, username: user.name } };
  }
};
export type Context = Awaited<ReturnType<typeof createContext>>;

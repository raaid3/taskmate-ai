import * as trpcExpress from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { User } from "@repo/types"; // Import the User type
import "dotenv/config";
// created for each request
export const createContext = async ({
  req,
  res,
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

  const user = await new Promise<User | null>((resolve) => {
    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) return resolve(null);
      resolve(decoded as User);
    });
  });

  return { user };
};
export type Context = Awaited<ReturnType<typeof createContext>>;

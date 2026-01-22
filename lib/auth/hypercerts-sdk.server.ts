import "server-only";
import { createATProtoSDK } from "@hypercerts-org/sdk-core";
import { SupabaseSessionStore, SupabaseStateStore } from "./storage";

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error("Missing NEXT_PUBLIC_APP_URL environment variable");
}

if (!process.env.NEXT_PUBLIC_PDS_URL) {
  throw new Error("Missing NEXT_PUBLIC_PDS_URL environment variable");
}

if (!process.env.NEXT_PUBLIC_SDS_URL) {
  throw new Error("Missing NEXT_PUBLIC_SDS_URL environment variable");
}

if (!process.env.ATPROTO_JWK_PRIVATE) {
  throw new Error("Missing ATPROTO_JWK_PRIVATE environment variable");
}

export const sessionStore = new SupabaseSessionStore();
export const stateStore = new SupabaseStateStore();

export const hypercertsSdk = createATProtoSDK({
  oauth: {
    clientId: `${process.env.NEXT_PUBLIC_APP_URL}/client-metadata.json`,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/hypercerts/auth/callback`,
    scope: "atproto transition:generic",
    jwksUri: `${process.env.NEXT_PUBLIC_APP_URL}/jwks.json`,
    jwkPrivate: process.env.ATPROTO_JWK_PRIVATE,
  },
  storage: {
    sessionStore,
    stateStore,
  },
  servers: {
    pds: process.env.NEXT_PUBLIC_PDS_URL,
    sds: process.env.NEXT_PUBLIC_SDS_URL,
  },
  logger: console,
});

// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { gainforestSdk } from "@/config/gainforest-sdk.server";
import { createContext } from "gainforest-sdk";
import { atprotoSDK } from "@/lib/atproto";

export const runtime = "nodejs";

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: gainforestSdk.appRouter,
    createContext: ({ req }) =>
      createContext({
        sdk: atprotoSDK,
        req,
        allowedPDSDomains,
      }),
  });

export { handler as GET, handler as POST };

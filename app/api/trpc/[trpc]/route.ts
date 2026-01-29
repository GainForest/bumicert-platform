// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { climateAiSdk } from "@/config/climateai-sdk.server";
import { createContext } from "climateai-sdk";
import { atprotoSDK } from "@/lib/atproto";

export const runtime = "nodejs";

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: climateAiSdk.appRouter,
    createContext: ({ req }) =>
      createContext({
        sdk: atprotoSDK,
        req,
        allowedPDSDomains,
      }),
  });

export { handler as GET, handler as POST };

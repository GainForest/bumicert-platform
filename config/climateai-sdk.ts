import { SupportedPDSDomain } from "climateai-sdk";
import { createTRPCClient } from "climateai-sdk/client";

export const allowedPDSDomains = [
  "climateai.org",
  // add domains here to allow them
] satisfies SupportedPDSDomain[];
export type AllowedPDSDomain = (typeof allowedPDSDomains)[number];

export const trpcClient = createTRPCClient<AllowedPDSDomain>("/api/trpc");

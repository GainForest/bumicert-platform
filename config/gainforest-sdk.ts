import { SupportedPDSDomain } from "gainforest-sdk";
import { createTRPCClient } from "gainforest-sdk/client";

export const allowedPDSDomains = (process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? ["gainforest.id"] : [
  "climateai.org",
]) satisfies SupportedPDSDomain[];
export type AllowedPDSDomain = (typeof allowedPDSDomains)[number];

const resolvedVercelEnv =
  process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV;

export const defaultPdsDomain: AllowedPDSDomain =
  resolvedVercelEnv === "production" ? "gainforest.id" : "climateai.org";

export const trpcClient = createTRPCClient<AllowedPDSDomain>("/api/trpc");

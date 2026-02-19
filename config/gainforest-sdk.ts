import { SupportedPDSDomain } from "gainforest-sdk";
import { createTRPCClient } from "gainforest-sdk/client";

const resolvedVercelEnv =
  process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV;

export const allowedPDSDomains: SupportedPDSDomain[] =
  resolvedVercelEnv === "production" ? ["gainforest.id"] : ["climateai.org"];

export type AllowedPDSDomain = (typeof allowedPDSDomains)[number];

export const defaultPdsDomain: AllowedPDSDomain =
  resolvedVercelEnv === "production" ? "gainforest.id" : "climateai.org";

export const trpcClient = createTRPCClient<AllowedPDSDomain>("/api/trpc");

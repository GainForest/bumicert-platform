import { SupportedPDSDomain } from "gainforest-sdk";
import { createTRPCClient } from "gainforest-sdk/client";

export const allowedPDSDomains = (process.env.VERCEL_TARGET_ENV === "production" ? ["gainforest.id"] : [
  "gainforest.id",
]) satisfies SupportedPDSDomain[];
export type AllowedPDSDomain = (typeof allowedPDSDomains)[number];

export const trpcClient = createTRPCClient<AllowedPDSDomain>("/api/trpc");

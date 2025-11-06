import {
  getSessionFromRequest,
  saveSession,
  StoredSession,
} from "@/server/session";
import { publicProcedure } from "@/server/trpc";
import { CredentialSession } from "@atproto/api";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const resume = publicProcedure
  .input(
    z.object({
      service: z.enum(["climateai.org"]),
    })
  )
  .mutation(async ({ input }) => {
    const session = await getSessionFromRequest(input.service);
    if (!session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No session found",
      });
    }
    return {
      context: session,
      service: input.service,
    };
  });

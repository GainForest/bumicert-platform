import { saveSession, StoredSession } from "@/server/session";
import { publicProcedure } from "@/server/trpc";
import { CredentialSession } from "@atproto/api";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const login = publicProcedure
  .input(
    z.object({
      handlePrefix: z.string().regex(/^^[a-zA-Z0-9-]+$/), // alphanumerics and hyphens only
      service: z.enum(["climateai.org"]),
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const session = new CredentialSession(new URL(`https://${input.service}`));
    const result = await session.login({
      identifier: `${input.handlePrefix}.${input.service}`,
      password: input.password,
    });
    if (!result.success) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Login failed",
      });
    }
    const context: StoredSession = {
      accessJwt: result.data.accessJwt,
      refreshJwt: result.data.refreshJwt,
      did: result.data.did,
      handle: result.data.handle,
    };
    await saveSession(context, input.service);
    return {
      context,
      service: input.service,
    };
  });

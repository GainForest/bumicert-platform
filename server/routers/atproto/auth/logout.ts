import { clearSession } from "@/server/session";
import { publicProcedure } from "@/server/trpc";
import z from "zod";

export const logout = publicProcedure
  .input(
    z.object({
      service: z.enum(["climateai.org"]),
    })
  )
  .mutation(async ({ input }) => {
    await clearSession(input.service);
    return {
      success: true,
    };
  });

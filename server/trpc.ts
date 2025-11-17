import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { getSessionFromRequest } from "./session";
import { customTransformer } from "./utils/transformer";

export async function createContext(opts?: { req: Request }) {
  // Extract session from cookies/headers
  const session =
    opts?.req ? await getSessionFromRequest("climateai.org") : null;

  return {
    session,
  };
}

export type TrpcContext = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<TrpcContext>().create({
  transformer: customTransformer,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }
  return next({ ctx });
});

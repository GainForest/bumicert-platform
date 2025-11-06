import { initTRPC } from "@trpc/server";
import superjson from "superjson";

export type TrpcContext = {};

export function createContext(): TrpcContext {
  return {};
}

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

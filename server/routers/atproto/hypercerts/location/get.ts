import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { tryCatch } from "@/lib/tryCatch";
import { XRPCError } from "@atproto/xrpc";
import { GetRecordResponse } from "@/server/utils/response-types";
import { AppCertifiedLocation, OrgHypercertsClaimClaim } from "@/lexicon-api";
import { getReadAgent } from "@/server/utils/agent";
import { xrpcErrorToTRPCError } from "@/server/utils/classify-xrpc-error";
import { TRPCError } from "@trpc/server";
import { validateRecordOrThrow } from "../../utils";

export const getCertifiedLocationPure = async (did: string, rkey: string) => {
  const agent = getReadAgent();
  const getRecordPromise = agent.com.atproto.repo.getRecord({
    collection: "app.certified.location",
    repo: did,
    rkey: rkey,
  });
  const [response, error] = await tryCatch(getRecordPromise);

  if (error) {
    if (error instanceof XRPCError) {
      const trpcError = xrpcErrorToTRPCError(error);
      throw trpcError;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unknown error occurred.",
      });
    }
  }

  if (response.success !== true) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get organization info.",
    });
  }

  validateRecordOrThrow(response.data.value, AppCertifiedLocation);

  return response.data as GetRecordResponse<AppCertifiedLocation.Record>;
};

export const getCertifiedLocation = publicProcedure
  .input(z.object({ did: z.string(), rkey: z.string() }))
  .query(async ({ input }) => {
    return await getCertifiedLocationPure(input.did, input.rkey);
  });

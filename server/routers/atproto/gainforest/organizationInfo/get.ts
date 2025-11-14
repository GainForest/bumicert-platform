import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { tryCatch } from "@/lib/tryCatch";
import { XRPCError } from "@atproto/xrpc";
import { GetRecordResponse } from "@/server/utils/response-types";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";
import { getReadAgent } from "@/server/utils/agent";
import { xrpcErrorToTRPCError } from "@/server/utils/classify-xrpc-error";
import { TRPCError } from "@trpc/server";
import { validateRecordOrThrow } from "../../utils";

export const getOrganizationInfo = publicProcedure
  .input(z.object({ did: z.string() }))
  .query(async ({ input }) => {
    const agent = getReadAgent();
    const getRecordPromise = agent.com.atproto.repo.getRecord({
      collection: "app.gainforest.organization.info",
      repo: input.did,
      rkey: "self",
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

    validateRecordOrThrow(response.data.value, AppGainforestOrganizationInfo);

    return response.data as GetRecordResponse<AppGainforestOrganizationInfo.Record>;
  });

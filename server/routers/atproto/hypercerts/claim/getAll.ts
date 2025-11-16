import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { GetRecordResponse } from "@/server/utils/response-types";
import { TRPCError } from "@trpc/server";
import {
  AppGainforestOrganizationDefaultSite,
  AppGainforestOrganizationSite,
  OrgHypercertsClaimClaim,
} from "@/lexicon-api";
import { tryCatch } from "@/lib/tryCatch";
import { XRPCError } from "@atproto/xrpc";
import { getReadAgent } from "@/server/utils/agent";
import { xrpcErrorToTRPCError } from "@/server/utils/classify-xrpc-error";
import { validateRecordOrThrow } from "../../utils";

export const getAllClaimsPure = async (did: string) => {
  const claimNSID: OrgHypercertsClaimClaim.Record["$type"] =
    "org.hypercerts.claim.claim";
  const agent = getReadAgent();
  const [listClaimsResponse, errorListClaims] = await tryCatch(
    agent.com.atproto.repo.listRecords({
      collection: claimNSID,
      repo: did,
    })
  );

  if (errorListClaims) {
    if (errorListClaims instanceof XRPCError) {
      const trpcError = xrpcErrorToTRPCError(errorListClaims);
      throw trpcError;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unknown error occurred.",
    });
  } else if (listClaimsResponse.success !== true) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unknown error occurred.",
    });
  }

  const validRecords = listClaimsResponse.data.records
    .map((record) => {
      try {
        validateRecordOrThrow(record.value, OrgHypercertsClaimClaim);
        return record;
      } catch {
        return null;
      }
    })
    .filter(
      (record) => record !== null
    ) as GetRecordResponse<OrgHypercertsClaimClaim.Record>[];

  return {
    claims: validRecords,
  };
};

export const getAllClaims = publicProcedure
  .input(z.object({ did: z.string() }))
  .query(async ({ input }) => {
    return await getAllClaimsPure(input.did);
  });

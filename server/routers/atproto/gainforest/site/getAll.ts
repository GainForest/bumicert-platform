import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { GetRecordResponse } from "@/server/utils/response-types";
import { TRPCError } from "@trpc/server";
import {
  AppGainforestOrganizationDefaultSite,
  AppGainforestOrganizationSite,
} from "@/lexicon-api";
import { tryCatch } from "@/lib/tryCatch";
import { XRPCError } from "@atproto/xrpc";
import { getReadAgent } from "@/server/utils/agent";
import { xrpcErrorToTRPCError } from "@/server/utils/classify-xrpc-error";
import { validateRecordOrThrow } from "../../utils";

export const getAllSites = publicProcedure
  .input(z.object({ did: z.string() }))
  .query(async ({ input }) => {
    const agent = getReadAgent();
    const listSitesTryCatchPromise = tryCatch(
      agent.com.atproto.repo.listRecords({
        collection: "app.gainforest.organization.site",
        repo: input.did,
      })
    );
    const getDefaultSiteTryCatchPromise = tryCatch(
      agent.com.atproto.repo.getRecord({
        collection: "app.gainforest.organization.defaultSite",
        repo: input.did,
        rkey: "self",
      })
    );

    const [
      [listSitesResponse, errorListSites],
      [getDefaultSiteResponse, errorGetDefaultSite],
    ] = await Promise.all([
      listSitesTryCatchPromise,
      getDefaultSiteTryCatchPromise,
    ]);

    if (errorListSites) {
      if (errorListSites instanceof XRPCError) {
        const trpcError = xrpcErrorToTRPCError(errorListSites);
        throw trpcError;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unknown error occurred.",
      });
    } else if (listSitesResponse.success !== true) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unknown error occurred.",
      });
    }

    const validRecords = listSitesResponse.data.records
      .map((record) => {
        const result = AppGainforestOrganizationSite.validateRecord(
          record.value
        );
        if (result.success) return record;
        return null;
      })
      .filter(
        (record) => record !== null
      ) as GetRecordResponse<AppGainforestOrganizationSite.Record>[];

    let defaultSite = null;
    if (getDefaultSiteResponse) {
      defaultSite =
        getDefaultSiteResponse.data as GetRecordResponse<AppGainforestOrganizationDefaultSite.Record>;
      try {
        validateRecordOrThrow(
          defaultSite.value,
          AppGainforestOrganizationDefaultSite
        );
      } catch {
        defaultSite = null;
      }
    }

    return {
      sites: validRecords,
      defaultSite,
    };
  });

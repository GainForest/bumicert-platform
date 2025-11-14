import { protectedProcedure } from "@/server/trpc";
import z from "zod";
import { GetRecordResponse } from "@/server/utils/response-types";
import {
  AppGainforestOrganizationDefaultSite,
  AppGainforestOrganizationSite,
} from "@/lexicon-api";
import { getReadAgent, getWriteAgent } from "@/server/utils/agent";
import { TRPCError } from "@trpc/server";
import getRkeyFromAtUri from "@/lib/atproto/getRkeyFromAtUri";
import { validateRecordOrThrow } from "../../utils";

export const setDefaultSite = protectedProcedure
  .input(z.object({ siteAtUri: z.string() }))
  .mutation(async ({ input }) => {
    const agent = await getWriteAgent();
    if (!agent.did) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authenticated",
      });
    }

    const siteUri = input.siteAtUri;
    const siteNSID: AppGainforestOrganizationSite.Record["$type"] =
      "app.gainforest.organization.site";
    if (!(siteUri.startsWith(`at://`) && siteUri.includes(siteNSID))) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid site URI",
      });
    }

    const site = await agent.com.atproto.repo.getRecord({
      collection: siteNSID,
      repo: agent.did,
      rkey: getRkeyFromAtUri(siteUri),
    });
    if (site.success !== true) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get site",
      });
    }

    const defaultSiteNSID: AppGainforestOrganizationDefaultSite.Record["$type"] =
      "app.gainforest.organization.defaultSite";
    const defaultSite: AppGainforestOrganizationDefaultSite.Record = {
      $type: defaultSiteNSID,
      site: siteUri,
    };
    validateRecordOrThrow(defaultSite, AppGainforestOrganizationDefaultSite);
    const updateDefaultSiteResponse = await agent.com.atproto.repo.putRecord({
      collection: defaultSiteNSID,
      repo: agent.did,
      rkey: "self",
      record: defaultSite,
    });

    if (updateDefaultSiteResponse.success !== true) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update default site",
      });
    }

    return updateDefaultSiteResponse.data;
  });

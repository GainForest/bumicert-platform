import { AppGainforestOrganizationDefaultSite } from "@/lexicon-api";
import parseAtUri from "@/lib/atproto/getRkeyFromAtUri";
import { protectedProcedure } from "@/server/trpc";
import { getWriteAgent } from "@/server/utils/agent";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { validateRecordOrThrow } from "../../utils";

export const deleteSite = protectedProcedure
  .input(z.object({ siteAtUri: z.string() }))
  .mutation(async ({ input }) => {
    const agent = await getWriteAgent();
    if (!agent.did) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authenticated",
      });
    }

    try {
      // Check if the site is the default site
      const defaultSiteNSID: AppGainforestOrganizationDefaultSite.Record["$type"] =
        "app.gainforest.organization.defaultSite";
      const defaultSiteResponse = await agent.com.atproto.repo.getRecord({
        collection: defaultSiteNSID,
        repo: agent.did,
        rkey: "self",
      });
      if (defaultSiteResponse.success !== true)
        throw Error("Failed to get default site");
      validateRecordOrThrow(
        defaultSiteResponse.data.value,
        AppGainforestOrganizationDefaultSite
      );
      const defaultSite = defaultSiteResponse.data
        .value as AppGainforestOrganizationDefaultSite.Record;
      if (defaultSite.site === input.siteAtUri) throw new Error("Equal");
    } catch (error) {
      // Only take action if the default site is determined and equals the site to be deleted
      if (error instanceof Error && error.message === "Equal") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete default site",
        });
      }
    }

    const deletionResponse = await agent.com.atproto.repo.deleteRecord({
      collection: "app.gainforest.organization.site",
      repo: agent.did,
      rkey: parseAtUri(input.siteAtUri).rkey,
    });
    if (deletionResponse.success !== true)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete site",
      });

    return deletionResponse.data;
  });

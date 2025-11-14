import { publicProcedure } from "@/server/trpc";
import z from "zod";
import { GetRecordResponse } from "@/server/utils/response-types";
import { AppGainforestOrganizationDefaultSite } from "@/lexicon-api";
import { getReadAgent } from "@/server/utils/agent";

export const getDefaultProjectSite = publicProcedure
  .input(z.object({ did: z.string() }))
  .query(async ({ input }) => {
    const agent = getReadAgent();
    const response = await agent.com.atproto.repo.getRecord({
      collection: "app.gainforest.organization.defaultSite",
      repo: input.did,
      rkey: "self",
    });
    if (response.success !== true) {
      throw new Error("Failed to get default project site");
    }
    return response.data as GetRecordResponse<AppGainforestOrganizationDefaultSite.Record>;
  });

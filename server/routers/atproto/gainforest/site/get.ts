import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { getReadAgent } from "@/server/utils/agent";
import { AppGainforestOrganizationSite } from "@/lexicon-api";
import { GetRecordResponse } from "@/server/utils/response-types";
import { validateRecordOrThrow } from "../../utils";

export const getProjectSite = publicProcedure
  .input(z.object({ did: z.string(), rkey: z.string() }))
  .query(async ({ input }) => {
    const agent = getReadAgent();
    const response = await agent.com.atproto.repo.getRecord({
      collection: "app.gainforest.organization.site",
      repo: input.did,
      rkey: input.rkey,
    });
    if (response.success !== true) {
      throw new Error("Failed to get project site");
    }
    validateRecordOrThrow(response.data.value, AppGainforestOrganizationSite);
    return response.data as GetRecordResponse<AppGainforestOrganizationSite.Record>;
  });

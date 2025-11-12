import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { getReadAgent } from "@/server/utils";

export const listSites = publicProcedure
  .input(z.object({ did: z.string() }))
  .query(async ({ input }) => {
    const agent = getReadAgent();
    const response = await agent.com.atproto.repo.listRecords({
      collection: "app.gainforest.organization.site",
      repo: input.did,
    });
    if (response.success !== true) {
      throw new Error("Failed to list project sites");
    }
    return response.data;
  });

import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { getReadAgent, GetRecordResponse } from "@/server/utils";
import { TRPCError } from "@trpc/server";
import { validate } from "@/lexicon-api/lexicons";
import { AppGainforestOrganizationSite } from "@/lexicon-api";

export const getAllSites = publicProcedure
  .input(z.object({ did: z.string() }))
  .query(async ({ input }) => {
    const agent = getReadAgent();
    const response = await agent.com.atproto.repo.listRecords({
      collection: "app.gainforest.organization.site",
      repo: input.did,
    });
    if (response.success !== true) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to list project sites",
      });
    }

    return response.data
      .records as GetRecordResponse<AppGainforestOrganizationSite.Record>[];
    // const records = response.data.records.map((record) => record.value);

    // TODO: VALIDATE RECORDS
    // const validRecords = records.filter((record) => {
    //   const result = AppGainforestOrganizationSite.validateRecord(record);
    //   console.log(record, result);
    //   return result.success;
    // }) as AppGainforestOrganizationSite.Record[];

    // return records as AppGainforestOrganizationSite.Record[];
  });

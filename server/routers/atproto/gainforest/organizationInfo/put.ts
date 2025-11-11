import { protectedProcedure } from "@/server/trpc";
import z from "zod";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";
import { validate } from "@/lexicon-api/lexicons";
import { getWriteAgent, PutRecordResponse } from "@/server/utils";
import { BlobRefJSONSchema, toBlobRef } from "../../utils";

export const putOrganizationInfo = protectedProcedure
  .input(
    z.object({
      did: z.string(),
      info: z.object({
        displayName: z.string(),
        shortDescription: z.string(),
        longDescription: z.string(),
        website: z.string().optional(),
        logo: BlobRefJSONSchema.optional(),
        coverImage: BlobRefJSONSchema.optional(),
        objectives: z.array(
          z.enum([
            "Conservation",
            "Research",
            "Education",
            "Community",
            "Other",
          ])
        ),
        startDate: z.string(),
        country: z.string(),
        visibility: z.enum(["Public", "Hidden"]),
      }),
    })
  )
  .mutation(async ({ input }) => {
    const agent = await getWriteAgent();
    const info: AppGainforestOrganizationInfo.Record = {
      $type: "app.gainforest.organization.info",
      displayName: input.info.displayName,
      shortDescription: input.info.shortDescription,
      longDescription: input.info.longDescription,
      website: input.info.website ? input.info.website : undefined,
      logo: input.info.logo ? toBlobRef(input.info.logo) : undefined,
      coverImage:
        input.info.coverImage ? toBlobRef(input.info.coverImage) : undefined,
      objectives: input.info.objectives,
      startDate: new Date().toISOString(),
      country: input.info.country,
      visibility: input.info.visibility,
    };

    const result = validate(info, "app.gainforest.organization.info", "main");
    if (!result.success) {
      throw new Error(result.error.message);
    }

    const response = await agent.com.atproto.repo.putRecord({
      collection: "app.gainforest.organization.info",
      repo: input.did,
      rkey: "self",
      record: info,
    });

    return {
      ...response,
      value: info,
    } as PutRecordResponse<AppGainforestOrganizationInfo.Record>;
  });

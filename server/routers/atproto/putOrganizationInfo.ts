import { publicProcedure } from "@/server/trpc";
import z from "zod";
import { getWriteAgent } from "../_app";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";
import { BlobRef, typedJsonBlobRef } from "@atproto/lexicon";
import { CID } from "multiformats/cid";
import { validate } from "@/lexicon-api/lexicons";

export const putOrganizationInfo = publicProcedure
  .input(
    z.object({
      did: z.string(),
      info: z.object({
        $type: z.literal("app.gainforest.organization.info"),
        displayName: z.string(),
        shortDescription: z.string(),
        longDescription: z.string(),
        website: z.string().optional(),
        coverImage: z.instanceof(BlobRef).optional(),
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
    const agent = getWriteAgent();
    const info: AppGainforestOrganizationInfo.Record = {
      $type: "app.gainforest.organization.info",
      displayName: input.info.displayName,
      shortDescription: input.info.shortDescription,
      longDescription: input.info.longDescription,
      website: input.info.website ? input.info.website : undefined,
      coverImage: input.info.coverImage,
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

    return response;
  });

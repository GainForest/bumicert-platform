import { protectedProcedure } from "@/server/trpc";
import z from "zod";
import { OrgHypercertsClaimRecord } from "@/lexicon-api";
import { BlobRef } from "@atproto/lexicon";
import { validate } from "@/lexicon-api/lexicons";
import { getWriteAgent, PutRecordResponse } from "@/server/utils";
import { TRPCError } from "@trpc/server";
import { BlobRefJSONSchema } from "../../utils";

/**
 * This procedure is solely used to create a new ecocert
 * with bare minimum information based on
 * ecocertain's new ecocert submit form.
 **/
export const postHypercertClaim = protectedProcedure
  .input(
    z.object({
      info: z.object({
        title: z.string(),
        shortDescription: z.string(),
        description: z.string().optional(),
        image: z
          .union([
            z.object({
              $type: z.literal("app.certified.defs.uri"),
              uri: z.string(),
            }),
            z.object({
              $type: z.literal("app.certified.defs.smallBlob"),
              blob: BlobRefJSONSchema,
            }),
          ])
          .optional(),
        workScope: z.string(),
        workTimeFrameFrom: z.string(),
        workTimeFrameTo: z.string(),
        contributions: z.array(BlobRefJSONSchema).optional(),
        location: z.array(BlobRefJSONSchema).optional(),
        createdAt: z.string(),
      }),
    })
  )
  .mutation(async ({ input }) => {
    const agent = await getWriteAgent();
    const did = agent.did;
    if (!did) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to perform this action.",
      });
    }
    const info: OrgHypercertsClaimRecord.Record = {
      $type: "org.hypercerts.claim.record",
      title: input.info.title,
      shortDescription: input.info.shortDescription,
      description: input.info.description,
      image: input.info.image,
      workScope: input.info.workScope,
      workTimeFrameFrom: input.info.workTimeFrameFrom,
      workTimeFrameTo: input.info.workTimeFrameTo,
      createdAt: new Date().toISOString(),
    };

    const result = validate(info, "org.hypercerts.claim.record", "main");
    if (!result.success) {
      throw new Error(result.error.message);
    }

    const response = await agent.com.atproto.repo.putRecord({
      collection: "org.hypercerts.claim.record",
      repo: did,
      rkey: "self",
      record: info,
    });

    return {
      ...response,
      value: info,
    } as PutRecordResponse<OrgHypercertsClaimRecord.Record>;
  });

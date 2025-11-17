import { protectedProcedure } from "@/server/trpc";
import z from "zod";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";
import { validate } from "@/lexicon-api/lexicons";
import { PutRecordResponse } from "@/server/utils/response-types";
import { Agent } from "@atproto/api";
import { TRPCError } from "@trpc/server";
import { getWriteAgent } from "@/server/utils/agent";
import {
  BlobRefGenerator,
  BlobRefGeneratorSchema,
  FileGenerator,
  FileGeneratorSchema,
  toBlobRef,
  toBlobRefGenerator,
  validateRecordOrThrow,
} from "../../utils";

const uploadFile = async (fileGenerator: FileGenerator, agent: Agent) => {
  const file = new File(
    [Buffer.from(fileGenerator.dataBase64, "base64")],
    fileGenerator.name,
    { type: fileGenerator.type }
  );
  const response = await agent.uploadBlob(file);
  return toBlobRefGenerator(response.data.blob);
};

export const createOrUpdateOrganizationInfo = protectedProcedure
  .input(
    z.object({
      did: z.string(),
      info: z.object({
        displayName: z.string(),
        shortDescription: z.string(),
        longDescription: z.string(),
        website: z.string().optional(),
        logo: BlobRefGeneratorSchema.optional(),
        coverImage: BlobRefGeneratorSchema.optional(),
        objectives: z.array(
          z.enum([
            "Conservation",
            "Research",
            "Education",
            "Community",
            "Other",
          ])
        ),
        startDate: z.string().optional(),
        country: z.string(),
        visibility: z.enum(["Public", "Hidden"]),
      }),
      uploads: z
        .object({
          logo: FileGeneratorSchema.optional(),
          coverImage: FileGeneratorSchema.optional(),
        })
        .optional(),
    })
  )
  .mutation(async ({ input }) => {
    const agent = await getWriteAgent();
    const logoBlobRefGenerator =
      input.uploads?.logo ?
        await uploadFile(input.uploads.logo, agent)
      : input.info.logo;
    const coverImageBlobRefGenerator =
      input.uploads?.coverImage ?
        await uploadFile(input.uploads.coverImage, agent)
      : input.info.coverImage;

    const info: AppGainforestOrganizationInfo.Record = {
      $type: "app.gainforest.organization.info",
      displayName: input.info.displayName,
      shortDescription: input.info.shortDescription,
      longDescription: input.info.longDescription,
      website: input.info.website ? input.info.website : undefined,
      logo:
        logoBlobRefGenerator ?
          {
            $type: "app.gainforest.common.defs#smallImage",
            image: toBlobRef(logoBlobRefGenerator),
          }
        : undefined,
      coverImage:
        coverImageBlobRefGenerator ?
          {
            $type: "app.gainforest.common.defs#smallImage",
            image: toBlobRef(coverImageBlobRefGenerator),
          }
        : undefined,
      objectives: input.info.objectives,
      startDate: input.info.startDate ? input.info.startDate : undefined,
      country: input.info.country,
      visibility: input.info.visibility,
    };

    validateRecordOrThrow(info, AppGainforestOrganizationInfo);

    const response = await agent.com.atproto.repo.putRecord({
      repo: input.did,
      collection: "app.gainforest.organization.info",
      record: info,
      rkey: "self",
    });

    if (response.success !== true) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update organization info",
      });
    }

    return {
      ...response.data,
      value: info,
    } as PutRecordResponse<AppGainforestOrganizationInfo.Record>;
  });

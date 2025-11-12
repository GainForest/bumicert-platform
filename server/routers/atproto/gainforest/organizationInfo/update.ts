import { protectedProcedure } from "@/server/trpc";
import z from "zod";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";
import { validate } from "@/lexicon-api/lexicons";
import { getWriteAgent, PutRecordResponse } from "@/server/utils";
import {
  BlobRefJSON,
  BlobRefJSONSchema,
  FileGenerator,
  FileGeneratorSchema,
  toBlobRef,
} from "../../utils";
import { Agent } from "@atproto/api";
import { TRPCError } from "@trpc/server";

const uploadFile = async (fileGenerator: FileGenerator, agent: Agent) => {
  const file = new File(
    [Buffer.from(fileGenerator.dataBase64, "base64")],
    fileGenerator.name,
    { type: fileGenerator.type }
  );
  const response = await agent.uploadBlob(file);
  return response.data.blob.toJSON() as BlobRefJSON;
};

export const updateOrganizationInfo = protectedProcedure
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
    const logoBlobRef =
      input.uploads?.logo ?
        await uploadFile(input.uploads.logo, agent)
      : undefined;
    const coverImageBlobRef =
      input.uploads?.coverImage ?
        await uploadFile(input.uploads.coverImage, agent)
      : undefined;

    const info: AppGainforestOrganizationInfo.Record = {
      $type: "app.gainforest.organization.info",
      displayName: input.info.displayName,
      shortDescription: input.info.shortDescription,
      longDescription: input.info.longDescription,
      website: input.info.website ? input.info.website : undefined,
      logo: logoBlobRef ? toBlobRef(logoBlobRef) : undefined,
      coverImage: coverImageBlobRef ? toBlobRef(coverImageBlobRef) : undefined,
      objectives: input.info.objectives,
      startDate: new Date().toISOString(),
      country: input.info.country,
      visibility: input.info.visibility,
    };

    const result = validate(info, "app.gainforest.organization.info", "main");
    if (!result.success) {
      throw new Error(result.error.message);
    }

    const response = await agent.com.atproto.repo.applyWrites({
      repo: input.did,
      writes: [
        {
          $type: "com.atproto.repo.applyWrites#update",
          collection: "app.gainforest.organization.info",
          rkey: "self",
          value: info,
        },
      ],
    });

    if (response.success !== true) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update organization info",
      });
    }

    return {
      success: true,
      uploads:
        input.uploads ?
          {
            logo:
              input.uploads.logo ?
                logoBlobRef ? toBlobRef(logoBlobRef)
                : undefined
              : undefined,
            coverImage:
              input.uploads.coverImage ?
                coverImageBlobRef ? toBlobRef(coverImageBlobRef)
                : undefined
              : undefined,
          }
        : undefined,
      value: info,
    };
  });

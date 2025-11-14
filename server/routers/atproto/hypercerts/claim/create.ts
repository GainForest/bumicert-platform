import { protectedProcedure } from "@/server/trpc";
import z from "zod";
import { BlobRef } from "@atproto/lexicon";
import { validate } from "@/lexicon-api/lexicons";
import { PutRecordResponse } from "@/server/utils/response-types";
import { TRPCError } from "@trpc/server";
import {
  BlobRefJSON,
  BlobRefJSONSchema,
  FileGenerator,
  FileGeneratorSchema,
  toBlobRef,
  toFile,
  validateRecordOrThrow,
} from "../../utils";
import { Agent } from "@atproto/api";
import {
  AppCertifiedLocation,
  OrgHypercertsClaim,
  OrgHypercertsClaimContribution,
} from "@/lexicon-api";
import { getWriteAgent } from "@/server/utils/agent";

const uploadFile = async (fileGenerator: FileGenerator, agent: Agent) => {
  const file = new File(
    [Buffer.from(fileGenerator.dataBase64, "base64")],
    fileGenerator.name,
    { type: fileGenerator.type }
  );
  const response = await agent.uploadBlob(file);
  return response.data.blob.toJSON() as BlobRefJSON;
};

/**
 * This procedure is solely used to create a new ecocert
 * with bare minimum information based on
 * ecocertain's new ecocert submit form.
 **/
export const createHypercertClaim = protectedProcedure
  .input(
    z.object({
      claim: z.object({
        title: z.string(),
        shortDescription: z.string(),
        description: z.string().optional(),
        workScope: z.array(z.string()),
        workTimeFrameFrom: z.string(),
        workTimeFrameTo: z.string(),
        createdAt: z.string(),
      }),
      uploads: z.object({
        image: FileGeneratorSchema,
        contributors: z.array(z.string()).refine((v) => v.length > 0, {
          message: "At least one contribution is required",
        }),
        siteAtUri: z.string(),
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

    // Generate record data for validation before writing to the PDS:
    // Location record
    const location: AppCertifiedLocation.Record = {
      $type: "app.certified.location",
      lpVersion: "1.0.0",
      srs: "https://epsg.io/3857",
      locationType: "geojson",
      location: {
        $type: "app.certified.defs#uri",
        uri: input.uploads.siteAtUri,
      },
      createdAt: new Date().toISOString(),
    };
    const validatedLocation = validateRecordOrThrow(
      location,
      AppCertifiedLocation
    );

    // Claim record
    const claim: OrgHypercertsClaim.Record = {
      $type: "org.hypercerts.claim",
      title: input.claim.title,
      shortDescription: input.claim.shortDescription,
      description: input.claim.description,
      // These will be set after the records are created:
      image: undefined,
      location: undefined,
      contributions: undefined,
      // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      workScope: input.claim.workScope.join(", "),
      workTimeFrameFrom: input.claim.workTimeFrameFrom,
      workTimeFrameTo: input.claim.workTimeFrameTo,
      createdAt: new Date().toISOString(),
    };
    const validatedClaim = validateRecordOrThrow(claim, OrgHypercertsClaim);

    // Contribution record
    const contribution: OrgHypercertsClaimContribution.Record = {
      $type: "org.hypercerts.claim.contribution",
      // Use dummy hypercert reference for now because the claim record is not yet created:
      hypercert: {
        $type: "com.atproto.repo.strongRef",
        uri: `at://${did}/org.hypercerts.claim/0`,
        cid: "bafkreifj2t4px2uizj25ml53axem47yfhpgsx72ekjrm2qyymcn5ifz744",
      },
      // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      role: "Contributor",
      contributors: input.uploads.contributors,
      createdAt: new Date().toISOString(),
    };
    const validatedContribution = validateRecordOrThrow(
      contribution,
      OrgHypercertsClaimContribution
    );

    // Write records to the PDS
    // 1. Write location to the PDS
    const locationWriteResponse = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: "app.certified.location",
      record: validatedLocation,
    });
    if (locationWriteResponse.success !== true) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to write location record",
      });
    }
    // 2. Upload image to the PDS
    const imageBlobRef = await uploadFile(input.uploads.image, agent);
    // 3. Write claim to the PDS
    const claimResponse = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: "org.hypercerts.claim",
      record: {
        ...validatedClaim,
        image: {
          $type: "app.certified.defs#smallImage",
          image: toBlobRef(imageBlobRef),
        },
        location: {
          $type: "com.atproto.repo.strongRef",
          uri: locationWriteResponse.data.uri,
          cid: locationWriteResponse.data.cid,
        },
      } satisfies OrgHypercertsClaim.Record,
    });
    if (claimResponse.success !== true) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to write claim record",
      });
    }
    // 4. Write contribution to the PDS
    const contributionWriteResponse = await agent.com.atproto.repo.createRecord(
      {
        repo: did,
        collection: "org.hypercerts.claim.contribution",
        record: {
          ...validatedContribution,
          hypercert: {
            $type: "com.atproto.repo.strongRef",
            uri: claimResponse.data.uri,
            cid: claimResponse.data.cid,
          },
        } satisfies OrgHypercertsClaimContribution.Record,
      }
    );
    if (contributionWriteResponse.success !== true) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to write contribution record",
      });
    }

    return claimResponse;
  });

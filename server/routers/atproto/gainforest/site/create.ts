import { protectedProcedure, publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { getWriteAgent } from "@/server/utils/agent";
import { AppGainforestOrganizationSite } from "@/lexicon-api";
import {
  BlobRefGeneratorSchema,
  FileGeneratorSchema,
  toFile,
} from "../../utils";
import { TRPCError } from "@trpc/server";
import { validateGeojsonOrThrow } from "@/lib/geojson/validate";
import { tryCatch } from "@/lib/tryCatch";
import { GeoJsonObject } from "geojson";
import { computePolygonMetrics } from "@/lib/geojson/computations";
import { computeGeojsonFile, fetchGeojsonFromUrl } from "./utils";

export const createSite = protectedProcedure
  .input(
    z.object({
      rkey: z.string().optional(),
      site: z.object({
        name: z.string().min(1),
      }),
      uploads: z.object({
        shapefile: z.union([z.url(), FileGeneratorSchema]),
      }),
    })
  )
  .mutation(async ({ input }) => {
    const agent = await getWriteAgent();
    if (!agent.did) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authenticated",
      });
    }

    // If the site is a string, its a URI, so fetch the file from the URI
    let file: File;
    if (typeof input.uploads.shapefile === "string") {
      file = await fetchGeojsonFromUrl(input.uploads.shapefile);
    } else {
      file = await toFile(input.uploads.shapefile);
    }

    const { lat, lon, area } = await computeGeojsonFile(file);

    const geojsonUploadResponse = await agent.uploadBlob(file);
    const geojsonBlobRef = geojsonUploadResponse.data.blob;

    const nsid: AppGainforestOrganizationSite.Record["$type"] =
      "app.gainforest.organization.site";
    const site: AppGainforestOrganizationSite.Record = {
      $type: nsid,
      name: input.site.name,
      lat: lat,
      lon: lon,
      area: area,
      shapefile: {
        $type: "app.gainforest.common.defs#smallBlob",
        blob: geojsonBlobRef,
      },
    };

    const validationResult = AppGainforestOrganizationSite.validateRecord(site);
    if (!validationResult.success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: validationResult.error.message,
      });
    }

    const creationResponse = await agent.com.atproto.repo.createRecord({
      collection: nsid,
      repo: agent.did,
      record: site,
    });

    if (creationResponse.success !== true) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to add new site",
      });
    }

    return creationResponse.data;
  });

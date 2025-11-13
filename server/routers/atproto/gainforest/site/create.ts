import { protectedProcedure, publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { getReadAgent, getWriteAgent } from "@/server/utils";
import { AppGainforestOrganizationSite } from "@/lexicon-api";
import { GetRecordResponse } from "@/server/utils";
import { FileGeneratorSchema, toFile } from "../../utils";
import { TRPCError } from "@trpc/server";

export const createSite = protectedProcedure
  .input(
    z.object({
      site: z
        .object({
          name: z.string(),
          lat: z.string().regex(/^\d+(\.\d+)?$/, {
            message: "Latitude is not a valid number",
          }),
          lon: z.string().regex(/^\d+(\.\d+)?$/, {
            message: "Longitude is not a valid number",
          }),
          area: z
            .string()
            .regex(/^\d+(\.\d+)?$/, { message: "Area is not a valid number" }),
        })
        .refine(
          (data) => {
            try {
              const isValidLatitude =
                parseFloat(data.lat) >= -90 && parseFloat(data.lat) <= 90;
              const isValidLongitude =
                parseFloat(data.lon) >= -180 && parseFloat(data.lon) <= 180;
              return isValidLatitude && isValidLongitude;
            } catch (error) {
              return false;
            }
          },
          {
            message: "Latitude and longitude must be valid coordinates",
          }
        ),
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
    let file: File | null = null;
    if (typeof input.uploads.shapefile === "string") {
      const url = input.uploads.shapefile;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch site");
      }
      const blob = await response.blob();
      if (blob.type !== "application/geo+json") {
        throw new Error("Site must be a GeoJSON file");
      }
      file = new File([blob], url.split("/").pop() || "site.geojson", {
        type: blob.type,
      });
    } else {
      file = await toFile(input.uploads.shapefile);
    }

    const geojsonUploadResponse = await agent.uploadBlob(file);
    const geojsonBlobRef = geojsonUploadResponse.data.blob;
    const site: AppGainforestOrganizationSite.Record = {
      $type: "app.gainforest.organization.site",
      name: input.site.name,
      lat: input.site.lat,
      lon: input.site.lon,
      area: input.site.area,
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

    const writeResult = await agent.com.atproto.repo.applyWrites({
      repo: agent.did,
      writes: [
        {
          $type: "com.atproto.repo.applyWrites#create",
          collection: "app.gainforest.organization.site",
          value: site,
        },
      ],
    });

    if (writeResult.success !== true) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create site",
      });
    }

    return {
      success: true,
      uploads: {
        shapefile: geojsonBlobRef.toJSON(),
      },
      value: site,
    };
  });

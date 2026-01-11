import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { BlobRefGenerator, BlobRef } from "climateai-sdk/zod";

export const getShapefilePreviewUrl = (
  shapefile:
    | string
    | {
        blob: BlobRef | BlobRefGenerator;
        did: string;
      }
) => {
  const suffix = "https://gainforest.app/geo/view?source-value=";
  if (typeof shapefile === "string") {
    return `${suffix}${encodeURIComponent(shapefile)}`;
  }
  return `${suffix}${encodeURIComponent(
    getBlobUrl(shapefile.did, shapefile.blob, allowedPDSDomains[0])
  )}`;
};

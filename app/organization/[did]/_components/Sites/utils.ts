import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { BlobRefGenerator, BlobRef } from "climateai-sdk/zod";

export const getShapefilePreviewUrl = <T extends BlobRef | BlobRefGenerator>(
  shapefile: T | string,
  did: T extends BlobRef | BlobRefGenerator ? string : undefined
) => {
  const suffix = "https://gainforest.app/geo/view?source-value=";
  if (typeof shapefile === "string") {
    return `${suffix}${encodeURIComponent(shapefile)}`;
  }
  return `${suffix}${encodeURIComponent(
    getBlobUrl(did, shapefile, allowedPDSDomains[0])
  )}`;
};

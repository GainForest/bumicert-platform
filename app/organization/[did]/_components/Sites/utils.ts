import { getBlobUrl } from "climateai-sdk/utilities";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { BlobRefGenerator } from "climateai-sdk/zod-schemas";
import { BlobRef } from "@atproto/api";

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

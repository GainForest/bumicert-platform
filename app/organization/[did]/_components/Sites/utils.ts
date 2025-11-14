import getBlobUrl from "@/lib/atproto/getBlobUrl";
import { BlobRefJSON } from "@/server/routers/atproto/utils";
import { BlobRef } from "@atproto/api";

export const getShapefilePreviewUrl = <T extends BlobRef | BlobRefJSON>(
  shapefile: T | string,
  did: T extends BlobRef | BlobRefJSON ? string : undefined
) => {
  const suffix = "https://gainforest.app/geo/view?source-value=";
  if (typeof shapefile === "string") {
    return `${suffix}${encodeURIComponent(shapefile)}`;
  }
  return `${suffix}${encodeURIComponent(getBlobUrl(did, shapefile))}`;
};

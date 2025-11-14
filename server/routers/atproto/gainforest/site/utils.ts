import { GeoJsonObject } from "geojson";
import { TRPCError } from "@trpc/server";
import { validateGeojsonOrThrow } from "@/lib/geojson/validate";
import { tryCatch } from "@/lib/tryCatch";
import { computePolygonMetrics } from "@/lib/geojson/computations";

export async function fetchGeojsonFromUrl(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch site",
    });
  }
  const blob = await response.blob();
  if (blob.type !== "application/geo+json") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Site must be a GeoJSON file",
    });
  }
  const file = new File([blob], "site.geojson", {
    type: blob.type,
  });
  return file;
}

export async function computeGeojsonFile(file: File) {
  if (file.type !== "application/geo+json") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Site must be a GeoJSON file",
    });
  }

  const geojsonText = await file.text();
  const geojson = JSON.parse(geojsonText);
  const [validatedGeojsonObject, geojsonValidationError] = await tryCatch(
    new Promise<GeoJsonObject>((r) => r(validateGeojsonOrThrow(geojson)))
  );

  if (geojsonValidationError) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid GeoJSON file: " + geojsonValidationError.message,
    });
  }

  const polygonMetrics = computePolygonMetrics(validatedGeojsonObject);
  const lat = polygonMetrics.centroid?.lat;
  const lon = polygonMetrics.centroid?.lon;
  const area = polygonMetrics.areaHectares;
  if (!lat || !lon || !area) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to process the geojson data.",
    });
  }

  return {
    lat: lat.toFixed(6),
    lon: lon.toFixed(6),
    area: area.toFixed(2),
  };
}

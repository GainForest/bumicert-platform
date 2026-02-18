/** Returns distance in meters between two lat/lng points */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6_371_000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/** Precision levels and their radius in meters */
export const PRECISION_LEVELS = {
  exact: 100,
  nearby: 1_000,
  area: 10_000,
  region: 100_000,
} as const;

export type PrecisionLevel = keyof typeof PRECISION_LEVELS;

/** Human-friendly labels for each precision level */
export const PRECISION_LABELS: Record<PrecisionLevel, string> = {
  exact: "Exact (~100m)",
  nearby: "Nearby (~1km)",
  area: "Area (~10km)",
  region: "Region (~100km)",
};

/** Parse a coordinate string like "-3.4653, 142.0723" into { lat, lng } or null */
export function parseCoordinateString(
  coords: string,
): { lat: number; lng: number } | null {
  const parts = coords.split(",");
  if (parts.length < 2) return null;

  const lat = parseFloat(parts[0].trim());
  const lng = parseFloat(parts[1].trim());

  if (isNaN(lat) || isNaN(lng)) return null;

  return { lat, lng };
}

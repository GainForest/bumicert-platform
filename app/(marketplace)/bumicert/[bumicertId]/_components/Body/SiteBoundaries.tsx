"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, MapPin } from "lucide-react";
import React from "react";
import Link from "next/link";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { parseAtUri, getBlobUrl } from "climateai-sdk/utilities/atproto";
import { AppGainforestCommonDefs as Defs } from "climateai-sdk/lex-api";
import { $Typed } from "climateai-sdk/lex-api/utils";
import { trpcApi } from "@/components/providers/TrpcProvider";

const SiteBoundaries = ({ locationAtUri }: { locationAtUri: string }) => {
  const { did, rkey } = parseAtUri(locationAtUri);
  const { data: locationResponse, isPending } =
    trpcApi.hypercerts.location.get.useQuery({
      did,
      rkey,
      pdsDomain: allowedPDSDomains[0],
    });

  const location = locationResponse?.value;
  const locationData = location?.location;
  const locationUri = locationData
    ? getBlobUrl(
        did,
        locationData as $Typed<Defs.Uri | Defs.SmallBlob>,
        allowedPDSDomains[0]
      )
    : undefined;
  const locationName = location?.name;

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold text-foreground mb-4">Location</h2>
      
      <div className="rounded-xl overflow-hidden border border-border/50 bg-muted">
        {/* Map container */}
        <div className="aspect-[4/3] relative">
          {isPending ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Loader2 className="size-6 animate-spin text-muted-foreground" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          ) : locationData ? (
            <iframe
              src={`https://gainforest.app/geo/view?source-value=${locationUri}`}
              className="w-full h-full"
              title={`Map of ${locationName ?? "Location"}`}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <MapPin className="size-6 text-muted-foreground/50" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">No location data available</p>
            </div>
          )}
        </div>

        {/* Footer with name and actions */}
        {locationData && (
          <div className="p-3 bg-background border-t border-border/50">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="size-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                <span className="text-sm font-medium truncate">
                  {locationName || "Site boundary"}
                </span>
              </div>
              <Link
                href={`https://gainforest.app/geo/view?source-value=${locationUri}`}
                target="_blank"
              >
                <Button variant="ghost" size="sm" className="shrink-0">
                  <ExternalLink className="size-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline ml-1">Open map</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteBoundaries;

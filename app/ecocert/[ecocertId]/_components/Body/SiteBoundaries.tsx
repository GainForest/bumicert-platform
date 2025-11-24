"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowUpRightFromSquare,
  CircleAlert,
  FileJsonIcon,
  Loader2,
} from "lucide-react";
import React from "react";
import { validateMetaData, type HypercertMetadata } from "@hypercerts-org/sdk";
import {
  generateEcocertainIPFSUrl,
  getMetadata,
} from "@/lib/hypercerts/getMetadata";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { trpcClient } from "@/lib/trpc/client";
import parseAtUri from "@/lib/atproto/getRkeyFromAtUri";
import getBlobUrl from "@/lib/atproto/getBlobUrl";
import { SmallBlob, Uri } from "@/lexicon-api/types/app/gainforest/common/defs";
import { $Typed } from "@/lexicon-api/util";

// type ValidatedProperties = {
//   properties: Array<{
//     trait_type: string;
//     type: string;
//     src: string;
//     name: string;
//   }>;
// };

// const getMapDataFromHypercertCID = async (
//   hypercertCID: string
// ): Promise<{
//   geojsonURL: string;
//   mapPreviewURL: string;
//   metadata: HypercertMetadata;
// } | null> => {
//   try {
//     const res = await getMetadata(hypercertCID);
//     const { data } = res;

//     const validationResult = validateMetaData(data);
//     if (!validationResult.valid) {
//       throw new Error("Invalid metadata");
//     }
//     // Type assertion since we've validated the data
//     const validatedData = validationResult.data as ValidatedProperties;

//     // Find the property with trait_type "geoJSON"
//     const geoJSONProperty = validatedData.properties.find(
//       (prop) => prop.trait_type === "geoJSON"
//     );

//     if (!geoJSONProperty) {
//       throw new Error("No site boundary found");
//     }

//     const geoJSONUri = geoJSONProperty.src;

//     const cidRegex = /^ipfs:\/\/(.+)$/;
//     const match = geoJSONUri.match(cidRegex);

//     if (!match) {
//       throw new Error("Invalid IPFS URI format");
//     }

//     const cid = match[1];
//     const geojsonURL = generateEcocertainIPFSUrl(cid);
//     const mapPreviewURL = `https://gainforest.app/geo/view?source-value=${geojsonURL}`;
//     const metadata = validationResult.data as HypercertMetadata;
//     return {
//       geojsonURL,
//       mapPreviewURL,
//       metadata,
//     };
//   } catch (error) {
//     console.error("Error getting map data from hypercert CID", error);
//     return null;
//   }
// };

const SiteBoundaries = ({ locationAtUri }: { locationAtUri: string }) => {
  // const { data: mapData, isPending } = useQuery({
  //   queryKey: ["mapData", hypercertCid],
  //   queryFn: () =>
  //     hypercertCid ? getMapDataFromHypercertCID(hypercertCid) : null,
  // });

  const { did, rkey } = parseAtUri(locationAtUri);
  const { data: locationResponse, isPending } = useQuery({
    queryKey: ["location", did, rkey],
    queryFn: () => trpcClient.hypercerts.location.get.query({ did, rkey }),
  });

  const location = locationResponse?.value;
  const locationData = location?.location;
  const locationUri =
    locationData ?
      getBlobUrl(did, locationData as $Typed<Uri | SmallBlob>)
    : undefined;
  const locationName = location?.name;

  return (
    <div className="w-full flex flex-col sticky top-[120px]">
      <h2 className="text-2xl font-bold font-serif text-primary">
        Site Boundaries
      </h2>
      <div className="mt-4 w-full h-[300px] bg-muted rounded-lg overflow-hidden flex flex-col gap-1 items-center justify-center">
        {isPending ?
          <>
            <Loader2 className="animate-spin size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading Map</p>
          </>
        : locationData ?
          <iframe
            src={`https://gainforest.app/geo/view?source-value=${locationUri}`}
            className="w-full h-full"
            title={`GeoJSON for ${locationName ?? "Location"}`}
          />
        : <>
            <CircleAlert className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No map data found.</p>
          </>
        }
      </div>
      {locationUri && (
        <div className="flex items-center gap-2 mt-2">
          <Link href={locationUri} target="_blank" className="flex-1">
            <Button className="w-full" variant={"secondary"}>
              <FileJsonIcon />
              View GeoJSON
            </Button>
          </Link>
          <Link
            href={`https://gainforest.app/geo/view?source-value=${locationUri}`}
            target="_blank"
          >
            <Button variant={"secondary"}>
              <ArrowUpRightFromSquare />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SiteBoundaries;

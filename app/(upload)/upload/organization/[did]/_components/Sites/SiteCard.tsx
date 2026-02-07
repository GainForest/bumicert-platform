"use client";
import React from "react";
import { getStripedBackground } from "@/lib/getStripedBackground";
import {
  ArrowUpRight,
  BadgeCheck,
  Crosshair,
  Loader2,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AllSitesData } from "./SitesClient";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/components/ui/modal/context";
import {
  SiteEditorModal,
  SiteEditorModalId,
} from "../../../../../../../components/global/modals/upload/site/editor";
import { getShapefilePreviewUrl } from "../../../../../../../lib/shapefile";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { useAtprotoStore } from "@/components/stores/atproto";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { $Typed } from "gainforest-sdk/lex-api/utils";
import { OrgHypercertsDefs as Defs } from "gainforest-sdk/lex-api";
import { getBlobUrl } from "gainforest-sdk/utilities/atproto";
import { useQuery } from "@tanstack/react-query";
import { computePolygonMetrics } from "gainforest-sdk/utilities/geojson";

export type SiteData = AllSitesData["locations"][number];
type SiteCardProps = {
  siteData: SiteData;
  defaultSite: string | null;
  did: string;
};

const SiteCard = ({ siteData, defaultSite, did }: SiteCardProps) => {
  const site = siteData.value;
  const shapefile = site.location as $Typed<Defs.SmallBlob | Defs.Uri>;
  const shapefileUrl =
    shapefile.$type === "org.hypercerts.defs#uri"
      ? shapefile.uri
      : getBlobUrl(did, shapefile.blob, allowedPDSDomains[0]);
  const isDefaultSite = siteData.uri === defaultSite;
  const shapefilePreviewUrl = getShapefilePreviewUrl(shapefileUrl);

  const auth = useAtprotoStore((state) => state.auth);
  const shouldEdit = auth.status === "AUTHENTICATED" && auth.user.did === did;
  const { pushModal, show } = useModal();
  const utils = trpcApi.useUtils();

  const { data: locationData, isPending: isLoadingLocation } = useQuery({
    queryKey: ["location", shapefileUrl],
    queryFn: async () => {
      if (!shapefileUrl) throw new Error("Shapefile URL is required");
      const response = await fetch(shapefileUrl);
      const data = await response.json();
      return data as GeoJSON.FeatureCollection;
    },
    enabled: !!shapefileUrl,
  });
  const metrics = locationData ? computePolygonMetrics(locationData) : null;
  const simplifiedMetrics = metrics
    ? metrics.areaHectares && metrics.centroid
      ? {
          area: metrics.areaHectares,
          lat: metrics.centroid.lat,
          lon: metrics.centroid.lon,
        }
      : "Invalid"
    : null;

  const { mutate: setDefaultSite, isPending: isSettingDefaultSite } =
    trpcApi.hypercerts.location.setDefault.useMutation({
      onSuccess: () => {
        utils.hypercerts.location.getAll.invalidate({
          did,
          pdsDomain: allowedPDSDomains[0],
        });
      },
    });

  const { mutate: deleteSite, isPending: isDeletingSite } =
    trpcApi.hypercerts.location.delete.useMutation({
      onSuccess: () => {
        utils.hypercerts.location.getAll.invalidate({
          did,
          pdsDomain: allowedPDSDomains[0],
        });
      },
    });

  const disableActions = isSettingDefaultSite || isDeletingSite;
  const formatCoordinate = (coordinate: string) => {
    const num = parseFloat(coordinate);
    if (isNaN(num)) return coordinate;
    return num.toFixed(2);
  };

  const handleEdit = () => {
    pushModal(
      {
        id: SiteEditorModalId,
        content: <SiteEditorModal initialData={siteData} />,
      },
      true
    );
    show();
  };
  return (
    <div className="border border-border rounded-xl overflow-hidden shadow-lg">
      <div className="bg-background rounded-xl shadow-sm">
        <div className="flex items-center justify-between p-2">
          {/* <iframe
            src={shapefilePreviewUrl}
            className="w-full h-32 rounded-lg border border-border pointer-events-none"
            /> */}
          <Link
            href={shapefilePreviewUrl}
            target="_blank"
            className={cn(
              "ml-1 flex items-center gap-1 text-primary cursor-pointer font-medium text-xs"
            )}
          >
            Preview <ArrowUpRight className="size-3" />
          </Link>
          {isDefaultSite && (
            <div className="rounded-full px-1 py-0.5 flex items-center gap-1 bg-primary text-primary-foreground">
              <BadgeCheck className="size-4" />{" "}
              <span className="mr-1 text-sm">Default</span>
            </div>
          )}
        </div>

        <hr className="opacity-50" />
        <div className="px-3 py-2">
          <h3 className="font-medium text-lg">{site.name}</h3>
          {simplifiedMetrics ? (
            typeof simplifiedMetrics === "string" ? (
              "Invalid"
            ) : (
              <div className="flex items-center justify-between mt-1">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Crosshair className="size-4" />
                  <span>
                    {formatCoordinate(simplifiedMetrics.lat.toString())}°,{" "}
                    {formatCoordinate(simplifiedMetrics.lon.toString())}°
                  </span>
                </span>

                <p className="text-sm text-muted-foreground">
                  {simplifiedMetrics.area} hectares
                </p>
              </div>
            )
          ) : (
            <Loader2 className="size-4 animate-spin" />
          )}
          <hr className="mt-3 opacity-50" />
          <div className="w-full flex items-center justify-between text-sm text-muted-foreground mt-1">
            <span>0 bumicerts</span>

            <div className="flex items-center">
              {shouldEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} size={"sm"}>
                      {disableActions ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <MoreVertical />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleEdit()}
                      disabled={disableActions}
                    >
                      <Pencil />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={isDefaultSite || disableActions}
                      onClick={() => {
                        console.log("setting default site", siteData.uri);
                        setDefaultSite({
                          did,
                          locationAtUri: siteData.uri,
                          pdsDomain: allowedPDSDomains[0],
                        });
                      }}
                    >
                      <BadgeCheck />
                      {isDefaultSite ? "Already default" : "Make Default"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={isDefaultSite || disableActions}
                      variant="destructive"
                      onClick={() =>
                        deleteSite({
                          did,
                          locationAtUri: siteData.uri,
                          pdsDomain: allowedPDSDomains[0],
                        })
                      }
                    >
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="px-2 py-1 flex items-center justify-center text-xs">
        <Link
          href={shapefilePreviewUrl}
          target="_blank"
          className={cn(
            "flex items-center gap-1 text-primary cursor-pointer font-medium"
          )}
        >
          View GeoJSON <ArrowUpRight className="size-3" />
        </Link>
      </div> */}
    </div>
  );
};

export default SiteCard;

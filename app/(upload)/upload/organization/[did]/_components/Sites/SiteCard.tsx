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
import { SiteEditorModal, SiteEditorModalId } from "./SiteEditorModal";
import { getShapefilePreviewUrl } from "./utils";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { useAtprotoStore } from "@/components/stores/atproto";
import { trpcApi } from "@/components/providers/TrpcProvider";

export type SiteData = AllSitesData["sites"][number];
type SiteCardProps = {
  siteData: SiteData;
  defaultSite: string | null;
  did: string;
};

const SiteCard = ({ siteData, defaultSite, did }: SiteCardProps) => {
  const site = siteData.value;
  const shapefile = site.shapefile;
  const isDefaultSite = siteData.uri === defaultSite;
  const shapefileUri = getShapefilePreviewUrl(shapefile.blob, did);

  const auth = useAtprotoStore((state) => state.auth);
  const shouldEdit = auth.status === "AUTHENTICATED" && auth.user.did === did;
  const { pushModal, show } = useModal();
  const utils = trpcApi.useUtils();

  const { mutate: setDefaultSite, isPending: isSettingDefaultSite } =
    trpcApi.gainforest.organization.site.setDefault.useMutation({
      onSuccess: () => {
        utils.gainforest.organization.site.getAll.invalidate({
          did,
          pdsDomain: allowedPDSDomains[0],
        });
      },
    });

  const { mutate: deleteSite, isPending: isDeletingSite } =
    trpcApi.gainforest.organization.site.delete.useMutation({
      onSuccess: () => {
        utils.gainforest.organization.site.getAll.invalidate({
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
        content: <SiteEditorModal initialData={siteData} did={did} />,
      },
      true
    );
    show();
  };
  return (
    <div
      className="border border-border rounded-xl overflow-hidden shadow-lg"
      style={{
        background: getStripedBackground(
          {
            variable: "--muted",
          },
          {
            variable: "--foreground",
            opacity: 10,
          },
          2
        ),
      }}
    >
      <div className="bg-background rounded-xl shadow-sm">
        <div className="p-2 relative">
          <iframe
            src={shapefileUri}
            className="w-full h-32 rounded-lg border border-border pointer-events-none"
          />
          {isDefaultSite && (
            <div className="absolute top-4 right-4 rounded-md px-2 py-1 flex items-center gap-1 bg-background text-primary">
              <BadgeCheck className="size-5" />{" "}
              <span className="mr-1">Default</span>
            </div>
          )}
        </div>

        <div className="px-3 py-2 pt-1">
          <h3 className="font-medium text-lg">{site.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Crosshair className="size-4" />
              <span>
                {formatCoordinate(site.lat)}°, {formatCoordinate(site.lon)}°
              </span>
            </span>

            <p className="text-sm text-muted-foreground">
              {site.area} hectares
            </p>
          </div>
          <hr className="mt-3 opacity-50" />
          <div className="w-full flex items-center justify-between text-sm text-muted-foreground mt-1">
            <span>No ecocerts use this site.</span>

            {shouldEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"}>
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
                        siteAtUri: siteData.uri,
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
                        siteAtUri: siteData.uri,
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
      <div className="px-2 py-1 flex items-center justify-center text-xs">
        <Link
          href={shapefileUri}
          target="_blank"
          className={cn(
            "flex items-center gap-1 text-primary cursor-pointer font-medium"
          )}
        >
          View GeoJSON <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </div>
  );
};

export default SiteCard;

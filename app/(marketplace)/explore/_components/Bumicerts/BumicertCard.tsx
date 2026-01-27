"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Ecocert as Bumicert } from "climateai-sdk/types";
import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { OrgHypercertsDefs as Defs } from "climateai-sdk/lex-api";
import { $Typed } from "climateai-sdk/lex-api/utils";
import { parseAtUri } from "climateai-sdk/utilities/atproto";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { links } from "@/lib/links";
import { format } from "date-fns";
import { Calendar, ArrowRight } from "lucide-react";

// Helper to check if a bumicert has a valid image
export const hasValidImage = (bumicert: Bumicert): boolean => {
  const image = bumicert.claimActivity.value.image;
  if (image?.$type === "org.hypercerts.defs#smallImage") return true;
  if (image?.$type === "org.hypercerts.defs#uri") return true;
  return false;
};

// Helper to get image URL
const getImageUrl = (bumicert: Bumicert): string | null => {
  const image = bumicert.claimActivity.value.image;
  if (image?.$type === "org.hypercerts.defs#smallImage") {
    return getBlobUrl(
      bumicert.repo.did,
      (image as $Typed<Defs.SmallImage>).image,
      allowedPDSDomains[0]
    );
  } else if (image?.$type === "org.hypercerts.defs#uri") {
    return (image as $Typed<Defs.Uri>).uri;
  }
  return null;
};

const BumicertCard = ({ bumicert }: { bumicert: Bumicert }) => {
  const imageUrl = getImageUrl(bumicert);
  if (!imageUrl) return null;

  const claimRkey = parseAtUri(bumicert.claimActivity.uri).rkey;
  const title = bumicert.claimActivity.value.title;
  const shortDescription = bumicert.claimActivity.value.shortDescription;
  const startDate = new Date(bumicert.claimActivity.value.startDate);
  const endDate = new Date(bumicert.claimActivity.value.endDate);
  const workScope = bumicert.claimActivity.value.workScope?.withinAnyOf ?? [];
  const orgName = bumicert.organizationInfo.name;
  const orgLogoUrl = bumicert.organizationInfo.logoUrl;

  return (
    <Link
      href={links.bumicert.view(`${bumicert.repo.did}-${claimRkey}`)}
      className="group block h-full"
    >
      <div className="h-full rounded-xl overflow-hidden border border-border/40 bg-background hover:border-border/80 hover:shadow-lg transition-all duration-300 flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Organization badge */}
          {orgLogoUrl && (
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
              <div className="w-5 h-5 rounded-full overflow-hidden">
                <Image
                  src={orgLogoUrl}
                  alt={orgName || "Organization"}
                  width={20}
                  height={20}
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-medium text-gray-800 max-w-[100px] truncate">
                {orgName}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem]">
            {title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {shortDescription || ""}
          </p>

          {/* Spacer to push bottom content down */}
          <div className="flex-1" />

          {/* Date range */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <Calendar className="size-3.5" strokeWidth={1.5} />
            <span>{format(startDate, "MMM yyyy")}</span>
            <ArrowRight className="size-3" strokeWidth={1.5} />
            <span>{format(endDate, "MMM yyyy")}</span>
          </div>

          {/* Work scope tags */}
          <div className="mt-3 flex flex-wrap gap-1.5 min-h-[1.5rem]">
            {workScope.slice(0, 2).map((scope) => (
              <span
                key={scope}
                className="px-2 py-0.5 text-xs bg-foreground/5 text-muted-foreground rounded-md"
              >
                {scope}
              </span>
            ))}
            {workScope.length > 2 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground/50">
                +{workScope.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BumicertCard;

export const BumicertCardSkeleton = () => {
  return (
    <div className="h-full rounded-xl overflow-hidden border border-border/40 bg-background flex flex-col">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="p-4 flex flex-col flex-1">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex-1" />
        <Skeleton className="h-3 w-32 mt-3" />
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
};

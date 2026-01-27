"use client";

import { Calendar, ArrowRight, MapPin, ExternalLink } from "lucide-react";
import React from "react";
import TimeText from "@/components/time-text";
import {
  AppGainforestOrganizationInfo,
  OrgHypercertsClaimActivity,
} from "climateai-sdk/lex-api";
import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { $Typed } from "climateai-sdk/lex-api/utils";
import { AppGainforestCommonDefs as Defs } from "climateai-sdk/lex-api";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import {
  deserialize,
  SerializedSuperjson,
} from "climateai-sdk/utilities/transform";
import Image from "next/image";
import Link from "next/link";
import { links } from "@/lib/links";

const Hero = ({
  creatorDid,
  serializedBumicert,
  serializedOrganizationInfo,
}: {
  creatorDid: string;
  serializedBumicert: SerializedSuperjson<OrgHypercertsClaimActivity.Record>;
  serializedOrganizationInfo: SerializedSuperjson<AppGainforestOrganizationInfo.Record>;
}) => {
  const organizationInfo = deserialize(serializedOrganizationInfo);
  const bumicert = deserialize(serializedBumicert);

  const coverImageUrl =
    bumicert.image === undefined
      ? null
      : getBlobUrl(
          creatorDid,
          bumicert.image as $Typed<Defs.SmallImage>,
          allowedPDSDomains[0]
        );

  const orgLogoUrl = organizationInfo.logo
    ? getBlobUrl(creatorDid, organizationInfo.logo.image, allowedPDSDomains[0])
    : null;

  if (coverImageUrl === null) {
    throw new Error("This Bumicert is not supported.");
  }

  return (
    <div className="pt-6">
      {/* Main hero layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cover Image */}
        <div className="lg:w-1/2 xl:w-2/5">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-lg">
            <Image
              src={coverImageUrl}
              alt={bumicert.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-1/2 xl:w-3/5 flex flex-col justify-center">
          {/* Organization link */}
          <Link
            href={links.myOrganization(creatorDid)}
            className="inline-flex items-center gap-2 mb-4 group w-fit"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted border border-border/50">
              {orgLogoUrl ? (
                <Image
                  src={orgLogoUrl}
                  alt={organizationInfo.displayName}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {organizationInfo.displayName?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {organizationInfo.displayName || "Unknown Organization"}
            </span>
            <ExternalLink className="size-3 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
          </Link>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight">
            {bumicert.title}
          </h1>

          {/* Short description */}
          {bumicert.shortDescription && (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {bumicert.shortDescription}
            </p>
          )}

          {/* Metadata */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {/* Date range */}
            <div className="flex items-center gap-2">
              <Calendar className="size-4" strokeWidth={1.5} />
              <span>
                <TimeText format="absolute-date" date={new Date(bumicert.startDate)} />
              </span>
              <ArrowRight className="size-3" strokeWidth={1.5} />
              <span>
                <TimeText format="absolute-date" date={new Date(bumicert.endDate)} />
              </span>
            </div>

            {/* Location count */}
            {bumicert.locations && bumicert.locations.length > 0 && (
              <div className="flex items-center gap-2">
                <MapPin className="size-4" strokeWidth={1.5} />
                <span>
                  {bumicert.locations.length} site{bumicert.locations.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {/* Work scope tags */}
          {bumicert.workScope?.withinAnyOf && bumicert.workScope.withinAnyOf.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {bumicert.workScope.withinAnyOf.map((work, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm bg-foreground/5 text-foreground/70 rounded-full border border-border/30"
                >
                  {work}
                </span>
              ))}
            </div>
          )}

          {/* Created time */}
          <p className="mt-6 text-xs text-muted-foreground/60">
            Published <TimeText date={new Date(bumicert.createdAt)} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;

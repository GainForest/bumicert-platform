"use client";
import TimeText from "@/components/time-text";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { getWorkScopeItems } from "@/lib/bumicert";
import {
  AppGainforestOrganizationInfo,
  OrgHypercertsDefs as Defs,
  OrgHypercertsClaimActivity,
} from "gainforest-sdk/lex-api";
import { $Typed } from "gainforest-sdk/lex-api/utils";
import { getBlobUrl } from "gainforest-sdk/utilities/atproto";
import {
  deserialize,
  SerializedSuperjson,
} from "gainforest-sdk/utilities/transform";
import { ArrowRight, Calendar, ExternalLink, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

  if (coverImageUrl === null) {
    throw new Error("This Bumicert is not supported.");
  }

  const orgLogoUrl = organizationInfo.logo
    ? getBlobUrl(creatorDid, organizationInfo.logo.image, allowedPDSDomains[0])
    : null;

  const workScopeItems = getWorkScopeItems(bumicert.workScope);
  const locationCount = bumicert.locations?.length ?? 0;

  return (
    <div className="pt-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Cover image */}
        <div className="lg:w-1/2 xl:w-2/5">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-lg relative">
            <Image
              src={coverImageUrl}
              alt={bumicert.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:w-1/2 xl:w-3/5 flex flex-col justify-center">
          {/* Organization link */}
          <Link
            href={`/organization/${creatorDid}`}
            className="inline-flex items-center gap-2 mb-4 group w-fit"
          >
            {orgLogoUrl ? (
              <div className="h-8 w-8 rounded-lg overflow-hidden relative shrink-0">
                <Image
                  src={orgLogoUrl}
                  alt={organizationInfo.displayName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-sm font-medium text-muted-foreground">
                {organizationInfo.displayName.charAt(0)}
              </div>
            )}
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {organizationInfo.displayName}
            </span>
            <ExternalLink className="size-3 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
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

          {/* Metadata row */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {/* Date range */}
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4 shrink-0" />
              {bumicert.startDate ? (
                <TimeText
                  format="absolute-date"
                  date={new Date(bumicert.startDate)}
                />
              ) : (
                <span>—</span>
              )}
              {bumicert.startDate && bumicert.endDate && (
                <ArrowRight className="size-3 shrink-0" />
              )}
              {bumicert.endDate ? (
                <TimeText
                  format="absolute-date"
                  date={new Date(bumicert.endDate)}
                />
              ) : (
                <span>—</span>
              )}
            </span>

            {/* Location count */}
            {locationCount > 0 && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 shrink-0" />
                {locationCount} site{locationCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Work scope tags */}
          {workScopeItems.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {workScopeItems.map((work: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm bg-foreground/5 text-foreground/70 rounded-full border border-border/30"
                >
                  {work}
                </span>
              ))}
            </div>
          )}

          {/* Published time */}
          <p className="mt-6 text-xs text-muted-foreground/60">
            Published <TimeText date={new Date(bumicert.createdAt)} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;

"use client";

import React from "react";
import { MapPin, Globe, Calendar, ExternalLink } from "lucide-react";
import { countries } from "@/lib/countries";
import type { AppGainforestOrganizationInfo } from "climateai-sdk/lex-api";
import Link from "next/link";

interface ProfileMetaProps {
  data: AppGainforestOrganizationInfo.Record;
}

const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

const formatWebsite = (website: string | undefined) => {
  if (!website) return null;
  return website.replace(/^https?:\/\//, "").replace(/\/$/, "");
};

const ProfileMeta = ({ data }: ProfileMetaProps) => {
  const countryData = data.country ? countries[data.country] : null;
  const formattedDate = formatDate(data.startDate);
  const formattedWebsite = formatWebsite(data.website);

  const hasAnyMeta = countryData || formattedDate || formattedWebsite;

  if (!hasAnyMeta) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 px-6 text-sm text-muted-foreground">
      {countryData && (
        <div className="flex items-center gap-1.5">
          <MapPin className="size-4" strokeWidth={1.5} />
          <span>{countryData.emoji}</span>
          <span>{countryData.name}</span>
        </div>
      )}

      {formattedWebsite && data.website && (
        <Link
          href={data.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <Globe className="size-4" strokeWidth={1.5} />
          <span>{formattedWebsite}</span>
          <ExternalLink className="size-3" strokeWidth={1.5} />
        </Link>
      )}

      {formattedDate && (
        <div className="flex items-center gap-1.5">
          <Calendar className="size-4" strokeWidth={1.5} />
          <span>Since {formattedDate}</span>
        </div>
      )}
    </div>
  );
};

export default ProfileMeta;

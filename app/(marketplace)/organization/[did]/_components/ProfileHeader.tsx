"use client";

import React from "react";
import Image from "next/image";
import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { BadgeCheck } from "lucide-react";
import type { AppGainforestOrganizationInfo } from "climateai-sdk/lex-api";

interface ProfileHeaderProps {
  data: AppGainforestOrganizationInfo.Record;
  did: string;
}

const ProfileHeader = ({ data, did }: ProfileHeaderProps) => {
  const logoUrl = data.logo
    ? getBlobUrl(did, data.logo.image, allowedPDSDomains[0])
    : null;

  return (
    <div className="pt-8">
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-muted border border-border/50">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={data.displayName || "Organization"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-serif font-bold text-muted-foreground/30">
                  {data.displayName?.charAt(0) || "?"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Name and description */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground truncate">
              {data.displayName || "Unnamed Organization"}
            </h1>
            <BadgeCheck className="size-6 text-primary shrink-0" strokeWidth={2} />
          </div>
          {data.shortDescription && (
            <p className="mt-2 text-muted-foreground leading-relaxed line-clamp-3">
              {data.shortDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

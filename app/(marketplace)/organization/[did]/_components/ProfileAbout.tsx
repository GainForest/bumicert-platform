"use client";

import React from "react";
import type { AppGainforestOrganizationInfo } from "climateai-sdk/lex-api";

interface ProfileAboutProps {
  data: AppGainforestOrganizationInfo.Record;
}

const ProfileAbout = ({ data }: ProfileAboutProps) => {
  if (!data.longDescription) return null;

  return (
    <div className="mt-8 px-6">
      <h2 className="text-lg font-semibold text-foreground mb-3">About</h2>
      <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {data.longDescription}
        </p>
      </div>
    </div>
  );
};

export default ProfileAbout;

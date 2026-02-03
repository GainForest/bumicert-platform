"use client";
import { getStripedBackground } from "@/lib/getStripedBackground";
import { BadgeCheck, Calendar, ShieldCheck } from "lucide-react";
import { ArrowRight } from "lucide-react";
import React from "react";
import ProgressView from "./ProgressView";
import TimeText from "@/components/time-text";
import {
  AppGainforestOrganizationInfo,
  OrgHypercertsClaimActivity,
} from "gainforest-sdk/lex-api";
import { getBlobUrl } from "gainforest-sdk/utilities/atproto";
import { BumicertArt } from "@/app/(marketplace)/bumicert/create/[draftId]/_components/Steps/Step4/BumicertPreviewCard";
import { $Typed } from "gainforest-sdk/lex-api/utils";
import { OrgHypercertsDefs as Defs } from "gainforest-sdk/lex-api";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import {
  deserialize,
  SerializedSuperjson,
} from "gainforest-sdk/utilities/transform";
import UserChip from "@/components/user-chip2";
import Image from "next/image";
import { useAdaptiveColors } from "@/hooks/use-adaptive-colors";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

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

  const { background, foreground, backgroundMuted, foregroundMuted } =
    useAdaptiveColors(coverImageUrl);

  if (coverImageUrl === null) {
    throw new Error("This Bumicert is not supported.");
  }

  return (
    <div className="w-full flex flex-col bg-green-500/10 rounded-xl overflow-hidden">
      <div className="w-full flex items-center justify-between py-1.5 px-2 gap-2">
        <div className="flex items-center gap-1">
          <BadgeCheck className="size-3 text-green-700 dark:text-green-600" />
          <span className="text-xs text-green-700 dark:text-green-600">
            Listed on the homepage
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-right text-green-700 dark:text-green-600">
            Backed by 3 proofs of impact
          </span>
          <ShieldCheck className="size-3 text-green-700 dark:text-green-600" />
        </div>
      </div>

      <div className="bg-muted rounded-xl overflow-hidden w-full">
        <div className="bg-background w-full rounded-xl border border-black/15 overflow-hidden">
          <div
            className="w-full grid grid-cols-1 md:grid-cols-[1fr_240px]"
            style={{
              background: getStripedBackground(
                `${background}ff`,
                `${background}fc`,
                12
              ),
              color: foreground,
            }}
          >
            <div className="flex flex-col items-start justify-between w-0 min-w-full gap-4 p-4">
              <div className="flex flex-col items-start">
                <div
                  className="flex items-center gap-2 flex-wrap"
                  style={{
                    color: `${foreground}98`,
                  }}
                >
                  <span className="bg-gray-500/10 rounded-full text-sm px-2 h-7 flex items-center">
                    <TimeText date={new Date(bumicert.createdAt)} />
                  </span>
                  <span className="text-sm">by</span>
                  <UserChip
                    did={creatorDid as `did:plc:${string}`}
                    className="p-0.5 bg-gray-500/10 hover:bg-gray-500/20 text-xs"
                  />
                </div>
                <h1 className="mt-4 text-2xl md:text-3xl font-bold font-serif drop-shadow-md">
                  {bumicert.title.slice(0, 150)}
                  {bumicert.title.length > 150 && "..."}
                </h1>
              </div>
              <div className="w-full">
                <span className="rounded-full px-2 py-0.5 text-sm font-medium shrink-0 inline-flex items-center gap-1">
                  <Calendar className="size-4 mr-1 opacity-50" />
                  <TimeText
                    format="absolute-date"
                    date={new Date(bumicert.startDate!)}
                  />{" "}
                  <ArrowRight className="size-3" />{" "}
                  <TimeText
                    format="absolute-date"
                    date={new Date(bumicert.endDate!)}
                  />
                </span>

                <div className="w-full overflow-x-auto scrollbar-hidden mask-r-from-90% mt-4">
                  <div className="w-full flex items-center justify-start gap-2">
                    {((bumicert.workScope as { withinAnyOf?: string[] } | undefined)?.withinAnyOf ?? []).map(
                      (work: string, index: number) => (
                        <span
                          key={index}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium shrink-0"
                          style={{
                            background: `${backgroundMuted}`,
                            color: `${foreground}96`,
                          }}
                        >
                          {work}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="min-h-72 flex items-center justify-center relative">
              <div className="absolute inset-1 overflow-hidden">
                <Image
                  src={getBlobUrl(
                    creatorDid,
                    bumicert.image as $Typed<Defs.SmallImage>,
                    allowedPDSDomains[0]
                  )}
                  alt="Logo"
                  fill
                  className="object-cover rounded-3xl"
                />
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    boxShadow: `inset 0px 0px 1rem 1rem ${background}`,
                  }}
                ></div>
                {/* <ProgressiveBlur position="bottom" height="2rem" />
                <ProgressiveBlur position="top" height="2rem" />
                <div className="absolute inset-0 rotate-90">
                  <ProgressiveBlur position="bottom" height="2rem" />
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <ProgressView hypercert={bumicert} />
      </div>
    </div>
  );
};

export default Hero;

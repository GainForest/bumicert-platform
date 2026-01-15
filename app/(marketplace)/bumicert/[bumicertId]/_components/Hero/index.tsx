import { FullHypercert } from "@/graphql/hypercerts/queries/fullHypercertById";
import { getStripedBackground } from "@/lib/getStripedBackground";
import { BadgeCheck, Calendar, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import React from "react";
import ProgressView from "./ProgressView";
import TimeText from "@/components/time-text";
import UserChip from "@/components/user-chip";
import {
  AppGainforestOrganizationInfo,
  OrgHypercertsClaimActivity,
} from "climateai-sdk/lex-api";
import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { BumicertArt } from "@/app/(marketplace)/bumicert/create/[draftId]/_components/Steps/Step4/BumicertPreviewCard";
import { $Typed } from "climateai-sdk/lex-api/utils";
import { AppGainforestCommonDefs as Defs } from "climateai-sdk/lex-api";
import { allowedPDSDomains } from "@/config/climateai-sdk";

const Hero = ({
  creatorDid,
  bumicert,
  organizationInfo,
}: {
  creatorDid: string;
  bumicert: OrgHypercertsClaimActivity.Record;
  organizationInfo: AppGainforestOrganizationInfo.Record;
}) => {
  if (bumicert.image === undefined) {
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
            className="w-full grid grid-cols-1 md:grid-cols-[1fr_240px] gap-3 p-4"
            style={{
              background: getStripedBackground(
                {
                  variable: "--primary",
                  opacity: 0,
                },
                {
                  variable: "--primary",
                  opacity: 10,
                },
                12
              ),
            }}
          >
            <div className="flex flex-col items-start justify-between w-0 min-w-full gap-4">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-background/0 backdrop-blur-sm border border-primary/20 rounded-full text-sm px-2 h-[1.75rem] flex items-center">
                    <TimeText
                      date={
                        new Date(Number(bumicert.creationBlockTimestamp) * 1000)
                      }
                    />
                  </span>
                  <span className="text-sm">by</span>
                  {/* <UserChip
                    address={ecocert.creatorAddress as `0x${string}`}
                    className="p-0.5 bg-background/0 backdrop-blur-sm border border-primary/20 text-xs"
                  /> */}
                </div>
                <h1 className="mt-4 text-2xl md:text-3xl font-bold font-serif text-primary drop-shadow-md">
                  {bumicert.title.slice(0, 150)}
                  {bumicert.title.length > 150 && "..."}
                </h1>
              </div>
              <div className="w-full">
                <span className="bg-background/90 border border-primary/50 backdrop-blur-sm rounded-full px-2 py-0.5 text-sm text-primary font-medium shrink-0 inline-flex items-center gap-1 mb-2">
                  <Calendar className="size-3 mr-1" />
                  <TimeText
                    format="absolute-date"
                    date={new Date(bumicert.startDate)}
                  />{" "}
                  <ArrowRight className="size-3" />{" "}
                  <TimeText
                    format="absolute-date"
                    date={new Date(bumicert.endDate)}
                  />
                </span>

                <div className="w-full overflow-x-auto scrollbar-hidden mask-r-from-90%">
                  <div className="w-full flex items-center justify-start gap-2">
                    {(bumicert.workScope?.withinAnyOf ?? []).map(
                      (work, index) => (
                        <span
                          key={index}
                          className="bg-background/90 border border-primary/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-sm text-primary font-medium shrink-0"
                        >
                          {work}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="min-h-[240px] flex items-center justify-center mask-none md:mask-b-from-90% relative">
              <BumicertArt
                logoUrl={
                  organizationInfo.logo
                    ? getBlobUrl(
                        creatorDid,
                        organizationInfo.logo.image,
                        allowedPDSDomains[0]
                      )
                    : null
                }
                coverImage={getBlobUrl(
                  creatorDid,
                  bumicert.image as $Typed<Defs.SmallImage>,
                  allowedPDSDomains[0]
                )}
                title={bumicert.title}
                objectives={bumicert.workScope?.withinAnyOf ?? []}
                startDate={new Date(bumicert.startDate as string)}
                endDate={new Date(bumicert.endDate as string)}
              />
            </div>
          </div>
        </div>
        <ProgressView hypercert={bumicert} />
      </div>
    </div>
  );
};

export default Hero;

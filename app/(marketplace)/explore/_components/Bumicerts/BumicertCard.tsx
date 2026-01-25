import React from "react";
import { Clock, ShoppingCart } from "lucide-react";
import Image from "next/image";
import CircularProgressBar from "@/components/circular-progressbar";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Ecocert as Bumicert } from "climateai-sdk/types";
import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { OrgHypercertsDefs as Defs } from "climateai-sdk/lex-api";
import { $Typed } from "climateai-sdk/lex-api/utils";
import { BumicertArt } from "@/app/(marketplace)/bumicert/create/[draftId]/_components/Steps/Step4/BumicertPreviewCard";
import { parseAtUri } from "climateai-sdk/utilities/atproto";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { links } from "@/lib/links";
import { getWorkScopeDisplayLabels } from "@/lib/types/activity-claim";

const StripedDiv = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="h-40 rounded-t-lg rounded-b-xl border-b border-b-border shadow-inner p-3 group-hover:p-2 pb-0 group-hover:pb-0 overflow-hidden transition-all duration-300"
      style={{
        background: `repeating-linear-gradient(
          -55deg,
          color-mix(in oklab, var(--muted) 30%, transparent),
          color-mix(in oklab, var(--muted) 30%, transparent) 4px,
          color-mix(in oklab, var(--muted) 100%, transparent) 4px,
          color-mix(in oklab, var(--muted) 100%, transparent) 8px
        )`,
      }}
    >
      {children}
    </div>
  );
};

const BumicertCard = ({ bumicert }: { bumicert: Bumicert }) => {
  const image = bumicert.claimActivity.value.image;
  let imageUrl: string | null = null;
  if (image?.$type === "org.hypercerts.defs#smallImage") {
    imageUrl = getBlobUrl(
      bumicert.repo.did,
      (image as $Typed<Defs.SmallImage>).image,
      allowedPDSDomains[0]
    );
  } else if (image?.$type === "org.hypercerts.defs#uri") {
    imageUrl = (image as $Typed<Defs.Uri>).uri;
  }
  if (!imageUrl) return null;

  const claimRkey = parseAtUri(bumicert.claimActivity.uri).rkey;

  // Get work scope labels using the new helper (handles new schema format)
  const workScopeLabels = getWorkScopeDisplayLabels(bumicert.claimActivity.value.workScope);

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.75 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 0.75 }}
    >
      <Link
        href={links.bumicert.view(`${bumicert.repo.did}-${claimRkey}`)}
        className="flex flex-col w-full"
      >
        <BumicertArt
          logoUrl={bumicert.organizationInfo.logoUrl}
          coverImage={imageUrl}
          title={bumicert.claimActivity.value.title}
          objectives={workScopeLabels}
          startDate={bumicert.claimActivity.value.startDate ? new Date(bumicert.claimActivity.value.startDate) : new Date()}
          endDate={bumicert.claimActivity.value.endDate ? new Date(bumicert.claimActivity.value.endDate) : new Date()}
        />
      </Link>
    </motion.div>
  );
};

export default BumicertCard;

export const BumicertCardSkeleton = () => {
  return (
    <motion.div
      className="bg-background rounded-lg shadow-lg w-[280px] flex flex-col"
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.75 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 0.75 }}
    >
      <StripedDiv>{null}</StripedDiv>
      <div className="p-3 flex flex-col justify-between gap-3 flex-1">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="w-full p-2">
        <Skeleton className="h-16 w-full" />
      </div>
    </motion.div>
  );
};

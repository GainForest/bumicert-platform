import React from "react";
import { Clock, ShoppingCart } from "lucide-react";
import Image from "next/image";
import CircularProgressBar from "@/components/circular-progressbar";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Ecocert } from "climateai-sdk/types";
import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { OrgHypercertsDefs as Defs } from "climateai-sdk/lex-api";
import { $Typed } from "climateai-sdk/lex-api/utils";
import { EcocertArt } from "@/app/(marketplace)/ecocert/new/_components/Steps/Step4/EcocertPreviewCard";
import { parseAtUri } from "climateai-sdk/utilities/atproto";
import { allowedPDSDomains } from "@/config/climateai-sdk";

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

const EcocertCard = ({ ecocert }: { ecocert: Ecocert }) => {
  const image = ecocert.claimActivity.value.image;
  let imageUrl: string | null = null;
  if (image?.$type === "org.hypercerts.defs#smallImage") {
    imageUrl = getBlobUrl(
      ecocert.repo.did,
      (image as $Typed<Defs.SmallImage>).image,
      allowedPDSDomains[0]
    );
  } else if (image?.$type === "org.hypercerts.defs#uri") {
    imageUrl = (image as $Typed<Defs.Uri>).uri;
  }
  if (!imageUrl) return null;

  const claimRkey = parseAtUri(ecocert.claimActivity.uri).rkey;

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.75 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 0.75 }}
    >
      <Link
        href={`/ecocert/${ecocert.repo.did}-${claimRkey}`}
        className="flex flex-col w-full"
      >
        <EcocertArt
          logoUrl={ecocert.organizationInfo.logoUrl}
          coverImage={imageUrl}
          title={ecocert.claimActivity.value.title}
          objectives={ecocert.claimActivity.value.workScope?.anyOf ?? []}
          startDate={new Date(ecocert.claimActivity.value.startDate)}
          endDate={new Date(ecocert.claimActivity.value.endDate)}
        />
      </Link>
    </motion.div>
  );
};

export default EcocertCard;

export const EcocertCardSkeleton = () => {
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

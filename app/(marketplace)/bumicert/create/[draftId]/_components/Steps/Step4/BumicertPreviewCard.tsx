"use client";
import React from "react";
import { useFormStore } from "../../../form-store";
import Image from "next/image";
import { useAtprotoStore } from "@/components/stores/atproto";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { Loader2, UploadIcon } from "lucide-react";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { useModal } from "@/components/ui/modal/context";
import { UploadLogoModal, UploadLogoModalId } from "./UploadLogoModal";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const BumicertArt = ({
  logoUrl,
  coverImage,
  title,
  objectives,
  startDate,
  endDate,
  className,
}: {
  logoUrl: string | null;
  coverImage: File | string;
  title: string;
  objectives: string[];
  startDate: Date;
  endDate: Date;
  className?: string;
  performant?: boolean;
}) => {
  return (
    <div
      className={cn(
        "group rounded-xl overflow-hidden border border-border/50",
        className
      )}
    >
      <div className="w-[220px] h-[300px] relative overflow-hidden">
        <Image
          src={
            typeof coverImage === "string"
              ? coverImage
              : URL.createObjectURL(coverImage)
          }
          alt="Bumicert"
          fill
          className="object-cover"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Logo */}
        {logoUrl && (
          <div className="absolute top-3 left-3 h-7 w-7 rounded-full bg-white/90 border border-white/20 overflow-hidden">
            <Image src={logoUrl} alt="Logo" fill className="object-cover" />
          </div>
        )}
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col">
          <span className="font-serif font-medium text-white text-lg leading-tight">
            {title}
          </span>
          <span className="text-[11px] text-white/70 mt-1">
            {format(startDate, "MMM yyyy")} - {format(endDate, "MMM yyyy")}
          </span>
          {objectives.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap mt-2">
              {objectives.slice(0, 2).map((objective) => (
                <span
                  key={objective}
                  className="text-[10px] bg-white/20 text-white backdrop-blur-sm rounded px-1.5 py-0.5"
                >
                  {objective}
                </span>
              ))}
              {objectives.length > 2 && (
                <span className="text-[10px] text-white/60">
                  +{objectives.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BumicertPreviewCard = () => {
  const step1FormValues = useFormStore((state) => state.formValues[0]);
  const {
    coverImage,
    projectName: title,
    workType: objectives,
    projectDateRange: [startDate, endDate],
  } = step1FormValues;
  const auth = useAtprotoStore((state) => state.auth);
  const { show, pushModal } = useModal();
  const {
    data: organizationInfoResponse,
    isPending: isPendingOrganizationInfo,
    isPlaceholderData: isOlderData,
  } = trpcApi.gainforest.organization.info.get.useQuery(
    {
      did: auth.user?.did ?? "",
      pdsDomain: allowedPDSDomains[0],
    },
    {
      enabled: !!auth.user?.did,
    }
  );
  const organizationInfo = organizationInfoResponse?.value;
  const logoFromData = isOlderData ? undefined : organizationInfo?.logo;
  const logoUrl = logoFromData
    ? getBlobUrl(auth.user?.did ?? "", logoFromData.image, allowedPDSDomains[0])
    : null;

  const isLoadingOrganizationInfo = isPendingOrganizationInfo || isOlderData;

  const isBumicertArtReady =
    coverImage && title && objectives && startDate && endDate;

  return (
    <div className="flex flex-col gap-3">
      {/* Logo warning */}
      {!logoFromData && (
        <button
          type="button"
          onClick={() => {
            pushModal(
              {
                id: UploadLogoModalId,
                content: <UploadLogoModal />,
              },
              true
            );
            show();
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 transition-colors text-left"
        >
          <UploadIcon className="size-4 shrink-0" strokeWidth={1.5} />
          <span className="text-xs">Add organization logo</span>
        </button>
      )}

      {/* Preview */}
      <div className="flex items-center justify-center">
        {isBumicertArtReady ? (
          <BumicertArt
            logoUrl={logoUrl}
            coverImage={coverImage}
            title={title}
            objectives={objectives}
            startDate={startDate}
            endDate={endDate}
          />
        ) : isLoadingOrganizationInfo ? (
          <div className="py-12 flex flex-col items-center gap-2">
            <Loader2 className="size-5 animate-spin text-foreground/30" strokeWidth={1.5} />
            <span className="text-xs text-foreground/40">Loading...</span>
          </div>
        ) : (
          <div className="py-12 text-center">
            <span className="text-sm text-foreground/40">
              Complete step 1 to preview
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BumicertPreviewCard;

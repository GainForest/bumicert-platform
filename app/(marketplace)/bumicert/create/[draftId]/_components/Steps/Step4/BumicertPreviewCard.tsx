"use client";
import React, { useRef, useState } from "react";
import { useFormStore } from "../../../form-store";
import Image from "next/image";
import { useAtprotoStore } from "@/components/stores/atproto";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { Loader2, Upload } from "lucide-react";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { useModal } from "@/components/ui/modal/context";
import { UploadLogoModal, UploadLogoModalId } from "./UploadLogoModal";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const DEFAULT_COVER_IMAGE = "/default.webp";

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
  coverImage: File | string | null;
  title: string;
  objectives: string[];
  startDate: Date;
  endDate: Date;
  className?: string;
  performant?: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.15s ease-out" }}
      className={cn(
        "w-[220px] rounded-lg overflow-hidden border border-border/30 shadow-sm cursor-pointer",
        className
      )}
    >
      <div className="w-full aspect-[3/4] relative overflow-hidden">
        <Image
          src={
            !coverImage || (coverImage instanceof File && coverImage.size === 0)
              ? DEFAULT_COVER_IMAGE
              : typeof coverImage === "string"
                ? coverImage
                : URL.createObjectURL(coverImage)
          }
          alt="Bumicert"
          fill
          className="object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Logo */}
        {logoUrl && (
          <div className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/90 border border-white/30 overflow-hidden shadow-sm">
            <Image src={logoUrl} alt="Logo" fill className="object-cover" />
          </div>
        )}
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col">
          <span className="font-serif font-medium text-white text-lg leading-tight">
            {title}
          </span>
          <span className="text-xs text-white/60 mt-1">
            {format(startDate, "MMM yyyy")} — {format(endDate, "MMM yyyy")}
          </span>
          {objectives.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              {objectives.slice(0, 2).map((objective) => (
                <span
                  key={objective}
                  className="text-[10px] bg-white/15 text-white/90 backdrop-blur-sm rounded-full px-2 py-0.5"
                >
                  {objective}
                </span>
              ))}
              {objectives.length > 2 && (
                <span className="text-[10px] text-white/50">
                  +{objectives.length - 2} more
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

  // Cover image is optional (will use default), but title/dates/objectives are required
  const isBumicertArtReady =
    title && objectives && startDate && endDate;

  return (
    <div className="flex flex-col gap-3">
      {/* Logo prompt */}
      {!logoFromData && !isLoadingOrganizationInfo && (
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
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border/50 text-muted-foreground hover:border-border hover:text-foreground transition-colors text-left group"
        >
          <Upload className="size-3.5 shrink-0" strokeWidth={1.5} />
          <span className="text-xs">Add organization logo</span>
        </button>
      )}

      {/* Preview */}
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
        <div className="aspect-[3/4] rounded-lg border border-dashed border-border/30 flex flex-col items-center justify-center">
          <Loader2 className="size-5 animate-spin text-foreground/20" strokeWidth={1.5} />
          <span className="text-xs text-foreground/40 mt-2">Loading...</span>
        </div>
      ) : (
        <div className="aspect-[3/4] rounded-lg border border-dashed border-border/30 flex flex-col items-center justify-center px-4">
          <span className="text-xs text-foreground/40 text-center">
            Complete the basics to see your bumicert preview
          </span>
        </div>
      )}
    </div>
  );
};

export default BumicertPreviewCard;

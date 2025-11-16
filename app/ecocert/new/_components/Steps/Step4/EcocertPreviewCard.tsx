"use client";
import React, { useEffect, useRef } from "react";
import { useStep1Store } from "../Step1/store";
import Image from "next/image";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { domToJpeg } from "modern-screenshot";
import { useStep4Store } from "./store";
import { useAtprotoStore } from "@/components/stores/atproto";
import { trpcClient } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import getBlobUrl from "@/lib/atproto/getBlobUrl";
import { Loader2, UploadIcon } from "lucide-react";
import { useModal } from "@/components/ui/modal/context";
import { UploadLogoModal, UploadLogoModalId } from "./UploadLogoModal";
import { format } from "date-fns";

export const EcocertArt = ({
  logoUrl,
  coverImage,
  title,
  objectives,
  startDate,
  endDate,
}: {
  logoUrl: string | null;
  coverImage: File | string;
  title: string;
  objectives: string[];
  startDate: Date;
  endDate: Date;
}) => {
  return (
    <div className="p-2 rounded-3xl shadow-2xl bg-white border border-black/10">
      <div className="w-[256px] h-[360px] relative overflow-hidden rounded-2xl">
        <Image
          src={
            typeof coverImage === "string" ? coverImage : (
              URL.createObjectURL(coverImage)
            )
          }
          alt="Ecocert"
          fill
          className="rounded-2xl"
        />
        <ProgressiveBlur
          position="bottom"
          height="35%"
          className="z-0"
          borderRadiusClassName="rounded-2xl"
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-b from-transparent to-white/50"></div>
        <div className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white border-2 border-black/10 shadow-lg">
          {logoUrl && (
            <Image src={logoUrl} alt="Logo" fill className="rounded-full" />
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex flex-col">
          <span className="text-xs border border-white/15 bg-black/15 text-white backdrop-blur-lg rounded-full px-2 py-1 w-fit">
            {format(startDate, "LLL dd, y")} → {format(endDate, "LLL dd, y")}
          </span>
          <span className="font-serif text-white text-shadow-lg text-3xl mt-2">
            {title}
          </span>
          <div className="flex items-center gap-1 flex-wrap mt-2">
            {objectives.map((objective) => (
              <span
                key={objective}
                className="text-xs bg-white/40 text-black backdrop-blur-lg rounded-md px-3 py-1.5 w-fit font-medium text-shadow-lg shadow-lg"
              >
                {objective}
              </span>
            ))}
            <span className="text-xs bg-black/40 text-white backdrop-blur-lg rounded-md px-2 py-1.5 w-fit font-medium text-shadow-lg shadow-lg">
              +3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EcocertPreviewCard = () => {
  const step1FormValues = useStep1Store((state) => state.formValues);
  const {
    coverImage,
    projectName: title,
    workType: objectives,
    projectDateRange: [startDate, endDate],
  } = step1FormValues;
  const auth = useAtprotoStore((state) => state.auth);
  const { show, pushModal } = useModal();
  const {
    data: organizationInfo,
    isPending: isPendingOrganizationInfo,
    isPlaceholderData: isOlderData,
  } = useQuery({
    queryKey: ["organizationInfo", auth.user?.did],
    queryFn: async () => {
      const response = await trpcClient.organizationInfo.get.query({
        did: auth.user?.did ?? "",
      });
      return response.value;
    },
    enabled: !!auth.user?.did,
  });
  const logoFromData = isOlderData ? undefined : organizationInfo?.logo;
  const logoUrl =
    logoFromData ? getBlobUrl(auth.user?.did ?? "", logoFromData.image) : null;

  const isLoadingOrganizationInfo = isPendingOrganizationInfo || isOlderData;

  const isEcocertArtReady =
    coverImage && title && objectives && startDate && endDate;

  return (
    <div className="rounded-xl border border-primary/10 shadow-lg overflow-hidden bg-primary/10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center text-center text-primary px-2 py-1">
        <span className="font-medium">Preview your ecocert</span>
      </div>

      <div className="bg-background p-2 rounded-xl flex-1 flex flex-col gap-2 items-center justify-center">
        {!logoFromData && (
          <div className="w-full flex items-start gap-2 border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-lg p-2 relative">
            <button
              type="button"
              className="absolute h-6 w-6 -top-1 -right-1 bg-amber-500 text-white rounded-full flex items-center justify-center cursor-pointer"
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
            >
              <UploadIcon className="size-4" />
            </button>
            <span className="text-sm text-pretty mr-3">
              Your organization doesn&apos;t have a logo. Do you want to add
              one?
            </span>
          </div>
        )}

        {isEcocertArtReady ?
          <EcocertArt
            logoUrl={logoUrl}
            coverImage={coverImage}
            title={title}
            objectives={objectives}
            startDate={startDate}
            endDate={endDate}
          />
        : isLoadingOrganizationInfo ?
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin" />
            <span className="text-sm text-muted-foreground text-center text-pretty">
              Generating the preview...
            </span>
          </div>
        : <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-sm text-muted-foreground text-center text-pretty">
              You need to complete the first step to preview the ecocert.
            </span>
          </div>
        }
      </div>
    </div>
  );
};

export default EcocertPreviewCard;

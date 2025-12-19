"use client";
import { AppGainforestOrganizationDraftEcocert } from "climateai-sdk/lex-api";
import React, { useEffect, useState } from "react";
import {
  Step1FormValues,
  Step2FormValues,
  Step3FormValues,
  useFormStore,
} from "../form-store";
import { useQuery } from "@tanstack/react-query";
import useBlob from "@/hooks/use-blob";
import { GetRecordResponse } from "climateai-sdk/types";
import { parseAtUri } from "climateai-sdk/utilities/atproto";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { useModal } from "@/components/ui/modal/context";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { Button } from "@/components/ui/button";

const CreateEcocertHydrationErrorModalId = "create-ecocert-hydration-error";
const CreateEcocertHydrationErrorModalContent = () => {
  const { stack, popModal, hide } = useModal();
  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>Error</ModalTitle>
        <ModalDescription>
          We were unable to load the data you saved. Please reach out to
          support.
        </ModalDescription>
      </ModalHeader>
      <ModalFooter>
        <Button
          onClick={
            stack.length === 1
              ? () => {
                  hide().then(() => {
                    popModal();
                  });
                }
              : popModal
          }
        >
          {stack.length === 1 ? "Close" : "Back"}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

const StoreHydrator = ({
  draftResponse,
  children,
}: {
  draftResponse:
    | GetRecordResponse<AppGainforestOrganizationDraftEcocert.Main>
    | null
    | undefined;
  children: React.ReactNode;
}) => {
  const uri = draftResponse?.uri;
  const coverImageBlobRef = draftResponse?.value?.coverImage?.image;
  const did = uri ? parseAtUri(uri).did : undefined;

  const coverImageBlob = useBlob({
    blob: coverImageBlobRef,
    did: did,
    pdsDomain: allowedPDSDomains[0],
  });
  const coverImageError = coverImageBlob?.error;
  const coverImageFile = coverImageBlob?.data;

  const isHydrated = useFormStore((state) => state.isHydrated);
  const hydrate = useFormStore((state) => state.hydrate);

  const { show, pushModal } = useModal();

  useEffect(() => {
    if (isHydrated) return;
    if (!draftResponse) {
      hydrate(null);
      return;
    }
    if (coverImageError) {
      pushModal({
        id: CreateEcocertHydrationErrorModalId,
        content: <CreateEcocertHydrationErrorModalContent />,
      });
      show();
      return;
    }
    if (!coverImageFile) {
      return;
    }
    const draftData = draftResponse.value;
    const step1Data: Step1FormValues = {
      projectName: draftData.title,
      coverImage: coverImageFile,
      workType: draftData.workScopes,
      projectDateRange: [
        new Date(draftData.workStartDate),
        new Date(draftData.workEndDate),
      ],
    };
    const step2Data: Step2FormValues = {
      shortDescription: draftData.shortDescription,
      impactStory: draftData.description,
    };
    const step3Data: Step3FormValues = {
      contributors: draftData.contributors,
      siteBoundaries: draftData.site,
      confirmPermissions: false,
      agreeTnc: false,
    };
    const formValues = [step1Data, step2Data, step3Data] satisfies [
      Step1FormValues,
      Step2FormValues,
      Step3FormValues
    ];
    hydrate(formValues);
  }, [isHydrated, draftResponse, coverImageFile, coverImageError]);

  return children;
};

export default StoreHydrator;

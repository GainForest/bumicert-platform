"use client";
import React, { useEffect } from "react";
import {
  Step1FormValues,
  Step2FormValues,
  Step3FormValues,
  useFormStore,
} from "../form-store";
import { useModal } from "@/components/ui/modal/context";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { Button } from "@/components/ui/button";
import { DraftBumicertResponse } from "@/app/api/supabase/drafts/bumicert/type";

const CreateBumicertHydrationErrorModalId = "create-bumicert-hydration-error";
const CreateBumicertHydrationErrorModalContent = () => {
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

const urlToFile = async (url: string): Promise<File | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const blob = await response.blob();
    const urlObj = new URL(url);
    const filename =
      urlObj.pathname.split("/").pop()?.split("?")[0] || "image.png";
    const finalFilename = filename.includes(".") ? filename : `${filename}.png`;

    return new File([blob], finalFilename, { type: blob.type });
  } catch {
    return null;
  }
};

const StoreHydrator = ({
  draftResponse,
  children,
}: {
  draftResponse: DraftBumicertResponse | null | undefined;
  children: React.ReactNode;
}) => {
  const isHydrated = useFormStore((state) => state.isHydrated);
  const hydrate = useFormStore((state) => state.hydrate);

  const { show, pushModal } = useModal();

  useEffect(() => {
    if (isHydrated) return;
    if (!draftResponse) {
      hydrate(null);
      return;
    }

    const hydrateStore = async () => {
      try {
        const draftData = draftResponse.data;

        // Fetch cover image if it exists
        let coverImageFile: File | null = null;
        if (draftData.coverImage) {
          coverImageFile = await urlToFile(draftData.coverImage);
          if (!coverImageFile) {
            // If cover image fails to load, show error
            pushModal({
              id: CreateBumicertHydrationErrorModalId,
              content: <CreateBumicertHydrationErrorModalContent />,
            });
            show();
            hydrate(null);
            return;
          }
        } else {
          // If no cover image, create empty file as required by schema
          coverImageFile = new File([], "cover-image.png");
        }

        // Parse dates with fallback
        const thisYear = new Date().getFullYear();
        const startDate = draftData.startDate
          ? isNaN(new Date(draftData.startDate).getTime())
            ? new Date(`${thisYear}-01-01`)
            : new Date(draftData.startDate)
          : new Date(`${thisYear}-01-01`);
        const endDate = draftData.endDate
          ? isNaN(new Date(draftData.endDate).getTime())
            ? new Date()
            : new Date(draftData.endDate)
          : new Date();

        // Map draft data to form values
        const step1Data: Step1FormValues = {
          projectName: draftData.title || "",
          coverImage: coverImageFile,
          workType: draftData.workScopes || [],
          projectDateRange: [startDate, endDate],
        };

        const step2Data: Step2FormValues = {
          shortDescription: draftData.shortDescription || "",
          description: draftData.description || "",
        };

        const step3Data: Step3FormValues = {
          contributors: draftData.contributors || [],
          siteBoundaries: draftData.siteBoundaries || [],
          confirmPermissions: false,
          agreeTnc: false,
        };

        const formValues = [step1Data, step2Data, step3Data] satisfies [
          Step1FormValues,
          Step2FormValues,
          Step3FormValues
        ];

        hydrate(formValues);
      } catch (error) {
        console.error("Error hydrating store:", error);
        pushModal({
          id: CreateBumicertHydrationErrorModalId,
          content: <CreateBumicertHydrationErrorModalContent />,
        });
        show();
        hydrate(null);
      }
    };

    hydrateStore();
  }, [isHydrated, draftResponse, hydrate, pushModal, show]);

  return <>{children}</>;
};

export default StoreHydrator;

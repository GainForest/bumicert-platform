"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, EyeIcon, Lightbulb } from "lucide-react";
import useNewBumicertStore from "../store";
import { BumicertArt } from "./Steps/Step4/BumicertPreviewCard";
import { useFormStore } from "../form-store";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { useAtprotoStore } from "@/components/stores/atproto";
import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavbarContext } from "@/components/global/Navbar/context";
import { STEPS } from "../_data/steps";

const StepBody = () => {
  const { viewport, openState } = useNavbarContext();
  const { currentStepIndex: currentStep } = useNewBumicertStore();
  const CurrentStepComponent = STEPS[currentStep].Component;
  return (
    <div
      className={cn(
        "grid gap-4 mt-4",
        viewport === "desktop"
          ? openState.desktop
            ? "grid-cols-1 lg:grid-cols-[1fr_1px_296px]"
            : "grid-cols-[1fr_1px_296px]"
          : "grid-cols-1"
      )}
    >
      <div className="flex flex-col">
        <CurrentStepComponent />
      </div>
      {viewport === "desktop" && (
        <>
          <div className="h-full border-l border-l-border"></div>
          <div className="flex flex-col items-center">
            <SecondaryContent />
          </div>
        </>
      )}
    </div>
  );
};

const SecondaryContent = () => {
  const { currentStepIndex: currentStep } = useNewBumicertStore();
  const completionPercentages = useFormStore(
    (state) => state.formCompletionPercentages
  );
  const step1FormValues = useFormStore((state) => state.formValues[0]);
  const step1Progress = completionPercentages[0];
  const auth = useAtprotoStore((state) => state.auth);

  const [isBumicertPreviewOpen, setIsBumicertPreviewOpen] = useState(
    STEPS[currentStep].previewBumicertByDefault
  );

  useEffect(() => {
    setIsBumicertPreviewOpen(STEPS[currentStep].previewBumicertByDefault);
  }, [currentStep]);

  const { data: organizationInfoResponse, isPlaceholderData: isOlderData } =
    trpcApi.gainforest.organization.info.get.useQuery(
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

  return (
    <div className="w-full min-h-full flex flex-col bg-muted/50 rounded-xl">
      <div className="w-full p-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-lg font-medium text-muted-foreground">
            <EyeIcon className="size-5" />
            Preview Bumicert
          </span>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => setIsBumicertPreviewOpen(!isBumicertPreviewOpen)}
          >
            <ChevronDown
              className={cn(
                "size-5 transition-transform duration-200",
                isBumicertPreviewOpen ? "rotate-180" : ""
              )}
            />
          </Button>
        </div>
        <hr className="my-2" />
        <AnimatePresence mode="wait">
          {isBumicertPreviewOpen && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.3,
                filter: "blur(10px)",
                height: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                height: "auto",
              }}
              exit={{ opacity: 0, scale: 0.3, filter: "blur(10px)", height: 0 }}
            >
              {step1Progress === 100 ? (
                <div className="flex items-center justify-center">
                  <BumicertArt
                    logoUrl={logoUrl}
                    coverImage={
                      step1FormValues.coverImage ??
                      new File([], "cover-image.png")
                    }
                    title={step1FormValues.projectName}
                    objectives={step1FormValues.workType}
                    startDate={step1FormValues.projectDateRange[0]}
                    endDate={step1FormValues.projectDateRange[1]}
                    className="w-min"
                  />
                </div>
              ) : (
                <div className="w-full flex items-center justify-center p-4">
                  <span className="font-medium text-muted-foreground text-center text-pretty">
                    Please complete the first step to generate the preview.
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-full p-2">
        <span className="flex items-center gap-1 text-lg font-medium text-muted-foreground">
          <Lightbulb className="size-5" />
          <motion.span layoutId="tips-text">Tips</motion.span> for this section
        </span>
        <hr className="my-2" />
        {STEPS[currentStep].tips.pre}
        <ul className="list-disc list-inside -indent-5 pl-5 mt-2 font-medium text-muted-foreground">
          {STEPS[currentStep].tips.bullets.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
        {STEPS[currentStep].tips.post}
      </div>
    </div>
  );
};

export default StepBody;

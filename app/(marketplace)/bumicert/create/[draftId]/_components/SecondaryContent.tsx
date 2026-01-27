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
import { cn } from "@/lib/utils";
import { STEPS } from "../_data/steps";

const SecondaryContent = () => {
  const { currentStepIndex: currentStep } = useNewBumicertStore();
  const completionPercentages = useFormStore(
    (state) => state.formCompletionPercentages
  );
  const step1FormValues = useFormStore((state) => state.formValues[0]);
  const step1Progress = completionPercentages[0];
  const auth = useAtprotoStore((state) => state.auth);

  const currentStepData = STEPS[currentStep];
  const [isBumicertPreviewOpen, setIsBumicertPreviewOpen] = useState(
    currentStepData.previewBumicertByDefault
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
    <div className="w-full min-h-full flex flex-col gap-4">
      {/* Preview Section */}
      <div className="bg-foreground/3 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground/70">
            <EyeIcon className="size-4" strokeWidth={1.5} />
            Preview
          </span>
          <button
            onClick={() => setIsBumicertPreviewOpen(!isBumicertPreviewOpen)}
            className="p-1 rounded hover:bg-foreground/5 transition-colors"
          >
            <ChevronDown
              className={cn(
                "size-4 text-foreground/50 transition-transform duration-200",
                isBumicertPreviewOpen ? "rotate-180" : ""
              )}
              strokeWidth={1.5}
            />
          </button>
        </div>
        <AnimatePresence mode="wait">
          {isBumicertPreviewOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
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
                <div className="w-full flex items-center justify-center py-6">
                  <span className="text-sm text-foreground/50 text-center">
                    Complete step 1 to see your preview
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tips Section */}
      <div className="bg-foreground/3 rounded-lg p-4">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-3">
          <Lightbulb className="size-4" strokeWidth={1.5} />
          Tips
        </span>
        <div className="space-y-3">
          {currentStepData.tips.pre && (
            <p className="text-sm text-foreground/60">{currentStepData.tips.pre}</p>
          )}
          <ul className="space-y-2">
            {currentStepData.tips.bullets.map((tip, index) => (
              <li key={index} className="flex gap-2 text-sm text-foreground/60">
                <span className="text-foreground/30 shrink-0">-</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          {currentStepData.tips.post && (
            <p className="text-sm text-foreground/50 italic">{currentStepData.tips.post}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondaryContent;

"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useNewBumicertStore from "../store";
import { BumicertArt } from "./Steps/Step4/BumicertPreviewCard";
import { useFormStore } from "../form-store";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { useAtprotoStore } from "@/components/stores/atproto";
import { getBlobUrl } from "climateai-sdk/utilities/atproto";
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
  const [showPreview, setShowPreview] = useState(
    currentStepData.previewBumicertByDefault
  );

  useEffect(() => {
    setShowPreview(STEPS[currentStep].previewBumicertByDefault);
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

  const hasPreview = step1Progress === 100;

  return (
    <div className="w-full flex flex-col">
      {/* Preview */}
      <AnimatePresence mode="wait">
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mb-8"
          >
            {hasPreview ? (
              <div className="flex flex-col items-center">
                <BumicertArt
                  logoUrl={logoUrl}
                  coverImage={step1FormValues.coverImage}
                  title={step1FormValues.projectName}
                  objectives={step1FormValues.workType}
                  startDate={step1FormValues.projectDateRange[0]}
                  endDate={step1FormValues.projectDateRange[1]}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center py-12 px-4">
                {/* Empty state illustration */}
                <div className="w-32 h-44 rounded-lg border-2 border-dashed border-foreground/10 flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-foreground/10" />
                </div>
                <p className="text-sm text-foreground/40 text-center">
                  Your bumicert preview will appear here
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-widest text-foreground/30 font-medium">
          Tips
        </p>
        
        <div className="space-y-3">
          {currentStepData.tips.pre && (
            <p className="text-sm text-foreground/60 leading-relaxed">
              {currentStepData.tips.pre}
            </p>
          )}
          
          <div className="space-y-2.5">
            {currentStepData.tips.bullets.map((tip, index) => (
              <p 
                key={index} 
                className="text-sm text-foreground/50 leading-relaxed pl-3 border-l border-foreground/10"
              >
                {tip}
              </p>
            ))}
          </div>
          
          {currentStepData.tips.post && (
            <p className="text-sm text-foreground/40 italic leading-relaxed">
              {currentStepData.tips.post}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondaryContent;

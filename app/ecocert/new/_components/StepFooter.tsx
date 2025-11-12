"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo } from "react";
import useNewEcocertStore from "../store";
import { STEPS as steps } from "./Steps/config";
import { useStep1Store } from "./Steps/Step1/store";
import { useStep2Store } from "./Steps/Step2/store";
import { useStep3Store } from "./Steps/Step3/store";
import { useStep5Store } from "./Steps/Step5/store";

const StepFooter = () => {
  const { currentStepIndex, setCurrentStepIndex } = useNewEcocertStore();
  const currentStep = steps[currentStepIndex];

  const step1Progress = useStep1Store((state) => state.completionPercentage);
  const step2Progress = useStep2Store((state) => state.completionPercentage);
  const step3Progress = useStep3Store((state) => state.completionPercentage);

  const overallStatusForStep5 = useStep5Store((state) => state.overallStatus);

  const allowUserToMoveForward = useMemo(() => {
    if (!currentStep.isRequiredToMoveForward) return true;
    if (currentStepIndex === 3) {
      return (
        step1Progress === 100 && step2Progress === 100 && step3Progress === 100
      );
    }
    return false;
  }, [currentStep.isRequiredToMoveForward]);

  return (
    <div className="flex items-center justify-between p-2 mt-6 mb-4 bg-muted rounded-2xl">
      {currentStepIndex > 0 ?
        <Button
          onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
          variant="outline"
          disabled={
            currentStepIndex === 4 && overallStatusForStep5 === "pending"
          }
        >
          <ChevronLeft /> {steps[currentStepIndex - 1].title}
        </Button>
      : <div className="flex-1"></div>}
      {currentStepIndex < 4 && (
        <Button
          onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
          disabled={!allowUserToMoveForward}
        >
          Continue <ChevronRight />
        </Button>
      )}
    </div>
  );
};

export default StepFooter;

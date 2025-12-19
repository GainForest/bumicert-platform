"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import React, { useMemo } from "react";
import useNewEcocertStore from "../store";
import { STEPS as steps } from "../_data/steps";
import { useFormStore } from "../form-store";
import { useStep5Store } from "./Steps/Step5/store";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const StepFooter = () => {
  const { currentStepIndex, setCurrentStepIndex } = useNewEcocertStore();

  const completionPercentages = useFormStore(
    (state) => state.formCompletionPercentages
  );
  const step1Progress = completionPercentages[0];
  const step2Progress = completionPercentages[1];
  const step3Progress = completionPercentages[2];

  const overallStatusForStep5 = useStep5Store((state) => state.overallStatus);

  const allowUserToMoveForward = useMemo(() => {
    // For steps 1, 2 and 3.
    if (currentStepIndex < 3) return true;
    // For step 4.
    if (currentStepIndex === 3) {
      return (
        step1Progress === 100 && step2Progress === 100 && step3Progress === 100
      );
    }
    // For step 5.
    return false;
  }, [currentStepIndex]);

  return (
    <div className="w-full sticky bottom-0 bg-linear-to-t from-black/20 to-black/0 z-7">
      <ProgressiveBlur
        className="w-full h-full z-7"
        height="100%"
      ></ProgressiveBlur>
      <div className="relative inset-0 flex items-center justify-between p-4 z-8">
        {currentStepIndex > 0 ? (
          <Button
            onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
            variant="outline"
            disabled={
              currentStepIndex === 4 && overallStatusForStep5 === "pending"
            }
          >
            <ChevronLeft /> {steps[currentStepIndex - 1].title}
          </Button>
        ) : (
          <div className="flex-1"></div>
        )}
        <div className="flex items-center gap-2">
          <Button variant={"outline"} className="hidden">
            <Lightbulb />
          </Button>
          {currentStepIndex < 4 && (
            <Button
              onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
              disabled={!allowUserToMoveForward}
            >
              Continue <ChevronRight />
            </Button>
          )}
        </div>
      </div>
    </div>
    // <div className="flex items-center justify-between p-2 mt-6 mb-4 bg-muted rounded-2xl">
    // </div>
  );
};

export default StepFooter;

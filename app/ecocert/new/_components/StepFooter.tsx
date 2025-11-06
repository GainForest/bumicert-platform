"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import useNewEcocertStore from "../store";
import { STEPS as steps } from "./Steps/config";

const StepFooter = () => {
  const { currentStepIndex, setCurrentStepIndex } = useNewEcocertStore();
  const currentStep = steps[currentStepIndex];

  return (
    <div className="flex items-center justify-between p-2 mt-6 mb-4 bg-muted rounded-2xl">
      {currentStepIndex > 0 ?
        <Button
          onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
          variant="outline"
        >
          <ChevronLeft /> {steps[currentStepIndex - 1].title}
        </Button>
      : <div className="flex-1"></div>}
      <Button
        onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
        disabled={currentStep.isRequiredToMoveForward}
      >
        Continue <ChevronRight />
      </Button>
    </div>
  );
};

export default StepFooter;

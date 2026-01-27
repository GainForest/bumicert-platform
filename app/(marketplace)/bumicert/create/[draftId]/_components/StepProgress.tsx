"use client";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import useNewBumicertStore from "../store";
import { STEPS as steps } from "../_data/steps";
import { useFormStore } from "../form-store";
import { Check, FlagTriangleRight } from "lucide-react";
import { useStep5Store } from "./Steps/Step5/store";

const StepHeader = () => {
  const { currentStepIndex, setCurrentStepIndex: setCurrentStep } =
    useNewBumicertStore();

  // Get completion percentage from form store
  const completionPercentages = useFormStore(
    (state) => state.formCompletionPercentages
  );
  const step1Progress = completionPercentages[0];
  const step2Progress = completionPercentages[1];
  const step3Progress = completionPercentages[2];
  const step4Progress = (step1Progress + step2Progress + step3Progress) / 3;
  const step5OverallStatus = useStep5Store((state) => state.overallStatus);

  const stepProgressesByIndex = [...completionPercentages, step4Progress, 0];

  const stepEnability = useMemo(() => {
    if (step5OverallStatus === "pending")
      return [false, false, false, false, false];
    const step1Enabled = true;
    const step2Enabled = true;
    const step3Enabled = true;
    const step4Enabled = true;
    const [p1, p2, p3] = completionPercentages;
    const step5Enabled = p1 === 100 && p2 === 100 && p3 === 100;
    return [
      step1Enabled,
      step2Enabled,
      step3Enabled,
      step4Enabled,
      step5Enabled,
    ];
  }, [completionPercentages, step5OverallStatus]);

  return (
    <div className="flex flex-col w-full gap-3">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-1">
        {steps.map((step, index) => {
          const progress = stepProgressesByIndex[index];
          const isComplete = progress >= 100;
          const isCurrent = currentStepIndex === index;
          const isEnabled = stepEnability[index];
          const Icon = step.icon;

          return (
            <React.Fragment key={index}>
              <button
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md transition-all",
                  "disabled:cursor-not-allowed disabled:opacity-40",
                  isCurrent
                    ? "bg-foreground/5"
                    : "hover:bg-foreground/5",
                )}
                onClick={() => setCurrentStep(index)}
                disabled={!isEnabled}
              >
                {/* Step number, check, or flag for last step */}
                <div
                  className={cn(
                    "flex items-center justify-center size-6 rounded-full text-xs font-medium transition-all",
                    isComplete
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                        ? "bg-primary/15 text-primary"
                        : "bg-foreground/10 text-foreground/60"
                  )}
                >
                  {isComplete ? (
                    <Check className="size-3.5" strokeWidth={2.5} />
                  ) : index === 4 ? (
                    <FlagTriangleRight className="size-3.5" strokeWidth={1.5} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* Step title - show on current step (desktop only) */}
                {isCurrent && (
                  <span className="hidden md:block text-sm font-medium text-foreground whitespace-nowrap">
                    {step.title}
                  </span>
                )}
              </button>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-6 h-px transition-colors",
                    stepProgressesByIndex[index] >= 100
                      ? "bg-primary"
                      : "bg-foreground/15"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Overall progress bar */}
      <div className="w-full h-1 bg-foreground/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${step4Progress}%` }}
        />
      </div>
    </div>
  );
};

export default StepHeader;

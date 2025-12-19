"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useMemo } from "react";
import useNewEcocertStore from "../store";
import { STEPS as steps } from "../_data/steps";
import { useFormStore } from "../form-store";

const StepHeader = () => {
  const { currentStepIndex, setCurrentStepIndex: setCurrentStep } =
    useNewEcocertStore();

  // Get completion percentage from form store
  const completionPercentages = useFormStore(
    (state) => state.formCompletionPercentages
  );
  const step1Progress = completionPercentages[0];
  const step2Progress = completionPercentages[1];
  const step3Progress = completionPercentages[2];
  const step4Progress = (step1Progress + step2Progress + step3Progress) / 3;

  const stepEnability = useMemo(() => {
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
  }, [currentStepIndex, completionPercentages]);

  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          className={"flex flex-col"}
          style={{
            flex: currentStepIndex === index ? steps.length : 1,
          }}
          layout
        >
          <motion.button
            className={cn(
              "cursor-pointer rounded-md overflow-hidden hover:bg-muted disabled:hover:bg-transparent hover:text-primary disabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            )}
            onClick={() => setCurrentStep(index)}
            disabled={!stepEnability[index]}
          >
            <div className="p-2 flex items-center gap-2">
              <motion.div
                className={cn(
                  "h-7 w-7 bg-foreground/10 rounded-full flex items-center justify-center",
                  currentStepIndex === index &&
                    "bg-primary text-primary-foreground"
                )}
                layout
              >
                {index + 1}
              </motion.div>
              {currentStepIndex === index && (
                <div className="flex flex-col items-start">
                  <b className="font-serif font-bold text-nowrap">
                    {step.title}
                  </b>
                </div>
              )}
            </div>
          </motion.button>
          <div className="w-full bg-foreground/10 h-2 rounded-md overflow-hidden mt-1">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: (() => {
                  // For steps 0-2, use completion percentage from stores
                  if (index === 0) return `${step1Progress}%`;
                  if (index === 1) return `${step2Progress}%`;
                  if (index === 2) return `${step3Progress}%`;
                  if (index === 3) return `${step4Progress}%`;
                  // For steps 4 ( Submit), they're not implemented yet
                  return "0%";
                })(),
              }}
            ></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StepHeader;

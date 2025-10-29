"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";
import useNewEcocertStore from "../store";
import { STEPS as steps } from "./Steps/config";
import { useStep1Store } from "./Steps/Step1/store";
import { useStep2Store } from "./Steps/Step2/store";
import { useStep3Store } from "./Steps/Step3/store";

const StepNavigator = () => {
  const { currentStepIndex: currentStep, setCurrentStepIndex: setCurrentStep } =
    useNewEcocertStore();

  // Get completion percentage from each step store
  const step1Progress = useStep1Store((state) => state.completionPercentage);
  const step2Progress = useStep2Store((state) => state.completionPercentage);
  const step3Progress = useStep3Store((state) => state.completionPercentage);
  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          className={"flex flex-col"}
          style={{
            flex: currentStep === index ? steps.length : 1,
          }}
          layout
        >
          <motion.button
            className={cn(
              "cursor-pointer border border-foreground/20 rounded-md overflow-hidden disabled:cursor-not-allowed disabled:opacity-50",
              currentStep === index && "bg-accent"
            )}
            onClick={() => setCurrentStep(index)}
            disabled={step.isRequiredToMoveForward}
          >
            <div className="p-2 flex items-center gap-2">
              <motion.div
                className="h-8 w-8 bg-foreground/10 rounded-full flex items-center justify-center"
                layout
              >
                {index + 1}
              </motion.div>
              {currentStep === index && (
                <div className="flex flex-col items-start">
                  <b className="text-sm font-bold text-nowrap">{step.title}</b>
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
                  // For steps 3+ (Review, Submit), they're not implemented yet
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

export default StepNavigator;

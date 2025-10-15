"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";
import useNewEcocertStore from "../store";

const steps = [
  {
    title: "Project Details",
  },
  {
    title: "Impact Details",
  },
  {
    title: "Site Details",
  },
  {
    title: "Review",
  },
  {
    title: "Submit",
  },
];

const StepNavigator = () => {
  const { currentStep, setCurrentStep } = useNewEcocertStore();
  const stepsCompleted = 2;
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
              "cursor-pointer border border-foreground/20 rounded-md overflow-hidden",
              currentStep === index && "bg-accent"
            )}
            onClick={() => setCurrentStep(index)}
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
              className="h-full bg-primary"
              style={{
                width: stepsCompleted > index ? "100%" : "0%",
              }}
            ></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StepNavigator;

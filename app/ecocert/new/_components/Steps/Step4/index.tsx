"use client";
import React, { useEffect } from "react";
import ReviewStepCard from "./ReviewStepCard";
import { STEPS as steps } from "../config";
import useNewEcocertStore from "../../../store";
import { step1Schema, useStep1Store } from "../Step1/store";
import { step2Schema, useStep2Store } from "../Step2/store";
import { step3Schema, useStep3Store } from "../Step3/store";
import { format } from "date-fns";
import EcocertPreviewCard from "./EcocertPreviewCard";
import { useStep4Store } from "./store";

const FormValue = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex-1 flex flex-col py-1">
    <span className="font-medium text-muted-foreground text-xs">{label}</span>
    {value}
  </div>
);
const Step4 = () => {
  const { setCurrentStepIndex } = useNewEcocertStore();
  const step1Progress = useStep1Store((state) => state.completionPercentage);
  const step2Progress = useStep2Store((state) => state.completionPercentage);
  const step3Progress = useStep3Store((state) => state.completionPercentage);

  const step1FormValues = useStep1Store((state) => state.formValues);
  const step2FormValues = useStep2Store((state) => state.formValues);
  const step3FormValues = useStep3Store((state) => state.formValues);

  const step1Errors = useStep1Store((state) => state.errors);
  const step2Errors = useStep2Store((state) => state.errors);
  const step3Errors = useStep3Store((state) => state.errors);

  const ecocertArtImage = useStep4Store((state) => state.ecocertArtImage);
  const setCompletionPercentage = useStep4Store(
    (state) => state.setCompletionPercentage
  );
  useEffect(() => {
    const progresses = [
      step1Progress,
      step2Progress,
      step3Progress,
      ecocertArtImage ? 100 : 0,
    ];
    setCompletionPercentage(
      progresses.reduce((acc, curr) => acc + curr, 0) / progresses.length
    );
  }, [step1Progress, step2Progress, step3Progress, ecocertArtImage]);

  return (
    <div>
      <h1 className="text-3xl font-bold font-serif">Review the information.</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <ReviewStepCard
          schema={step1Schema}
          errors={step1Errors}
          title={steps[0].title}
          percentage={step1Progress}
          onEdit={() => setCurrentStepIndex(0)}
        >
          {Object.keys(step1FormValues).map((key) => {
            const typedKey = key as keyof typeof step1FormValues;
            const error = step1Errors[typedKey];
            if (error) return null;

            let parsedValue: string;
            switch (typedKey) {
              case "coverImage":
                parsedValue =
                  step1FormValues[typedKey] ? "Uploaded" : "Not Uploaded";
                break;
              case "projectDateRange":
                parsedValue =
                  step1FormValues[typedKey] ?
                    `From ${format(step1FormValues[typedKey][0], "LLL dd, y")} to ${step1FormValues[typedKey][1] ? format(step1FormValues[typedKey][1], "LLL dd, y") : "Present"}`
                  : "Not Uploaded";
                break;
              case "isProjectOngoing":
                parsedValue = step1FormValues[typedKey] ? "Yes" : "No";
                break;
              default:
                parsedValue = step1FormValues[typedKey];
            }
            return (
              <FormValue
                key={key}
                label={step1Schema.shape[typedKey].description || key}
                value={parsedValue}
              />
            );
          })}
        </ReviewStepCard>
        <ReviewStepCard
          schema={step2Schema}
          errors={step2Errors}
          title={steps[1].title}
          percentage={step2Progress}
          onEdit={() => setCurrentStepIndex(1)}
        >
          {step2Errors.impactStory ? null : (
            <FormValue
              label="Your Impact Story"
              value={step2FormValues.impactStory}
            />
          )}
        </ReviewStepCard>
        <ReviewStepCard
          schema={step3Schema}
          errors={step3Errors}
          title={steps[2].title}
          percentage={step3Progress}
          onEdit={() => setCurrentStepIndex(2)}
        >
          {Object.keys(step3FormValues).map((key) => {
            const typedKey = key as keyof typeof step3FormValues;
            const error = step3Errors[typedKey];
            if (error) return null;

            let parsedValue: string;
            switch (typedKey) {
              case "contributors":
                parsedValue = step3FormValues[typedKey].join(", ");
                break;
              case "siteBoundaries":
                parsedValue = `${step3FormValues[typedKey].length} site${step3FormValues[typedKey].length > 1 ? "s" : ""} selected`;
                break;
              case "confirmPermissions":
                parsedValue = step3FormValues[typedKey] ? "Yes" : "No";
                break;
              case "agreeTnc":
                parsedValue = step3FormValues[typedKey] ? "Yes" : "No";
                break;
              default:
                parsedValue = step3FormValues[typedKey];
            }
            return (
              <FormValue
                key={key}
                label={step3Schema.shape[typedKey].description ?? key}
                value={parsedValue}
              />
            );
          })}
        </ReviewStepCard>
        <EcocertPreviewCard />
      </div>
    </div>
  );
};

export default Step4;

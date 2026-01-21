"use client";
import React, { useEffect } from "react";
import ReviewStepCard from "./ReviewStepCard";
import { STEPS as steps } from "../../../_data/steps";
import useNewBumicertStore from "../../../store";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  useFormStore,
} from "../../../form-store";
import { format } from "date-fns";
import BumicertPreviewCard from "./BumicertPreviewCard";
import { useNavbarContext } from "@/components/global/Navbar/context";
import { cn } from "@/lib/utils";

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
  const { viewport, openState } = useNavbarContext();
  const { setCurrentStepIndex } = useNewBumicertStore();
  const completionPercentages = useFormStore(
    (state) => state.formCompletionPercentages
  );
  const updateErrorsAndCompletion = useFormStore(
    (state) => state.updateErrorsAndCompletion
  );
  const step1Progress = completionPercentages[0];
  const step2Progress = completionPercentages[1];
  const step3Progress = completionPercentages[2];

  const formValues = useFormStore((state) => state.formValues);
  const step1FormValues = formValues[0];
  const step2FormValues = formValues[1];
  const step3FormValues = formValues[2];

  const formErrors = useFormStore((state) => state.formErrors);
  const step1Errors = formErrors[0];
  const step2Errors = formErrors[1];
  const step3Errors = formErrors[2];

  useEffect(() => {
    updateErrorsAndCompletion();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-medium text-muted-foreground">
        Review the information.
      </h1>
      <div
        className={cn(
          "grid grid-cols-1 gap-4 mt-8",
          viewport === "desktop" && openState.desktop
            ? "grid-cols-1 min-[54rem]:grid-cols-2 lg:grid-cols-1 min-[74rem]:grid-cols-2"
            : "grid-cols-1"
        )}
      >
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
                parsedValue = step1FormValues[typedKey]
                  ? "Uploaded"
                  : "Not Uploaded";
                break;
              case "projectDateRange":
                parsedValue = step1FormValues[typedKey]
                  ? `From ${format(
                      step1FormValues[typedKey][0],
                      "LLL dd, y"
                    )} to ${
                      step1FormValues[typedKey][1]
                        ? format(step1FormValues[typedKey][1], "LLL dd, y")
                        : "Present"
                    }`
                  : "Not Uploaded";
                break;
              case "workType":
                parsedValue =
                  step1FormValues[typedKey].join(", ") || "Not Selected";
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
          {step2Errors.description ? null : (
            <FormValue
              label="Your Impact Story"
              value={step2FormValues.description}
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
                parsedValue = `${step3FormValues[typedKey].length} site${
                  step3FormValues[typedKey].length > 1 ? "s" : ""
                } selected`;
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
        <BumicertPreviewCard />
      </div>
    </div>
  );
};

export default Step4;

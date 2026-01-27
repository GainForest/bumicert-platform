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

const FormValue = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[11px] uppercase tracking-wide text-muted-foreground/70">{label}</span>
    <span className="text-sm text-foreground leading-relaxed">{value}</span>
  </div>
);

const Step4 = () => {
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
        Review your bumicert.
      </h1>
      <p className="text-sm text-muted-foreground/70 mt-1">
        Make sure everything looks good before publishing.
      </p>
      
      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        {/* Left column - Form data */}
        <div className="flex-1 flex flex-col gap-4">
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
                  const coverImg = step1FormValues[typedKey];
                  parsedValue = coverImg && coverImg.size > 0
                    ? "Custom image uploaded"
                    : "Using default image";
                  break;
                case "projectDateRange":
                  parsedValue = step1FormValues[typedKey]
                    ? `${format(
                        step1FormValues[typedKey][0],
                        "LLL dd, y"
                      )} — ${
                        step1FormValues[typedKey][1]
                          ? format(step1FormValues[typedKey][1], "LLL dd, y")
                          : "Present"
                      }`
                    : "Not set";
                  break;
                case "workType":
                  parsedValue =
                    step1FormValues[typedKey].join(", ") || "Not selected";
                  break;
                default:
                  parsedValue = step1FormValues[typedKey] || "—";
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
                value={
                  <span className="line-clamp-4">
                    {step2FormValues.description || "—"}
                  </span>
                }
              />
            )}
            {step2Errors.shortDescription ? null : (
              <FormValue
                label="Short Description"
                value={
                  <span className="line-clamp-2">
                    {step2FormValues.shortDescription || "—"}
                  </span>
                }
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
            {step3Errors.contributors ? null : (
              <FormValue
                label="Contributors"
                value={step3FormValues.contributors.join(", ") || "—"}
              />
            )}
            {step3Errors.siteBoundaries ? null : (
              <FormValue
                label="Site Boundaries"
                value={`${step3FormValues.siteBoundaries.length} site${
                  step3FormValues.siteBoundaries.length !== 1 ? "s" : ""
                } selected`}
              />
            )}
            {(!step3Errors.confirmPermissions && !step3Errors.agreeTnc) && (
              <FormValue
                label="Permissions"
                value={
                  step3FormValues.confirmPermissions && step3FormValues.agreeTnc
                    ? "All permissions confirmed"
                    : "Pending confirmation"
                }
              />
            )}
          </ReviewStepCard>
        </div>

        {/* Right column - Preview */}
        <div className="lg:w-[280px] shrink-0">
          <div className="sticky top-4">
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground/70 mb-3 block">
              Preview
            </span>
            <BumicertPreviewCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4;

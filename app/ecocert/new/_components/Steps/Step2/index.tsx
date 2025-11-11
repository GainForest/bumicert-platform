"use client";
import React, { useEffect } from "react";
import FormField from "../components/FormField";
import { Textarea } from "@/components/ui/textarea";
import { HandHeart } from "lucide-react";
import { useStep2Store } from "./store";
import useNewEcocertStore from "../../../store";

const Step2 = () => {
  const { maxStepIndexReached, currentStepIndex } = useNewEcocertStore();
  const shouldShowValidationErrors = currentStepIndex < maxStepIndexReached;

  const {
    formValues,
    setImpactStory,
    errors,
    updateValidationsAndCompletionPercentage,
  } = useStep2Store();
  const { impactStory } = formValues;

  useEffect(() => {
    updateValidationsAndCompletionPercentage();
  }, [shouldShowValidationErrors]);

  return (
    <div>
      <h1 className="text-3xl font-bold font-serif">
        Share your impact story.
      </h1>
      <FormField
        Icon={HandHeart}
        label="Your Impact Story"
        className="mt-4"
        description="Tell us about your impact — what changed, who was involved, and how it's helping. Take your time. Your story helps inspire others and verify your work."
        error={errors.impactStory}
        showError={shouldShowValidationErrors}
      >
        <Textarea
          id="your-impact-story"
          placeholder="Start your story here..."
          value={impactStory}
          onChange={(e) => setImpactStory(e.target.value)}
          className="min-h-44 bg-background"
        />
      </FormField>
    </div>
  );
};

export default Step2;

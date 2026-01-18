"use client";
import React, { useEffect } from "react";
import FormField from "../../../../../../../components/ui/FormField";
import { Textarea } from "@/components/ui/textarea";
import { HandHeart, MessageCircle, SparklesIcon } from "lucide-react";
import { useFormStore } from "../../form-store";
import useNewBumicertStore from "../../store";
import { Button } from "@/components/ui/button";
import QuickTooltip from "@/components/ui/quick-tooltip";

const Step2 = () => {
  const { maxStepIndexReached, currentStepIndex } = useNewBumicertStore();
  const shouldShowValidationErrors = currentStepIndex < maxStepIndexReached;

  const formValues = useFormStore((state) => state.formValues[1]);
  const errors = useFormStore((state) => state.formErrors[1]);
  const setFormValue = useFormStore((state) => state.setFormValue[1]);
  const updateErrorsAndCompletion = useFormStore(
    (state) => state.updateErrorsAndCompletion
  );
  const { impactStory, shortDescription } = formValues;

  useEffect(() => {
    updateErrorsAndCompletion();
  }, [shouldShowValidationErrors]);

  return (
    <div>
      <h1 className="text-2xl font-medium text-muted-foreground">
        Share your impact story.
      </h1>
      <FormField
        Icon={HandHeart}
        label="Your Impact Story"
        className="mt-8"
        description="Tell us about your impact — what changed, who was involved, and how it's helping. Take your time. Your story helps inspire others and verify your work."
        error={errors.impactStory}
        showError={shouldShowValidationErrors}
        inlineEndMessage={`${impactStory.length}/8000`}
        required
        info="Tell us what you did and what happened as a result"
      >
        <Textarea
          id="your-impact-story"
          placeholder="Start your story here..."
          value={impactStory}
          onChange={(e) => setFormValue("impactStory", e.target.value)}
          className="min-h-44 bg-background"
        />
      </FormField>
      <FormField
        Icon={MessageCircle}
        label="Short Description"
        className="mt-4"
        description="A short description of your impact story. This will be used as the short description of the bumicert."
        error={errors.shortDescription}
        showError={shouldShowValidationErrors}
        inlineEndMessage={`${shortDescription.length}/3000`}
        required
        info="Summarize your work and its results in a few lines"
      >
        <div className="w-full relative">
          <Textarea
            id="short-description"
            placeholder="A quick summary about this project."
            value={shortDescription}
            onChange={(e) => setFormValue("shortDescription", e.target.value)}
            className="min-h-24 bg-background"
          />
          <QuickTooltip content="AI coming soon." asChild>
            <Button
              variant={"outline"}
              size={"icon-sm"}
              className="rounded-full absolute right-2 bottom-2"
            >
              <SparklesIcon className="fill-current text-muted-foreground" />
            </Button>
          </QuickTooltip>
        </div>
      </FormField>
    </div>
  );
};

export default Step2;

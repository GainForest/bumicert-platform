"use client";
import React, { useEffect } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  CalendarClock,
  Club,
  GalleryVertical,
  Globe,
  HandHeart,
  ImagePlusIcon,
} from "lucide-react";
import FileInput from "../components/FileInput";
import FormField from "../components/FormField";
import { CalendarRange } from "@/components/ui/calendar-range";
import { useStep1Store } from "./store";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Capsules from "../components/Capsules";
import useNewEcocertStore from "../../../store";

const Step1 = () => {
  const { showValidationErrorsInForm, currentStepIndex } = useNewEcocertStore();
  const shouldShowValidationErrors =
    showValidationErrorsInForm.has(currentStepIndex);

  const {
    formValues,
    errors,
    setProjectName,
    setWebsiteOrSocialLink,
    setLogo,
    setCoverImage,
    setWorkType,
    setProjectDateRange,
    setIsProjectOngoing,
    updateValidationsAndCompletionPercentage,
  } = useStep1Store();

  const {
    projectName,
    websiteOrSocialLink,
    logo,
    coverImage,
    workType,
    projectDateRange,
    isProjectOngoing,
  } = formValues;

  useEffect(() => {
    updateValidationsAndCompletionPercentage();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold font-serif">
        Tell us about your project.
      </h1>
      <div className="flex flex-col gap-2 mt-4">
        <FormField
          Icon={Club}
          label="Project Title"
          error={errors.projectName}
          showError={shouldShowValidationErrors}
        >
          <InputGroup className="bg-background">
            <InputGroupInput
              placeholder="My Awesome Project"
              id="project-title"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <InputGroupAddon
              align="inline-end"
              className={projectName.length > 50 ? "text-red-500" : ""}
            >
              {projectName.length}/50
            </InputGroupAddon>
          </InputGroup>
        </FormField>
        <FormField
          Icon={Globe}
          label="Website or Social Link"
          htmlFor="website-or-social-link"
          error={errors.websiteOrSocialLink}
          showError={shouldShowValidationErrors}
        >
          <InputGroup className="bg-background">
            <InputGroupInput
              placeholder="https://www.example.com"
              id="website-or-social-link"
              value={websiteOrSocialLink}
              onChange={(e) => setWebsiteOrSocialLink(e.target.value)}
            />
          </InputGroup>
        </FormField>
        <div className="flex items-center gap-2 w-full">
          <FormField
            Icon={ImagePlusIcon}
            label="Your logo"
            className="flex-1"
            error={errors.logo}
            showError={shouldShowValidationErrors}
          >
            <FileInput
              placeholder="Upload or drag and drop an image"
              value={logo}
              onFileChange={setLogo}
              supportedFileTypes={["image/*"]}
              maxSizeInMB={5}
            />
          </FormField>
          <FormField
            Icon={GalleryVertical}
            label="Cover Image"
            className="flex-2"
            error={errors.coverImage}
            showError={shouldShowValidationErrors}
          >
            <FileInput
              placeholder="Upload or drag and drop an image"
              value={coverImage}
              onFileChange={setCoverImage}
              supportedFileTypes={["image/*"]}
              maxSizeInMB={10}
            />
          </FormField>
        </div>
        <FormField
          Icon={HandHeart}
          label="What kind of work are you doing?"
          className="flex-1"
          error={errors.workType}
          showError={shouldShowValidationErrors}
        >
          <Capsules
            className="mt-1"
            selectMultiple={false}
            value={workType}
            onChange={(value) => setWorkType(value as typeof workType)}
            options={[
              { value: "Conservation", label: "Conservation" },
              { value: "Restoration", label: "Restoration" },
              { value: "Community Led", label: "Community Led" },
              { value: "Landscape", label: "Landscape" },
              { value: "Science", label: "Science" },
              { value: "Other", label: "Other" },
            ]}
          />
        </FormField>
        <FormField
          Icon={CalendarClock}
          label="Project Date Range"
          className="flex-1"
          error={errors.projectDateRange}
          showError={shouldShowValidationErrors}
        >
          <div className="flex items-center gap-4 mt-1">
            <CalendarRange
              id="project-date-range"
              value={projectDateRange}
              onValueChange={(range) => {
                setProjectDateRange(range);
              }}
            />
            <div className="flex items-center gap-2 text-sm">
              <Checkbox
                id="ongoing"
                className="bg-background size-5"
                checked={isProjectOngoing}
                onCheckedChange={(checked) =>
                  setIsProjectOngoing(
                    checked === "indeterminate" ? false : checked
                  )
                }
              />
              <Label htmlFor="ongoing" className="cursor-pointer">
                The impact is still ongoing.
              </Label>
            </div>
          </div>
        </FormField>
      </div>
    </div>
  );
};

export default Step1;

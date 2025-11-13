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
  Globe,
  HandHeart,
  ImagePlusIcon,
} from "lucide-react";
import FileInput from "../components/FileInput";
import FormField from "../components/FormField";
import { useStep1Store } from "./store";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Capsules from "../components/Capsules";
import useNewEcocertStore from "../../../store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Step1 = () => {
  const { maxStepIndexReached, currentStepIndex } = useNewEcocertStore();
  const shouldShowValidationErrors = currentStepIndex < maxStepIndexReached;

  const {
    formValues,
    errors,
    setProjectName,
    setWebsiteOrSocialLink,
    setCoverImage,
    setWorkType,
    setProjectDateRange,
    setIsProjectOngoing,
    updateValidationsAndCompletionPercentage,
  } = useStep1Store();

  const {
    projectName,
    websiteOrSocialLink,
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
        <FormField
          Icon={ImagePlusIcon}
          label="Cover Image"
          error={errors.coverImage}
          showError={shouldShowValidationErrors}
        >
          <FileInput
            placeholder="Upload or drag and drop an image"
            value={coverImage}
            onFileChange={setCoverImage}
            supportedFileTypes={[
              "image/jpg",
              "image/jpeg",
              "image/png",
              "image/webp",
            ]}
            maxSizeInMB={10}
          />
        </FormField>
        <FormField
          Icon={HandHeart}
          label="What kind of work are you doing?"
          className="flex-1"
          error={errors.workType}
          showError={shouldShowValidationErrors}
        >
          <Capsules
            className="mt-1"
            selectMultiple={true}
            value={workType}
            onChange={(value) => setWorkType(value)}
            options={[
              { value: "Community Resilience", label: "Community Resilience" },
              {
                value: "Biodiversity Monitoring",
                label: "Biodiversity Monitoring",
              },
              {
                value: "Environmental Education",
                label: "Environmental Education",
              },
              { value: "Mangrove Restoration", label: "Mangrove Restoration" },
              { value: "Agroforestry", label: "Agroforestry" },
              { value: "Tree Planting", label: "Tree Planting" },
            ]}
          />
        </FormField>
        <div className="flex items-stretch gap-2">
          <FormField
            Icon={CalendarClock}
            label="Project Start Date"
            className="flex-1"
            error={errors.projectDateRange}
            showError={shouldShowValidationErrors}
          >
            <div className="mt-1">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    id="project-start-date"
                    className="group w-full flex items-center justify-center text-center bg-foreground/2 transition-all duration-300 rounded-md cursor-pointer p-2"
                  >
                    <span
                      className={cn(
                        "text-foreground/20 group-hover:text-foreground/40 text-xl font-semibold",
                        projectDateRange[0] &&
                          "text-foreground group-hover:text-primary"
                      )}
                    >
                      {projectDateRange[0] ?
                        format(projectDateRange[0], "LLL dd, y")
                      : "Select the Start Date"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    id="project-start-date"
                    mode="single"
                    selected={projectDateRange[0] ?? undefined}
                    onSelect={(date) => {
                      setProjectDateRange([
                        date ?? new Date(`${new Date().getFullYear()}-01-01`),
                        projectDateRange[1],
                      ]);
                    }}
                    defaultMonth={projectDateRange[0] ?? undefined}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </FormField>
          <FormField
            Icon={CalendarClock}
            label="Project End Date"
            className="flex-1"
            error={errors.projectDateRange}
            showError={shouldShowValidationErrors}
          >
            <div className="mt-1">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    id="project-end-date"
                    className="group w-full flex items-center justify-center text-center bg-foreground/2 transition-all duration-300 rounded-md cursor-pointer p-2"
                    disabled={isProjectOngoing}
                  >
                    {isProjectOngoing && (
                      <span className="text-foreground/20 text-xl font-semibold">
                        Ongoing
                      </span>
                    )}
                    {!isProjectOngoing && (
                      <span
                        className={cn(
                          "text-foreground/20 group-hover:text-foreground/40 text-xl font-semibold",
                          projectDateRange[1] &&
                            "text-foreground group-hover:text-primary"
                        )}
                      >
                        {projectDateRange[1] ?
                          format(projectDateRange[1], "LLL dd, y")
                        : "Select the End Date"}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    id="project-end-date"
                    mode="single"
                    selected={projectDateRange[1] ?? undefined}
                    onSelect={(date) => {
                      setProjectDateRange([
                        projectDateRange[0] ?? null,
                        date ?? null,
                      ]);
                    }}
                    defaultMonth={projectDateRange[1] ?? undefined}
                  />
                </PopoverContent>
              </Popover>
              <div className="flex items-center gap-2 text-sm mt-1">
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
    </div>
  );
};

export default Step1;

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
import FileInput from "../../../../../../../components/ui/FileInput";
import FormField from "../../../../../../../components/ui/FormField";
import { useFormStore } from "../../form-store";
import Capsules from "../../../../../../../components/ui/Capsules";
import useNewEcocertStore from "../../store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarRange } from "@/components/ui/calendar-range";

const Step1 = () => {
  const { maxStepIndexReached, currentStepIndex } = useNewEcocertStore();
  const shouldShowValidationErrors = currentStepIndex < maxStepIndexReached;

  const formValues = useFormStore((state) => state.formValues[0]);
  const errors = useFormStore((state) => state.formErrors[0]);
  const setFormValue = useFormStore((state) => state.setFormValue[0]);
  const updateErrorsAndCompletion = useFormStore(
    (state) => state.updateErrorsAndCompletion
  );

  const { projectName, coverImage, workType, projectDateRange } = formValues;

  useEffect(() => {
    updateErrorsAndCompletion();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold font-serif">
        Tell us about your project.
      </h1>
      <div className="flex flex-col gap-2 mt-4">
        <div className="grid grid-cols-[16rem_1fr] gap-2">
          <FormField
            Icon={ImagePlusIcon}
            label="Cover Image"
            error={errors.coverImage}
            showError={shouldShowValidationErrors}
          >
            <FileInput
              className="h-80"
              placeholder="Upload or drag and drop an image"
              value={coverImage}
              onFileChange={(file) => setFormValue("coverImage", file)}
              supportedFileTypes={[
                "image/jpg",
                "image/jpeg",
                "image/png",
                "image/webp",
              ]}
              maxSizeInMB={10}
            />
          </FormField>
          <div className="flex flex-col gap-2">
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
                  onChange={(e) => setFormValue("projectName", e.target.value)}
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
              Icon={CalendarClock}
              label="Project Date Range"
              className="flex-1"
              error={errors.projectDateRange}
              showError={shouldShowValidationErrors}
            >
              <div className="mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      id="project-date-range"
                      className="group w-full flex items-center justify-center text-center bg-foreground/2 transition-all duration-300 rounded-md cursor-pointer p-2"
                    >
                      <span
                        className={cn(
                          "text-foreground/20 group-hover:text-foreground/40 text-2xl font-medium",
                          "text-foreground group-hover:text-primary"
                        )}
                      >
                        {format(projectDateRange[0], "LLL dd, y")} →{" "}
                        {format(projectDateRange[1], "LLL dd, y")}{" "}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto">
                    <CalendarRange
                      value={projectDateRange}
                      onValueChange={(value) => {
                        if (!value) return;
                        setFormValue("projectDateRange", value);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
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
                onChange={(value) => setFormValue("workType", value)}
                options={[
                  {
                    value: "Community Resilience",
                    label: "Community Resilience",
                  },
                  {
                    value: "Biodiversity Monitoring",
                    label: "Biodiversity Monitoring",
                  },
                  {
                    value: "Environmental Education",
                    label: "Environmental Education",
                  },
                  {
                    value: "Mangrove Restoration",
                    label: "Mangrove Restoration",
                  },
                  { value: "Agroforestry", label: "Agroforestry" },
                  { value: "Tree Planting", label: "Tree Planting" },
                ]}
              />
            </FormField>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;

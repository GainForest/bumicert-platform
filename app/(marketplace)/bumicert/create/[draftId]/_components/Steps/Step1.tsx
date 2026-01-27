"use client";
import React, { useEffect } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  CalendarDays,
  ImagePlus,
  Sparkles,
  Type,
} from "lucide-react";
import FileInput from "../../../../../../../components/ui/FileInput";
import FormField from "../../../../../../../components/ui/FormField";
import { useFormStore } from "../../form-store";
import Capsules from "../../../../../../../components/ui/Capsules";
import useNewBumicertStore from "../../store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarRange } from "@/components/ui/calendar-range";
import { useNavbarContext } from "@/components/global/Navbar/context";

const Step1 = () => {
  const { viewport, openState } = useNavbarContext();

  const { maxStepIndexReached, currentStepIndex } = useNewBumicertStore();
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
      <h1 className="text-xl text-foreground/70">
        Share your impact at a glance
      </h1>
      <div className="flex flex-col gap-2 mt-6">
        <div
          className={cn(
            "grid grid-cols-1 gap-2",
            viewport === "desktop" && openState.desktop
              ? "min-[52rem]:grid-cols-[16rem_1fr] lg:grid-cols-1 xl:grid-cols-[16rem_1fr]"
              : "lg:grid-cols-[16rem_1fr]"
          )}
        >
          <FormField
            Icon={ImagePlus}
            label="Cover image"
            error={errors.coverImage}
            showError={shouldShowValidationErrors}
            info="Choose an image that best represents your work"
            required
          >
            <FileInput
              className="h-80"
              placeholder="Upload or drag and drop an image"
              value={coverImage}
              onFileChange={(file) =>
                setFormValue(
                  "coverImage",
                  file ?? new File([], "cover-image.png")
                )
              }
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
              Icon={Type}
              label="Project title"
              error={errors.projectName}
              showError={shouldShowValidationErrors}
              info="A clear, descriptive name for your project"
              required
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
                  className={cn(
                    "text-xs",
                    projectName.length > 50 ? "text-amber-600 dark:text-amber-500" : "text-muted-foreground"
                  )}
                >
                  {projectName.length}/50
                </InputGroupAddon>
              </InputGroup>
            </FormField>
            <FormField
              Icon={CalendarDays}
              label="Project date range"
              className="flex-1"
              error={errors.projectDateRange}
              showError={shouldShowValidationErrors}
              required
              info="Select the period when your work and impact took place"
            >
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    id="project-date-range"
                    className="w-full flex items-center gap-3 bg-background border border-border/50 hover:border-border transition-colors rounded-md cursor-pointer py-2 px-3"
                  >
                    <div className="flex-1 text-left">
                      <span className="text-[10px] uppercase tracking-wide text-foreground/40 block">Start</span>
                      <span className="text-sm text-foreground">
                        {format(projectDateRange[0], "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-border/50" />
                    <div className="flex-1 text-left">
                      <span className="text-[10px] uppercase tracking-wide text-foreground/40 block">End</span>
                      <span className="text-sm text-foreground">
                        {format(projectDateRange[1], "MMM d, yyyy")}
                      </span>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarRange
                    value={projectDateRange}
                    onValueChange={(value) => {
                      if (!value) return;
                      setFormValue("projectDateRange", value);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </FormField>
            <FormField
              Icon={Sparkles}
              label="Type of work"
              className="flex-1"
              error={errors.workType}
              showError={shouldShowValidationErrors}
              required
              info="Feel free to choose more than one"
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

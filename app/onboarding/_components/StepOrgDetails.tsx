"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useOnboardingStore, generateHandle } from "../store";
import {
  ArrowRight,
  ArrowLeft,
  Calendar as CalendarIcon,
  Globe,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { countries } from "@/lib/countries";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useModal } from "@/components/ui/modal/context";
import CountrySelectorModal, {
  CountrySelectorModalId,
} from "@/app/(upload)/upload/organization/[did]/_modals/country-selector";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO } from "date-fns";

export function StepOrgDetails() {
  const { data, updateData, nextStep, prevStep, setError, error } =
    useOnboardingStore();
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [websiteError, setWebsiteError] = useState<string | null>(null);
  const { show, pushModal } = useModal();

  const selectedCountry = data.country ? countries[data.country] : null;

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid (optional field)
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const canContinue =
    data.country.length > 0 &&
    data.longDescription.trim().length >= 50 &&
    data.shortDescription.trim().length > 0 &&
    (data.website === "" || validateUrl(data.website));

  const handleGenerateShortDescription = async () => {
    if (data.longDescription.trim().length < 50) {
      setError("Please write at least 50 characters in the description first");
      return;
    }

    setIsGeneratingDescription(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/atproto/onboarding/generate-short-description",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            longDescription: data.longDescription,
            organizationName: data.organizationName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate description");
      }

      const result = await response.json();
      updateData({ shortDescription: result.shortDescription });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate description"
      );
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleContinue = () => {
    if (canContinue) {
      // Pre-generate handle for next step
      const handle = generateHandle(
        data.organizationName,
        data.country
      );
      updateData({ handle });
      nextStep();
    }
  };

  const handleOpenCountrySelector = () => {
    pushModal({
      id: CountrySelectorModalId,
      content: (
        <CountrySelectorModal
        initialCountryCode={data.country}
        onCountryChange={(country) => updateData({ country })}
        />
      ),
    }, true);
    show();
  };

  const handleWebsiteChange = (value: string) => {
    updateData({ website: value });
    if (value && !validateUrl(value)) {
      setWebsiteError("Please enter a valid URL");
    } else {
      setWebsiteError(null);
    }
  };

  const selectedDate = data.startDate ? parseISO(data.startDate) : undefined;

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-serif font-bold">Organization Details</h1>
          <p className="text-sm text-muted-foreground">
            Tell us more about your organization.
          </p>
        </div>

        {/* Form */}
        <div className="w-full space-y-3">
          {/* Country selector */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Country <span className="text-destructive">*</span>
            </label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start text-left font-normal h-9"
              onClick={handleOpenCountrySelector}
            >
              {selectedCountry ? (
                <span className="flex items-center gap-2">
                  <span className="text-lg">{selectedCountry.emoji}</span>
                  <span className="text-sm">{selectedCountry.name}</span>
                </span>
              ) : (
                <span className="text-muted-foreground text-sm">
                  Select a country
                </span>
              )}
            </Button>
          </div>

          {/* Start date and Website in a row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span className="text-xs">Start Date</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-9 text-sm",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    {selectedDate ? (
                      format(selectedDate, "MMM d, yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) =>
                      updateData({
                        startDate: date ? format(date, "yyyy-MM-dd") : null,
                      })
                    }
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="website"
                className="text-sm font-medium leading-none flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="text-xs">Website</span>
              </label>
              <Input
                id="website"
                type="url"
                placeholder="https://..."
                value={data.website}
                onChange={(e) => handleWebsiteChange(e.target.value)}
                className={cn(
                  "h-9 text-sm",
                  websiteError && "border-destructive focus-visible:ring-destructive/50"
                )}
              />
              {websiteError && (
                <p className="text-xs text-destructive">{websiteError}</p>
              )}
            </div>
          </div>

          {/* Long description */}
          <div className="space-y-1.5">
            <label
              htmlFor="long-description"
              className="text-sm font-medium leading-none"
            >
              About <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="long-description"
              placeholder="Describe your organization's mission and impact..."
              value={data.longDescription}
              onChange={(e) => updateData({ longDescription: e.target.value })}
              rows={3}
              className="resize-none text-sm"
            />
            <div className="flex justify-end text-xs">
              <span
                className={cn(
                  data.longDescription.length < 50
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {data.longDescription.length}/50+
              </span>
            </div>
          </div>

          {/* Short description with generate button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="short-description"
                className="text-sm font-medium leading-none"
              >
                Short Description <span className="text-destructive">*</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerateShortDescription}
                disabled={
                  isGeneratingDescription || data.longDescription.length < 50
                }
                className="h-6 text-xs px-2"
              >
                {isGeneratingDescription ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-1" />
                    Generate
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="short-description"
              placeholder="A brief summary (for previews)"
              value={data.shortDescription}
              onChange={(e) => updateData({ shortDescription: e.target.value })}
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          {/* Error display */}
          {error && (
            <div
              className="p-2 bg-destructive/10 border border-destructive/20 rounded-lg"
              role="alert"
            >
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="w-full flex justify-between mt-1">
          <Button onClick={prevStep} variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleContinue} disabled={!canContinue}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

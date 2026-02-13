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
  ImageIcon,
  X,
  Wand2,
  Sparkle,
} from "lucide-react";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { countries } from "@/lib/countries";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useModal } from "@/components/ui/modal/context";
import CountrySelectorModal, {
  CountrySelectorModalId,
} from "@/app/(upload)/upload/organization/[did]/_modals/country-selector";
import {
  ImageEditorModal,
  ImageEditorModalId,
} from "@/app/(upload)/upload/organization/[did]/_modals/image-editor";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { links } from "@/lib/links";
import Image from "next/image";
import { organizationInfoSchema } from "../api/onboard/schema";

type BrandInfo = {
  found: boolean;
  name?: string;
  description?: string;
  logoUrl?: string;
  domain?: string;
  countryCode?: string;
  country?: string;
  foundedYear?: number;
};

function extractDomain(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function StepOrgDetails() {
  const { data, updateData, nextStep, prevStep, setError, error } =
    useOnboardingStore();
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isFetchingBrandInfo, setIsFetchingBrandInfo] = useState(false);
  const [brandInfoFetched, setBrandInfoFetched] = useState(false);
  const [websiteError, setWebsiteError] = useState<string | null>(null);
  const { show, pushModal } = useModal();

  // Track if we've done the initial auto-fetch
  const hasAutoFetched = useRef(false);

  const selectedCountry = data.country ? countries[data.country] : null;

  // Check if we have a valid domain to fetch
  const domain = useMemo(() => extractDomain(data.website), [data.website]);
  const canFetchBrandInfo = !!domain && !isFetchingBrandInfo;

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid (optional field)
    try {
      const urlToTest = url.startsWith("http") ? url : `https://${url}`;
      const parsed = new URL(urlToTest);
      // Must have a valid hostname with at least one dot (e.g., example.com)
      return parsed.hostname.includes(".");
    } catch {
      return false;
    }
  };

  // Clear any errors from other steps on mount, and validate website if present
  useEffect(() => {
    setError(null);
    // Validate website on mount if it's already set
    if (data.website && !validateUrl(data.website)) {
      setWebsiteError("Please enter a valid URL (e.g., https://example.com)");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validate using the shared schema
  const validationResult = useMemo(() => {
    return organizationInfoSchema.safeParse({
      displayName: data.organizationName.trim(),
      shortDescription: data.shortDescription.trim(),
      longDescription: data.longDescription.trim(),
      country: data.country,
      website: data.website || undefined,
      startDate: data.startDate || undefined,
    });
  }, [data.organizationName, data.shortDescription, data.longDescription, data.country, data.website, data.startDate]);

  const canContinue = validationResult.success;

  // Generate short description
  const handleGenerateShortDescription = useCallback(async (longDesc?: string, orgName?: string, countryCode?: string) => {
    const description = longDesc ?? data.longDescription;
    const name = orgName ?? data.organizationName;
    const country = countryCode ?? data.country;

    if (description.trim().length < 50) {
      return; // Silently return if not enough content
    }

    setIsGeneratingDescription(true);
    setError(null);

    try {
      const response = await fetch(
        links.api.onboarding.generateShortDescription,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            longDescription: description,
            organizationName: name,
            country: country,
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
  }, [data.longDescription, data.organizationName, data.country, setError, updateData]);

  // Fetch logo from URL and convert to File
  const fetchLogoAsFile = async (logoUrl: string): Promise<File | null> => {
    try {
      const response = await fetch(logoUrl);
      if (!response.ok) return null;

      const blob = await response.blob();
      const extension = logoUrl.split('.').pop()?.split('?')[0] || 'png';
      const mimeType = blob.type || `image/${extension}`;
      return new File([blob], `logo.${extension}`, { type: mimeType });
    } catch {
      console.warn("Failed to fetch logo from URL:", logoUrl);
      return null;
    }
  };

  // Manual BrandFetch trigger
  const handleFetchBrandInfo = useCallback(async (isAutoFetch = false) => {
    const currentDomain = extractDomain(data.website);
    if (!currentDomain) {
      if (!isAutoFetch) {
        setError("Please enter a valid website URL first");
      }
      return;
    }

    setIsFetchingBrandInfo(true);
    setError(null);

    try {
      const response = await fetch(links.api.onboarding.fetchBrandInfo, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: currentDomain }),
      });

      const brandInfo: BrandInfo = await response.json();

      if (brandInfo.found) {
        const updates: Partial<typeof data> = {};

        // Only update fields that are empty
        if (brandInfo.description && data.longDescription.trim().length === 0) {
          updates.longDescription = brandInfo.description;
        }

        // Fill country if empty and countryCode is valid
        if (brandInfo.countryCode && !data.country && brandInfo.countryCode in countries) {
          updates.country = brandInfo.countryCode;
        }

        // Fill start date from foundedYear if empty
        if (brandInfo.foundedYear && !data.startDate) {
          updates.startDate = `${brandInfo.foundedYear}-01-01`;
        }

        // Fetch and set logo if empty and logoUrl is available
        if (brandInfo.logoUrl && !data.logo) {
          const logoFile = await fetchLogoAsFile(brandInfo.logoUrl);
          if (logoFile) {
            updates.logo = logoFile;
          }
        }

        if (Object.keys(updates).length > 0) {
          updateData(updates);
        }

        setBrandInfoFetched(true);

        // Auto-generate short description after BrandFetch completes
        const newLongDesc = updates.longDescription ?? data.longDescription;
        const newCountry = updates.country ?? data.country;
        if (newLongDesc.trim().length >= 50) {
          // Small delay to let state update
          setTimeout(() => {
            handleGenerateShortDescription(newLongDesc, data.organizationName, newCountry);
          }, 100);
        }
      } else if (!isAutoFetch) {
        setError("Could not find information for this website");
      }
    } catch {
      if (!isAutoFetch) {
        setError("Failed to fetch website information");
      }
    } finally {
      setIsFetchingBrandInfo(false);
    }
  }, [data.website, data.longDescription, data.country, data.startDate, data.logo, data.organizationName, setError, updateData, handleGenerateShortDescription]);

  // Auto-fetch brand info on first render if website is provided
  useEffect(() => {
    if (!hasAutoFetched.current && data.website && extractDomain(data.website)) {
      hasAutoFetched.current = true;
      handleFetchBrandInfo(true);
    }
  }, [data.website, handleFetchBrandInfo]);

  const handleContinue = () => {
    if (canContinue) {
      // Pre-generate handle for next step
      const handle = generateHandle(data.organizationName, data.country);
      updateData({ handle });
      nextStep();
    }
  };

  const handleOpenCountrySelector = () => {
    pushModal(
      {
        id: CountrySelectorModalId,
        content: (
          <CountrySelectorModal
            initialCountryCode={data.country}
            onCountryChange={(country) => updateData({ country })}
          />
        ),
      },
      true
    );
    show();
  };

  const handleOpenLogoEditor = () => {
    pushModal(
      {
        id: ImageEditorModalId,
        content: (
          <ImageEditorModal
            title="Upload Logo"
            description="Upload a logo for your organization"
            initialImage={data.logo}
            onImageChange={(image) => {
              if (image instanceof File) {
                updateData({ logo: image });
              } else {
                updateData({ logo: undefined });
              }
            }}
          />
        ),
      },
      true
    );
    show();
  };

  const handleWebsiteChange = (value: string) => {
    updateData({ website: value });
    setBrandInfoFetched(false); // Reset when website changes
    if (value && !validateUrl(value)) {
      setWebsiteError("Please enter a valid URL");
    } else {
      setWebsiteError(null);
    }
  };

  const handleRemoveLogo = () => {
    updateData({ logo: undefined });
  };

  const selectedDate = data.startDate ? parseISO(data.startDate) : undefined;

  // Create object URL for logo preview
  const logoPreviewUrl = useMemo(() => {
    if (data.logo instanceof File) {
      return URL.createObjectURL(data.logo);
    }
    return null;
  }, [data.logo]);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

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
        <div
          className={cn("w-full relative")}
        >
          {
            isFetchingBrandInfo && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  rotate: isFetchingBrandInfo ? [0, 360] : 0,
                }}
                transition={{
                  rotate: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: isFetchingBrandInfo ? Infinity : 0,
                  },
                }}
              >
                <Sparkle
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 text-primary animate-pulse fill-current" />
              </motion.div>
            )}

          {/* Content */}
          <div className={cn("flex flex-col gap-3 w-full", isFetchingBrandInfo && "animate-pulse blur-xs pointer-events-none")}>
            {/* Logo and Organization Name row */}
            <div className="flex gap-3 items-start">
              {/* Organization Name - left side */}
              <div className="flex-1 space-y-1.5">
                <label
                  htmlFor="org-name"
                  className="text-sm font-medium leading-none"
                >
                  Organization Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="org-name"
                  type="text"
                  placeholder="e.g., Green Forest Initiative"
                  value={data.organizationName}
                  onChange={(e) => updateData({ organizationName: e.target.value })}
                  className="h-9 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Displayed on your profile
                </p>
              </div>
              {/* Logo upload - right side */}
              <div className="space-y-1.5">
                <div className="flex flex-col items-center gap-2">
                  {logoPreviewUrl ? (
                    <div className="relative">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border bg-muted">
                        <Image
                          src={logoPreviewUrl}
                          alt="Logo preview"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute z-1 -top-2 -right-2 w-5 h-5 bg-foreground/40 backdrop-blur-sm text-background rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={handleOpenLogoEditor}
                    >
                      <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleOpenLogoEditor}
                    className="text-xs h-7 px-2"
                  >
                    {logoPreviewUrl ? "Change" : "Upload"}
                  </Button>
                </div>
              </div>
            </div>

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
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="website"
                    className="text-sm font-medium leading-none flex items-center gap-1"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="text-xs">Website</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleFetchBrandInfo(false)}
                    disabled={!canFetchBrandInfo}
                    className={cn(
                      "p-1 rounded-md transition-colors",
                      canFetchBrandInfo
                        ? "text-primary hover:bg-primary/10 cursor-pointer"
                        : "text-muted-foreground/50 cursor-not-allowed"
                    )}
                    title="Auto-fill from website"
                  >
                    {isFetchingBrandInfo ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://..."
                  value={data.website}
                  onChange={(e) => handleWebsiteChange(e.target.value)}
                  className={cn(
                    "h-9 text-sm",
                    websiteError &&
                    "border-destructive focus-visible:ring-destructive/50"
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
              <div className="flex justify-between text-xs">
                {brandInfoFetched && (
                  <span className="text-muted-foreground">
                    Pre-filled from website
                  </span>
                )}
                <span
                  className={cn(
                    "ml-auto",
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
                  onClick={() => handleGenerateShortDescription()}
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

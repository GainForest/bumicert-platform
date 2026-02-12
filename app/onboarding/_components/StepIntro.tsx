"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboardingStore } from "../store";
import {
  ArrowRight,
  Building2,
  BadgeDollarSign,
  LeafIcon,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

function isValidUrl(url: string): boolean {
  if (!url) return true; // Empty is valid (optional field)
  try {
    const urlToTest = url.startsWith("http") ? url : `https://${url}`;
    const parsed = new URL(urlToTest);
    // Must have a valid hostname with at least one dot (e.g., example.com)
    return parsed.hostname.includes(".");
  } catch {
    return false;
  }
}

export function StepIntro() {
  const { data, updateData, nextStep } = useOnboardingStore();

  const websiteValid = isValidUrl(data.website);
  const canContinue =
    data.organizationName.trim().length > 0 &&
    data.acceptedCodeOfConduct &&
    websiteValid;

  const handleContinue = () => {
    if (canContinue) {
      nextStep();
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Icon with glow */}
        <div className="flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 bg-primary blur-2xl rounded-full animate-pulse" />
          </div>
          <Image src="/assets/media/images/logo.svg" className="brightness-50" alt="Door Open" width={64} height={64} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-serif font-bold">Join GainForest</h1>
        <p className="text-muted-foreground text-center text-pretty max-w-sm">
          Create your organization account and start publishing bumicerts.
        </p>

        {/* Form */}
        <div className="w-full space-y-4 mt-2">
          <div>
            <label
              htmlFor="organization-name"
              className="text-sm font-medium leading-none"
            >
              Organization Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="organization-name"
              type="text"
              placeholder="e.g., Green Forest Initiative"
              value={data.organizationName}
              className="mt-1"
              onChange={(e) => updateData({ organizationName: e.target.value })}
              aria-describedby="org-name-hint"
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="text-sm font-medium leading-none flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              Website
              <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              id="website"
              type="url"
              placeholder="https://your-organization.org"
              value={data.website}
              className="mt-1"
              onChange={(e) => updateData({ website: e.target.value })}
              aria-describedby="website-hint"
            />
            {data.website && !websiteValid && (
              <p className="text-xs text-destructive mt-1">
                Please enter a valid URL (e.g., https://example.com)
              </p>
            )}
          </div>

          <div className="flex items-start space-x-3 mt-10">
            <Checkbox
              id="code-of-conduct"
              checked={data.acceptedCodeOfConduct}
              onCheckedChange={(checked) =>
                updateData({ acceptedCodeOfConduct: checked === true })
              }
              aria-describedby="coc-description"
            />
            <div className="grid gap-1 leading-none">
              <label
                htmlFor="code-of-conduct"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                I agree to the Code of Conduct
              </label>
              <p id="coc-description" className="text-xs text-muted-foreground">
                Please review our{" "}
                <Link
                  href="https://gainforest.notion.site/GainForest-Community-Code-of-Conduct-23094a2f76b380118bc0dfe560df4a2e"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Code of Conduct
                </Link>{" "}
                before continuing.
              </p>
            </div>
          </div>
        </div>

        {/* Continue button */}
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full mt-2"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

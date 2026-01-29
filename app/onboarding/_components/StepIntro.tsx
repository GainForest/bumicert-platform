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
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function StepIntro() {
  const { data, updateData, nextStep } = useOnboardingStore();

  const canContinue =
    data.organizationName.trim().length > 0 && data.acceptedCodeOfConduct;

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

        {/* Features list */}
        <ul className="w-full flex flex-col my-2 gap-1">
          <li className="flex items-start gap-3 bg-muted/40 p-2 rounded-md">
            <div className="h-8 w-8 bg-accent flex items-center justify-center rounded-full shrink-0">
              <Building2 className="size-4 text-primary" />
            </div>
            <span className="mt-1 text-sm">Join 50+ organizations</span>
          </li>
          <li className="flex items-start gap-3 bg-muted/40 p-2 rounded-md">
            <div className="h-8 w-8 bg-accent flex items-center justify-center rounded-full shrink-0">
              <LeafIcon className="size-4 text-primary" />
            </div>
            <span className="mt-1 text-sm">Publish Bumicerts</span>
          </li>
          <li className="flex items-start gap-3 bg-muted/40 p-2 rounded-md">
            <div className="h-8 w-8 bg-accent flex items-center justify-center rounded-full shrink-0">
              <BadgeDollarSign className="size-4 text-primary" />
            </div>
            <span className="mt-1 text-sm">
              Get more donations for the work you do
            </span>
          </li>
        </ul>

        {/* Form */}
        <div className="w-full space-y-4 mt-2">
          <div>
            <label
              htmlFor="organization-name"
              className="text-sm font-medium leading-none"
            >
              Organization Name
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
            <p id="org-name-hint" className="text-xs text-muted-foreground mt-1">
              This will be displayed on your organization profile
            </p>
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
                  href="/code-of-conduct"
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

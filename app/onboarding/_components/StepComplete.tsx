"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "../store";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import Link from "next/link";
import { motion } from "framer-motion";
import { links } from "@/lib/links";
import BumicertIcon from "@/icons/BumicertIcon";

type CompletionState = "idle" | "creating" | "success" | "error";

export function StepComplete() {
  const { data, updateData, setError, error, prevStep } = useOnboardingStore();
  const [completionState, setCompletionState] = useState<CompletionState>(
    data.accountCreated ? "success" : "idle"
  );
  const userDid = data.did;

  // Start account creation when component mounts
  useEffect(() => {
    if (completionState === "idle" && !data.accountCreated) {
      createAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createAccount = async () => {
    setCompletionState("creating");
    setError(null);

    try {
      // Build FormData for the combined onboard API
      const formData = new FormData();
      formData.append("email", data.email.trim().toLowerCase());
      formData.append("password", data.password);
      formData.append("handle", data.handle);
      formData.append("inviteCode", data.inviteCode);
      formData.append("pdsDomain", allowedPDSDomains[0]);
      formData.append("displayName", data.organizationName);
      formData.append("shortDescription", data.shortDescription);
      formData.append("longDescription", data.longDescription);
      formData.append("country", data.country);

      if (data.website) {
        formData.append("website", data.website);
      }
      if (data.startDate) {
        formData.append("startDate", data.startDate);
      }
      if (data.logo) {
        formData.append("logo", data.logo);
      }

      const response = await fetch(links.api.onboarding.onboard, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || "Failed to create account"
        );
      }

      const result = await response.json();
      const { did, handle, organizationInitialized } = result;

      if (!did) {
        throw new Error("Account created but no DID returned");
      }

      // Update store with success data
      updateData({
        did,
        accountCreated: true,
        organizationInitialized: organizationInitialized ?? false,
      });

      setCompletionState("success");
    } catch (err) {
      console.error("Account creation error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setCompletionState("error");
    }
  };

  const handleRetry = () => {
    setCompletionState("idle");
    setError(null);
    createAccount();
  };

  // Render based on completion state
  if (completionState === "creating") {
    return (
      <motion.div
        className="w-full max-w-md mx-auto text-center"
        initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 bg-primary blur-2xl rounded-full animate-pulse" />
            </div>
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-serif font-bold">
              Creating Your Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Please wait while we set up your account and organization...
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (completionState === "error") {
    return (
      <motion.div
        className="w-full max-w-md mx-auto text-center"
        initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 bg-destructive blur-2xl rounded-full opacity-50" />
            </div>
            <XCircle className="w-16 h-16 text-destructive" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-serif font-bold">
              Something Went Wrong
            </h1>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t complete the account setup.
            </p>
          </div>
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg w-full">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <div className="flex gap-3 w-full">
            <Button onClick={prevStep} variant="ghost" className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={handleRetry} className="flex-1">
              Try Again
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Success state
  return (
    <motion.div
      className="w-full max-w-md mx-auto text-center"
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 bg-green-500 blur-2xl rounded-full animate-pulse" />
          </div>
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-serif font-bold">
            Welcome to GainForest!
          </h1>
          <p className="text-sm text-muted-foreground">
            Your account is ready. What would you like to do?
          </p>
        </div>

        <div className="w-full grid gap-3 mt-2">
          <Link href={`/upload/organization/${userDid}`} className="block">
            <Button variant="outline" className="w-full h-auto py-3">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-sm">
                    View My Organization
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Complete your profile
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
          </Link>

          <Link href={links.bumicert.create} className="block">
            <Button className="w-full h-auto py-3">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center shrink-0">
                  <BumicertIcon className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-sm">
                    Create New Bumicert
                  </div>
                  <div className="text-xs opacity-80">
                    Issue project certificates
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-80" />
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

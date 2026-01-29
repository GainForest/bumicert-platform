"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingStore } from "../store";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function StepEmail() {
  const { data, updateData, nextStep, prevStep, setError, error } =
    useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);

  const handleContinue = async () => {
    if (!isValidEmail) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/atproto/invite-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: "insecure",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      const result = await response.json();
      const inviteCode = result.invites?.[0]?.inviteCode;

      if (!inviteCode) {
        throw new Error("No invite code");
      }

      updateData({ inviteCode });
      nextStep();
    } catch {
      setError("Something went wrong. Please try a different email.");
    } finally {
      setIsLoading(false);
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
      <div className="flex flex-col items-center gap-4">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-serif font-bold">Verify Your Email</h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ll use your email to create your account.
          </p>
        </div>

        {/* Form */}
        <div className="w-full space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@organization.com"
              value={data.email}
              onChange={(e) => {
                updateData({ email: e.target.value });
                setError(null);
              }}
              disabled={isLoading}
              aria-describedby="email-hint"
            />
            <p id="email-hint" className="text-xs text-muted-foreground">
              This email will be associated with your organization account
            </p>
          </div>

          {/* Error display */}
          {error && (
            <div
              className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
              role="alert"
            >
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="w-full flex justify-between mt-2">
          <Button onClick={prevStep} variant="ghost" disabled={isLoading}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleContinue} disabled={!isValidEmail || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useOnboardingStore,
  calculatePasswordStrength,
  PasswordStrength,
} from "../store";
import { ArrowLeft, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { motion } from "framer-motion";

const STRENGTH_COLORS: Record<PasswordStrength, string> = {
  weak: "bg-red-500",
  fair: "bg-orange-500",
  good: "bg-yellow-500",
  strong: "bg-green-500",
};

const STRENGTH_LABELS: Record<PasswordStrength, string> = {
  weak: "Weak",
  fair: "Fair",
  good: "Good",
  strong: "Strong",
};

const STRENGTH_WIDTH: Record<PasswordStrength, string> = {
  weak: "w-1/4",
  fair: "w-2/4",
  good: "w-3/4",
  strong: "w-full",
};

export function StepCredentials() {
  const { data, updateData, nextStep, prevStep, error, setError } = useOnboardingStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDev = process.env.NODE_ENV !== "production";

  const passwordAnalysis = useMemo(
    () => calculatePasswordStrength(data.password),
    [data.password]
  );

  const passwordsMatch =
    data.password.length > 0 && data.password === data.confirmPassword;
  const passwordsDontMatch =
    data.confirmPassword.length > 0 && data.password !== data.confirmPassword;

  // In dev mode, only require password to not be empty (no strength/length requirements)
  const isPasswordValid = isDev
    ? data.password.length > 0
    : passwordAnalysis.strength !== "weak" && data.password.length >= 8;

  const canContinue =
    data.handle.trim().length > 0 && isPasswordValid && passwordsMatch;

  const handleContinue = () => {
    if (!canContinue) {
      if (!data.handle.trim()) {
        setError("Please enter a handle");
      } else if (!isPasswordValid) {
        setError("Please choose a stronger password");
      } else if (!passwordsMatch) {
        setError("Passwords do not match");
      }
      return;
    }
    setError(null);
    nextStep();
  };

  const handleHandleChange = (value: string) => {
    // Normalize handle: lowercase, remove special chars except hyphens, no leading/trailing hyphens
    const normalized = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
      .replace(/-+/g, "-");
    updateData({ handle: normalized });
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
          <h1 className="text-2xl font-serif font-bold">Create Your Account</h1>
          <p className="text-sm text-muted-foreground">
            Choose your handle and set a secure password.
          </p>
        </div>

        {/* Form */}
        <div className="w-full space-y-4">
          {/* Handle */}
          <div className="space-y-1.5">
            <label
              htmlFor="handle"
              className="text-sm font-medium leading-none"
            >
              Handle <span className="text-destructive">*</span>
            </label>
            <div className="flex">
              <Input
                id="handle"
                type="text"
                placeholder="your-organization"
                value={data.handle}
                onChange={(e) => handleHandleChange(e.target.value)}
                className="rounded-r-none h-9"
                aria-describedby="handle-hint"
              />
              <div className="flex items-center px-2 bg-muted border border-l-0 rounded-r-md text-xs text-muted-foreground">
                .{allowedPDSDomains[0]}
              </div>
            </div>
            <p id="handle-hint" className="text-xs text-muted-foreground">
              Your handle:{" "}
              <span className="font-medium text-foreground">
                @{data.handle || "handle"}.{allowedPDSDomains[0]}
              </span>
            </p>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              Password <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter a secure password"
                value={data.password}
                onChange={(e) => updateData({ password: e.target.value })}
                className="pr-10 h-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password strength indicator */}
            {data.password.length > 0 && (
              <div className="space-y-1.5">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      STRENGTH_COLORS[passwordAnalysis.strength],
                      STRENGTH_WIDTH[passwordAnalysis.strength]
                    )}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={cn(
                      "font-medium",
                      passwordAnalysis.strength === "weak" && "text-red-500",
                      passwordAnalysis.strength === "fair" && "text-orange-500",
                      passwordAnalysis.strength === "good" && "text-yellow-600",
                      passwordAnalysis.strength === "strong" && "text-green-500"
                    )}
                  >
                    {STRENGTH_LABELS[passwordAnalysis.strength]}
                  </span>
                  {isDev && (
                    <span className="text-muted-foreground italic text-[10px]">
                      (Check disabled in dev)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirm-password"
              className="text-sm font-medium leading-none"
            >
              Confirm Password <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat your password"
                value={data.confirmPassword}
                onChange={(e) =>
                  updateData({ confirmPassword: e.target.value })
                }
                className={cn(
                  "pr-10 h-9",
                  passwordsMatch &&
                    "border-green-500 focus-visible:ring-green-500/50",
                  passwordsDontMatch &&
                    "border-destructive focus-visible:ring-destructive/50"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password match indicator */}
            {data.confirmPassword.length > 0 && (
              <p
                className={cn(
                  "text-xs flex items-center gap-1",
                  passwordsMatch ? "text-green-500" : "text-destructive"
                )}
              >
                {passwordsMatch ? (
                  <>Passwords match</>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    Passwords do not match
                  </>
                )}
              </p>
            )}
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
            Create Account
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

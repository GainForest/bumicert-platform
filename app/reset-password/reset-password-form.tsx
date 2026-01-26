"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  CheckCircle2,
  EyeIcon,
  EyeOffIcon,
  KeyRound,
  Loader2,
  LockIcon,
  MailIcon,
} from "lucide-react";
import Link from "next/link";

export default function ResetPasswordForm({
  initialToken,
}: {
  initialToken?: string;
}) {
  const [step, setStep] = useState<"email" | "reset" | "success">(
    initialToken ? "reset" : "email"
  );
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState(initialToken ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 1: Request password reset email
  const {
    mutate: requestPasswordReset,
    isPending: isRequestingReset,
    error: requestError,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/atproto/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err?.message ?? err?.error ?? "Failed to send reset email"
        );
      }

      return await res.json();
    },
    onSuccess: () => {
      setStep("reset");
    },
  });

  // Step 2: Reset password with code
  const {
    mutate: resetPassword,
    isPending: isResettingPassword,
    error: resetError,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/atproto/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetCode.trim(), password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err?.message ?? err?.error ?? "Failed to reset password"
        );
      }

      return await res.json();
    },
    onSuccess: () => {
      setStep("success");
    },
  });

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && !isRequestingReset) {
      requestPasswordReset();
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      resetCode.trim() &&
      password &&
      password === confirmPassword &&
      !isResettingPassword
    ) {
      resetPassword();
    }
  };

  const isValidPassword = password.length >= 8;
  const passwordsMatch = password === confirmPassword;

  // Step 3: Success
  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-green-100 p-4 mb-4 dark:bg-green-900/30">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Password Reset!</h1>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully reset. You can now sign in
                with your new password.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-full"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Enter reset code and new password
  if (step === "reset") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Enter Reset Code</h1>
              <p className="text-muted-foreground mt-1">
                {email
                  ? `Check ${email} for your reset code`
                  : "Enter the code from your email"}
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="resetCode" className="text-sm font-medium">
                  Reset Code
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <input
                    id="resetCode"
                    type="text"
                    placeholder="XXXXX-XXXXX"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.toUpperCase())}
                    disabled={isResettingPassword}
                    className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm font-mono tracking-wider ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <LockIcon className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isResettingPassword}
                    className="w-full h-10 pl-10 pr-10 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {password && !isValidPassword && (
                  <p className="text-xs text-destructive">
                    Password must be at least 8 characters
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <LockIcon className="h-4 w-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isResettingPassword}
                    className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-destructive">
                    Passwords do not match
                  </p>
                )}
              </div>

              {resetError && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {(resetError as Error)?.message}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  !resetCode.trim() ||
                  !password ||
                  !confirmPassword ||
                  !passwordsMatch ||
                  !isValidPassword ||
                  isResettingPassword
                }
                className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isResettingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setStep("email");
                  setResetCode("");
                }}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Need a new code? Request again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Enter email
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground mt-1">
              Enter your email to receive a reset code
            </p>
          </div>

          <form onSubmit={handleRequestReset} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <MailIcon className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isRequestingReset}
                  className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {requestError && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {(requestError as Error)?.message}
              </div>
            )}

            <button
              type="submit"
              disabled={!email.trim() || isRequestingReset}
              className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isRequestingReset ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Already have a code?
            </p>
            <button
              onClick={() => setStep("reset")}
              className="text-sm text-primary hover:underline"
            >
              Enter reset code
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import React, { useState } from "react";
import {
  CheckCircle2,
  EyeIcon,
  EyeOffIcon,
  KeyRound,
  Loader2,
  LockIcon,
  MailIcon,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useModal } from "@/components/ui/modal/context";

export const ForgotPasswordModalId = "auth/forgot-password";

type Step = "email" | "reset" | "success";

const ForgotPasswordModal = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { popModal, stack } = useModal();

  // Step 1: Request password reset email
  const {
    mutate: requestPasswordReset,
    isPending: isRequestingReset,
    error: requestError,
    reset: resetRequestError,
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

  const handleRequestReset = () => {
    if (email.trim() && !isRequestingReset) {
      requestPasswordReset();
    }
  };

  const handleResetPassword = () => {
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
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Password Reset!</ModalTitle>
          <ModalDescription>
            Your password has been successfully changed
          </ModalDescription>
        </ModalHeader>

        <div className="flex flex-col items-center gap-4 py-6">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-[280px]">
            You can now sign in with your new password.
          </p>
        </div>

        <ModalFooter>
          <Button onClick={() => popModal()}>Back to Sign In</Button>
        </ModalFooter>
      </ModalContent>
    );
  }

  // Step 2: Enter reset code and new password
  if (step === "reset") {
    return (
      <ModalContent>
        <ModalHeader
          backAction={() => {
            setStep("email");
            setResetCode("");
            setPassword("");
            setConfirmPassword("");
            resetRequestError();
          }}
        >
          <ModalTitle>Enter Reset Code</ModalTitle>
          <ModalDescription>
            Check your email for the reset code
          </ModalDescription>
        </ModalHeader>

        <div className="flex flex-col gap-3 mt-4">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">
              We sent a code to <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm">Reset Code</span>
            <InputGroup>
              <InputGroupAddon>
                <KeyRound className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="XXXXX-XXXXX"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.toUpperCase())}
                disabled={isResettingPassword}
                className="font-mono tracking-wider"
              />
            </InputGroup>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm">New Password</span>
            <InputGroup>
              <InputGroupAddon>
                <LockIcon className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Enter new password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isResettingPassword}
              />
              <InputGroupAddon align="inline-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-transparent cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeOffIcon className="h-4 w-4" />
                  )}
                </Button>
              </InputGroupAddon>
            </InputGroup>
            {password && !isValidPassword && (
              <span className="text-xs text-destructive">
                Password must be at least 8 characters
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm">Confirm Password</span>
            <InputGroup>
              <InputGroupAddon>
                <LockIcon className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Confirm new password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isResettingPassword}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleResetPassword();
                  }
                }}
              />
            </InputGroup>
            {confirmPassword && !passwordsMatch && (
              <span className="text-xs text-destructive">
                Passwords do not match
              </span>
            )}
          </div>
        </div>

        <ModalFooter>
          {resetError && (
            <span className="text-sm text-destructive">
              {(resetError as Error)?.message}
            </span>
          )}
          <Button
            disabled={
              !resetCode.trim() ||
              !password ||
              !confirmPassword ||
              !passwordsMatch ||
              !isValidPassword ||
              isResettingPassword
            }
            onClick={handleResetPassword}
          >
            {isResettingPassword ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    );
  }

  // Step 1: Enter email
  return (
    <ModalContent>
      <ModalHeader
        backAction={
          stack.length === 1
            ? undefined
            : () => {
                popModal();
              }
        }
      >
        <ModalTitle>Reset Password</ModalTitle>
        <ModalDescription>
          Enter your email and we&apos;ll send you a reset code
        </ModalDescription>
      </ModalHeader>

      <div className="flex flex-col gap-3 mt-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm">Enter your email address</span>
          <InputGroup>
            <InputGroupAddon>
              <MailIcon className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="user@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isRequestingReset}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRequestReset();
                }
              }}
            />
          </InputGroup>
        </div>
      </div>

      <ModalFooter>
        {requestError && (
          <span className="text-sm text-destructive">
            {(requestError as Error)?.message}
          </span>
        )}
        <Button
          disabled={email.trim() === "" || isRequestingReset}
          onClick={handleRequestReset}
        >
          {isRequestingReset ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Send Reset Code"
          )}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default ForgotPasswordModal;
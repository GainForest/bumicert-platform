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
  DoorOpenIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2,
  LockIcon,
  MailIcon,
  User2,
  Check,
  ArrowRight,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useModal } from "@/components/ui/modal/context";
import { GetAnInviteModal, GetAnInviteModalId } from "./get-an-invite";
import SignInModal, { SignInModalId } from "./sign-in";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { useAtprotoStore } from "@/components/stores/atproto";

export const SignUpModalId = "auth/sign-up";

const SignUpModal = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { popModal, stack, pushModal } = useModal();
  const auth = useAtprotoStore((state) => state.auth);

  const {
    mutate: handleSignUp,
    isPending: isSigningUp,
    isSuccess: isSignUpSuccess,
    error: signUpError,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/atproto/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          handle: handle.replace(/^@/, "").trim() + `.${allowedPDSDomains[0]}`,
          inviteCode,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch();
        console.error(err);
        throw new Error(
          err?.message ?? err?.error ?? "Failed to create account"
        );
      }

      return await res.json();
    },
  });

  const isAuthenticated = auth.authenticated;
  if (isAuthenticated) {
    return (
      <ModalContent>
        <ModalHeader>Already Signed In</ModalHeader>
        <ModalDescription>
          You are already signed in to your account.
        </ModalDescription>
      </ModalContent>
    );
  }

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
        <ModalTitle>Register</ModalTitle>
        <ModalDescription>
          Fill the following details to register.
        </ModalDescription>
      </ModalHeader>
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex flex-col gap-1 bg-accent/20 border-2 border-primary/40 p-2 rounded-lg">
          <span className="text-sm">Enter your invite code</span>
          <InputGroup className="bg-background">
            <InputGroupAddon>
              <DoorOpenIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="abcdefghij"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              disabled={isSigningUp}
            />
          </InputGroup>
          <span className="text-xs text-muted-foreground">
            Don&apos;t have an invite code yet?{" "}
            <button
              className="text-primary font-medium cursor-pointer"
              onClick={() => {
                pushModal({
                  id: GetAnInviteModalId,
                  content: <GetAnInviteModal />,
                });
              }}
            >
              Get an invite code
            </button>{" "}
            now.
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm">Enter your email</span>
          <InputGroup>
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSigningUp}
            />
          </InputGroup>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm">Type your desired handle</span>
          <InputGroup>
            <InputGroupAddon>
              <User2 />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="john-doe"
              value={handle}
              onChange={(e) => setHandle(e.target.value.split(".")[0].trim())}
              disabled={isSigningUp}
            />
            <InputGroupAddon align="inline-end" className="text-primary">
              .climateai.org
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm">Secure Password</span>
          <InputGroup>
            <InputGroupAddon>
              <LockIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSigningUp}
              type={showPassword ? "text" : "password"}
            />
            <InputGroupAddon align="inline-end" className="text-primary">
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer"
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm">Secure Password</span>
          <InputGroup>
            <InputGroupAddon>
              <LockIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSigningUp}
              type={showPassword ? "text" : "password"}
            />
            <InputGroupAddon align="inline-end" className="text-primary">
              <Button
                variant="link"
                size="sm"
                className="cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <ModalFooter>
        <span className="text-sm text-destructive">
          {(signUpError as Error | undefined)?.message}
        </span>
        <Button
          disabled={
            email.trim() === "" ||
            inviteCode.trim() === "" ||
            handle.trim() === "" ||
            password === "" ||
            confirmPassword === "" ||
            password !== confirmPassword ||
            isSigningUp ||
            isAuthenticated
          }
          onClick={() => {
            if (isSignUpSuccess) {
              pushModal(
                {
                  id: SignInModalId,
                  content: (
                    <SignInModal
                      initialHandle={`${handle}.${allowedPDSDomains[0]}`}
                    />
                  ),
                },
                true
              );
            } else {
              handleSignUp();
            }
          }}
        >
          {isSigningUp || isAuthenticated ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isSignUpSuccess ? (
            <Check />
          ) : null}
          {isSigningUp
            ? "Signing up..."
            : isSignUpSuccess
            ? "Done! Continue to sign in?"
            : "Sign up"}
          {isSignUpSuccess && <ArrowRight />}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default SignUpModal;

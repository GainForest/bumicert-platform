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
import { Check, KeyIcon, Loader2, LockIcon, MailIcon } from "lucide-react";
import { useAtproto } from "@/components/providers/AtprotoProvider";
import { useQuery } from "@tanstack/react-query";
import { useModal } from "@/components/ui/modal/context";

export const SignUpModalId = "sign-up-modal";

const sendSignUpOtp = async (email: string, inviteCode: string) => {
  console.log("Sending sign up OTP for", email, inviteCode);
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

const SignUpModal = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { popModal, stack } = useModal();
  const { isReady, initializationError, isAuthenticated } = useAtproto();

  const {
    data: isOtpSent,
    isLoading: isSendingOtp,
    error: otpSendingError,
    refetch: sendOtp,
  } = useQuery({
    queryKey: ["send-sign-up-otp", email, inviteCode],
    queryFn: async () => {
      return await sendSignUpOtp(email, inviteCode);
    },
    enabled: false,
  });

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
          stack.length === 1 ?
            undefined
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
              disabled={!isReady || isSendingOtp}
            />
          </InputGroup>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm">Enter your invite code</span>
          <InputGroup>
            <InputGroupAddon>
              <KeyIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="INVITE123"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              disabled={!isReady || isSendingOtp}
            />
          </InputGroup>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm">Enter your password</span>
          <InputGroup>
            <InputGroupAddon>
              <LockIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!isReady || isSendingOtp}
            />
          </InputGroup>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm">Confirm your password</span>
          <InputGroup>
            <InputGroupAddon>
              <LockIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!isReady || isSendingOtp}
            />
          </InputGroup>
        </div>
      </div>
      <ModalFooter>
        <span className="text-sm text-destructive">
          {otpSendingError?.message ?? initializationError?.message}
        </span>
        <Button
          disabled={
            email === "" || inviteCode === "" || isSendingOtp || !isReady
          }
          onClick={() => {
            sendOtp();
          }}
        >
          {isOtpSent ?
            <Check />
          : isSendingOtp || !isReady ?
            <Loader2 className="size-4 animate-spin" />
          : null}
          {!isReady ?
            "Getting ready..."
          : isOtpSent ?
            "OTP sent successfully"
          : isSendingOtp ?
            "Sending OTP..."
          : "Send OTP"}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default SignUpModal;

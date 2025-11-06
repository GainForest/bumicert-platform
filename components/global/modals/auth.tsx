import { Button } from "@/components/ui/button";
import {
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import React from "react";
import {
  ChevronRight,
  LogInIcon,
  LucideIcon,
  UserPlusIcon,
} from "lucide-react";
import SignInModal, { SignInModalId } from "./sign-in";
import { useModal } from "@/components/ui/modal/context";
import SignUpModal, { SignUpModalId } from "./sign-up";
import { useAtprotoStore } from "@/components/stores/atproto";

export const AuthModalId = "auth/main";

const Action = ({
  Icon,
  title,
  description,
  onClick,
}: {
  Icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}) => {
  return (
    <Button
      variant={"secondary"}
      className="flex flex-col h-auto rounded-xl px-2 py-2"
      onClick={onClick}
    >
      <div className="w-full h-20 bg-background rounded-xl flex items-center justify-center">
        <Icon className="size-10 text-primary" />
      </div>
      <div className="flex items-center justify-between w-full px-2">
        <div className="flex flex-col items-start">
          <span className="font-medium text-base">{title}</span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>

        <ChevronRight />
      </div>
    </Button>
  );
};

const AuthModal = () => {
  const { pushModal } = useModal();
  const auth = useAtprotoStore((state) => state.auth);
  if (auth.authenticated) {
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
      <ModalHeader>
        <ModalTitle>Sign in or Register</ModalTitle>
        <ModalDescription>Choose an option to continue.</ModalDescription>
      </ModalHeader>
      <div className="flex flex-col gap-2 mt-6">
        <Action
          Icon={LogInIcon}
          title="I already have an account."
          description="Continue to sign in."
          onClick={() => {
            pushModal({
              id: SignInModalId,
              content: <SignInModal />,
            });
          }}
        />
        <Action
          Icon={UserPlusIcon}
          title="I don't have an account."
          description="Continue to register with invite code."
          onClick={() => {
            pushModal({
              id: SignUpModalId,
              content: <SignUpModal />,
            });
          }}
        />
      </div>
    </ModalContent>
  );
};

export default AuthModal;

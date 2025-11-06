import { useModal } from "@/components/ui/modal/context";
import {
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { CircleCheckIcon } from "lucide-react";
import React from "react";

const AuthenticatedModalContent = ({
  message = "You are already signed in.",
}: {
  message?: string;
}) => {
  const { stack, popModal } = useModal();
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
        <ModalTitle></ModalTitle>
        <ModalDescription></ModalDescription>
      </ModalHeader>
      <CircleCheckIcon className="size-20 text-primary" />
      <span className="text-lg font-medium">Signed in</span>
      <span className="text-sm text-muted-foreground">{message}</span>
    </ModalContent>
  );
};

export default AuthenticatedModalContent;

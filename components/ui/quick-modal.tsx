"use client";

import { ChevronLeft } from "lucide-react";
import {
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "./modal/modal";
import { useModal } from "./modal/context";
import { Button } from "./button";

const QuickModal = ({
  title,
  description,
  footer,
  dismissible = false,
  showBackButton = true,
  children,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  footer?: React.ReactNode;
  dismissible?: boolean;
  showBackButton?: boolean;
  children: React.ReactNode;
}) => {
  const { stack, popModal } = useModal();
  return (
    <ModalContent dismissible={dismissible}>
      <div className="w-full flex items-center gap-3">
        {showBackButton && stack.length > 1 && (
          <Button
            variant={"secondary"}
            size={"icon"}
            className="rounded-full p-0 h-6 w-6"
            onClick={() => {
              popModal();
            }}
          >
            <ChevronLeft />
          </Button>
        )}
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
        </ModalHeader>
      </div>
      {children}
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </ModalContent>
  );
};

export default QuickModal;

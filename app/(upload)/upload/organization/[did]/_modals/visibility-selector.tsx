"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { cn } from "@/lib/utils";
import { Globe2, LockIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

export const VisibilitySelectorModalId = "visibility-selector-modal";

const VisibilitySelectorModal = ({
  initialVisibility,
  onVisibilityChange,
}: {
  initialVisibility: "Public" | "Hidden";
  onVisibilityChange: (visibility: "Public" | "Hidden") => void;
}) => {
  const [visibility, setVisibility] = useState(initialVisibility);
  const { popModal, stack, hide } = useModal();
  const handleDone = (visibility: "Public" | "Hidden") => {
    onVisibilityChange(visibility);
    if (stack.length === 1) {
      hide().then(() => {
        popModal();
      });
    } else {
      popModal();
    }
  };
  useEffect(() => {
    setVisibility(initialVisibility);
  }, [initialVisibility]);
  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>Select Visibility</ModalTitle>
        <ModalDescription>
          Select the visibility for your organization.
        </ModalDescription>
      </ModalHeader>
      <div className="flex flex-col gap-2 mt-4">
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-auto flex items-start justify-start text-wrap",
            visibility === "Public" &&
              "border-primary text-primary bg-accent/50"
          )}
          onClick={() => setVisibility("Public")}
        >
          <Globe2 className="size-6 opacity-40 mt-2" />
          <div className="flex flex-col items-start flex-1">
            <span className="text-lg font-medium">Public</span>
            <span className="text-sm text-muted-foreground text-wrap text-left">
              Anyone can view your organization and its details. Your
              information will be visible to all users, making it easy for
              people to discover and learn more about your organization.
            </span>
          </div>
        </Button>
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-auto flex items-start justify-start text-wrap",
            visibility === "Hidden" &&
              "border-primary text-primary bg-accent/50"
          )}
          onClick={() => setVisibility("Hidden")}
        >
          <LockIcon className="size-6 opacity-40 mt-2" />
          <div className="flex flex-col items-start">
            <span className="text-lg font-medium">Hidden</span>
            <span className="text-sm text-muted-foreground text-wrap text-left">
              Only you can view your organization and its details on the
              platform. Your organization&apos;s information will be hidden from
              all other users.
            </span>
          </div>
        </Button>
      </div>
      <ModalFooter className="mt-4 flex justify-end">
        <Button onClick={() => handleDone(visibility)}>Done</Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default VisibilitySelectorModal;

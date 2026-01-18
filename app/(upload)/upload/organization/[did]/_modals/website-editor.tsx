"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal/modal";
import { useModal } from "@/components/ui/modal/context";

export const WebsiteEditorModalId = "website-editor-modal";

const WebsiteEditorModal = ({
  initialWebsite = "",
  onWebsiteChange,
}: {
  initialWebsite?: string;
  onWebsiteChange: (website: string) => void;
}) => {
  const [website, setWebsite] = useState(initialWebsite);
  const { popModal, stack, hide } = useModal();
  const handleDone = (website: string) => {
    onWebsiteChange(website);
    if (stack.length === 1) {
      hide().then(() => {
        popModal();
      });
    } else {
      popModal();
    }
  };
  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>Edit Website</ModalTitle>
        <ModalDescription>
          Enter your organization&apos;s website URL.
        </ModalDescription>
      </ModalHeader>
      <div className="flex flex-col gap-4 mt-4">
        <Input
          placeholder="https://example.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <ModalFooter className="mt-4 flex justify-end">
        <Button onClick={() => handleDone(website)} type="button">
          Done
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default WebsiteEditorModal;

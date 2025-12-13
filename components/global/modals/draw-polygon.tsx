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
import React, { useCallback, useState } from "react";
import { Loader2, LockIcon, X } from "lucide-react";
import useLocalStorage from "use-local-storage";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/ui/modal/context";
import { useAtprotoStore } from "@/components/stores/atproto";
import AuthenticatedModalContent from "./authenticated";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { VisuallyHidden } from "radix-ui";

export const DrawPolygonModalId = "draw-polygon";

const DrawPolygonModal = () => {
  const { popModal, stack, hide } = useModal();

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
        <VisuallyHidden.Root>
          <ModalTitle>Sign In</ModalTitle>
          <ModalDescription>Provide your handle to continue</ModalDescription>
        </VisuallyHidden.Root>
      </ModalHeader>
      <ModalFooter>
        <Button>Done</Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default DrawPolygonModal;

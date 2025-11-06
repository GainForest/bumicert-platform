import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import { useMutation } from "@tanstack/react-query";
import { useOrganizationPageStore } from "../store";
import { Check, Loader2 } from "lucide-react";

export const SaveInfoModalId = "save-info-modal";

export const SaveInfoModal = () => {
  const { stack, popModal, hide } = useModal();
  const saveAllEditingData = useOrganizationPageStore(
    (actions) => actions.saveAllEditingData
  );
  const {
    mutate: saveInfo,
    isPending,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: saveAllEditingData,
    onSuccess: () => {
      hide().then(() => {
        popModal();
      });
    },
  });
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
        <ModalTitle>Save Information</ModalTitle>
        <ModalDescription>
          Save the information for your organization.
        </ModalDescription>
      </ModalHeader>
      <span className="font-medium">
        Are you sure you want to update the information about this organization?
      </span>
      {error && <span className="text-red-500">{error.message}</span>}
      <ModalFooter>
        <Button disabled={isPending || isSuccess} onClick={() => saveInfo()}>
          {isPending && <Loader2 className="animate-spin" />}
          {isSuccess && <Check />}
          {isSuccess ?
            "Saved"
          : isPending ?
            "Saving..."
          : "Save"}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

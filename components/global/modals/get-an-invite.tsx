import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { useModal } from "@/components/ui/modal/context";
import { DoorOpenIcon, MailIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

export const GetAnInviteModalId = "auth/get-an-invite";

export const GetAnInviteModal = () => {
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
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 bg-primary blur-2xl rounded-full animate-pulse"></div>
          </div>
          <DoorOpenIcon className="size-20 text-primary" />
        </div>
        <h1 className="text-3xl font-serif font-bold">Join GainForest</h1>
        <span className="text-base text-muted-foreground font-medium text-center text-pretty">
          GainForest is invite-only right now. Apply for an invite code to get
          started!
        </span>
        <div className="flex flex-col gap-2 w-full mt-6">
          <InputGroup>
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Email" />
          </InputGroup>
        </div>
      </div>
      <span className="block w-full text-xs text-center text-pretty text-muted-foreground mt-1">
        Enter your email and we&apos;ll get back to you with invite code.
      </span>
      <ModalFooter>
        <Button>Apply</Button>
      </ModalFooter>
    </ModalContent>
  );
};

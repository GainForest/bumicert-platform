import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { useModal } from "@/components/ui/modal/context";
import {
  BuildingIcon,
  DoorOpenIcon,
  MailIcon,
  MessageSquareIcon,
  ArrowRight,
  ChevronRight,
  LeafIcon,
  BadgeDollarSign,
  CircleCheck,
  Loader2,
  SendIcon,
  SendHorizonalIcon,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  OnboardingData,
  onboardingDataSchema,
} from "@/app/api/airtable/onboarding/schema";
import { links } from "@/lib/links";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const GetAnInviteModalId = "auth/get-an-invite";
export const GetAnInviteModal = () => {
  const { stack, popModal, pushModal } = useModal();
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
        <ul className="w-full flex flex-col my-2 gap-2">
          <li className="flex items-start gap-4">
            <div className="h-8 w-8 bg-accent flex items-center justify-center rounded-full">
              <BuildingIcon className="size-4 text-primary" />
            </div>
            <span className="mt-1">Join 50+ organizations</span>
          </li>
          <li className="flex items-start gap-4">
            <div className="h-8 w-8 bg-accent flex items-center justify-center rounded-full">
              <LeafIcon className="size-4 text-primary" />
            </div>
            <span className="mt-1">Publish Bumicerts</span>
          </li>
          <li className="flex items-start gap-4">
            <div className="h-8 w-8 bg-accent flex items-center justify-center rounded-full">
              <BadgeDollarSign className="size-4 text-primary" />
            </div>
            <span className="mt-1">
              Get more donations for the work you do.
            </span>
          </li>
        </ul>
        <span className="text-base text-muted-foreground font-medium text-center text-pretty my-2">
          GainForest is invite-only right now. Apply for an invite code to get
          started!
        </span>
        {/* <div className="flex flex-col gap-2 w-full mt-6">
          <InputGroup>
            <InputGroupAddon>
              <BuildingIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Organization Name" />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Email" />
          </InputGroup>
          <Textarea placeholder="Write a few words about your organization and why you want to join GainForest." />
        </div> */}
      </div>
      <ModalFooter>
        <Button
          onClick={() =>
            pushModal({
              id: "auth/get-an-invite/onboarding-form",
              content: <OnboardingFormModal />,
            })
          }
        >
          Apply Now <ChevronRight />
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

const OnboardingFormModal = () => {
  const { stack, popModal, hide } = useModal();

  const {
    mutate,
    isPending,
    isSuccess: success,
    error,
  } = useMutation({
    mutationFn: async (formData: FormData) => {
      const organizationName = formData.get("organizationName") as string;
      const email = formData.get("email") as string;
      const message = formData.get("message") as string;
      if (!organizationName || !email || !message) {
        throw new Error("Please fill in all fields.");
      }
      const onboardingData: OnboardingData = {
        organizationName,
        email,
        about: message,
      };
      const validationResult = onboardingDataSchema.safeParse(onboardingData);
      if (!validationResult.success) {
        throw new Error(validationResult.error.message);
      }
      const response = await fetch(links.api.onboarding, {
        method: "POST",
        body: JSON.stringify(onboardingData),
      });
      if (!response.ok) {
        throw new Error("Failed to submit onboarding data");
      }
      const data: {
        success: boolean;
        message: string;
      } = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      return true;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    console.log(formData);
    mutate(formData);
  };
  return (
    <ModalContent>
      <ModalHeader
        backAction={
          stack.length === 1 || success
            ? undefined
            : () => {
                popModal();
              }
        }
      >
        <ModalTitle></ModalTitle>
        <ModalDescription></ModalDescription>
      </ModalHeader>
      <AnimatePresence>
        {!success ? (
          <motion.form
            className="flex flex-col items-center gap-2"
            exit={{ opacity: 0, filter: "blur(10px)", scale: 0.5 }}
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 bg-primary blur-xl rounded-full"></div>
              </div>
              <DoorOpenIcon className="size-10 text-primary" />
            </div>
            <h1 className="text-xl font-serif font-bold">Join GainForest</h1>

            <div className="flex flex-col gap-2 w-full mt-2">
              <InputGroup>
                <InputGroupAddon>
                  <BuildingIcon />
                </InputGroupAddon>
                <InputGroupInput
                  name="organizationName"
                  placeholder="Organization Name"
                />
              </InputGroup>
              <InputGroup>
                <InputGroupAddon>
                  <MailIcon />
                </InputGroupAddon>
                <InputGroupInput
                  type="email"
                  name="email"
                  placeholder="Email"
                />
              </InputGroup>
              <Textarea
                name="message"
                className="min-h-24"
                placeholder="Write a few words about your organization and why you want to join GainForest."
              />
            </div>
            {error && (
              <div className="text-red-500 w-full text-left text-sm">
                {error.message}
              </div>
            )}
            <ModalFooter className="w-full">
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <SendHorizonalIcon />
                )}
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </ModalFooter>
          </motion.form>
        ) : (
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, filter: "blur(10px)", scale: 0.5 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          >
            <div className="flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 bg-primary blur-2xl rounded-full animate-pulse"></div>
              </div>
              <CircleCheck className="size-20 text-primary" />
            </div>
            <h1 className="text-2xl font-serif font-bold mt-2">
              Submitted Successfully!
            </h1>
            <p className="text-center text-muted-foreground font-medium text-pretty">
              Your application has been submitted successfully. We will review
              it and get back to you shortly!
            </p>
            <ModalFooter className="w-full">
              <Button
                onClick={() => {
                  hide().then(() => {
                    popModal();
                  });
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalContent>
  );
};

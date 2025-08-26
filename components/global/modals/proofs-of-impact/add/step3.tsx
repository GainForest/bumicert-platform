import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import { ModalFooter } from "@/components/ui/modal/modal";
import { RefreshCcw } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import useAccount from "@/hooks/use-account";
import SignInDesktopButton from "@/components/global/Header/SignInDesktopButton";
import useAddPoiStore from "./store";
import QuickModal from "@/components/ui/quick-modal";
import ModalErrorBody from "@/components/modal-error-body";
import { useHypercertExchangeClient } from "@/components/providers/HypercertExchangeClientProvider";
import useAddPoiProgressStore, {
  ADD_POI_PROGRESS_STEPS,
} from "./progress-store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";
import { useEthersSigner } from "@/hooks/use-ethers-signer";

const PreRequisites = () => {
  const { stack } = useModal();
  return (
    <QuickModal
      dismissible={stack.length === 1}
      title="Add Proof of Impact"
      description="Sign in to continue"
    >
      <div className="h-36 flex items-center justify-cetner bg-muted rounded-lg">
        <SignInDesktopButton />
      </div>
    </QuickModal>
  );
};

export const AddProofsOfImpactStep3ModalId = "proofs-of-impact-add-step-3";
const AddProofsOfImpactStep3 = () => {
  const { stack, hide, popModal, clear } = useModal();
  const { authenticated } = useAccount();
  const { step1State, step2State } = useAddPoiStore();
  const hcExchangeClient = useHypercertExchangeClient();
  const signer = useEthersSigner();
  const { start, errorState, currentStepIndex, status, reset } =
    useAddPoiProgressStore();

  const handleStart = useCallback(() => {
    if (
      !step1State ||
      !step2State ||
      !authenticated ||
      !hcExchangeClient ||
      !signer
    )
      return;
    start(hcExchangeClient, signer, step1State.ecocertId, {
      title: step1State.title,
      description: step1State.description,
      sources: step2State.sources,
    });
  }, [step1State, step2State, authenticated, hcExchangeClient, signer]);

  const handleBack = useCallback(() => {
    if (status === "success") {
      reset();
    }
    popModal();
  }, [status, reset, popModal]);

  useEffect(() => {
    if (currentStepIndex !== 0 || status !== "pending") return;
    handleStart();
  }, [currentStepIndex, status, handleStart]);

  if (!step1State || !step2State) {
    return (
      <QuickModal
        title="Add Proof of Impact"
        description="Something is wrong."
        dismissible={stack.length === 1}
      >
        <ModalErrorBody
          ctaText={stack.length > 1 ? "Go back" : "Close"}
          ctaAction={() => {
            if (stack.length === 1) hide();
            popModal();
          }}
        />
      </QuickModal>
    );
  }

  if (!authenticated) {
    return <PreRequisites />;
  }

  return (
    <QuickModal
      title="Add Proofs of Impact"
      description="Track the progress of your attestations."
      dismissible={stack.length === 1}
      showBackButton={false}
    >
      <div className="flex items-center">
        <motion.div
          className={cn("flex aspect-square items-center justify-center")}
          animate={{
            width: currentStepIndex === 0 ? "4rem" : "0rem",
            filter: "blur(4px) saturate(0)",
            opacity: 0.5,
            scale: 0.5,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        />

        {ADD_POI_PROGRESS_STEPS.map((step, index) => {
          const stepDiff = Math.abs(index - currentStepIndex);

          return (
            <motion.div
              className={cn(
                "flex aspect-square items-center justify-center",
                stepDiff === 0 && "flex-1"
              )}
              animate={{
                width: stepDiff <= 1 ? "4rem" : "0rem",
                filter:
                  stepDiff === 0
                    ? "blur(0px) saturate(1)"
                    : "blur(4px) saturate(0)",
                opacity: stepDiff === 0 ? 1 : stepDiff === 1 ? 0.5 : 0,
                scale: stepDiff === 0 ? 1.2 : stepDiff === 1 ? 0.5 : 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              key={step.index}
            >
              {index === currentStepIndex && (
                <div
                  className={cn(
                    "absolute inset-10 rounded-full blur-xl",
                    status === "error"
                      ? "bg-red-500/50"
                      : "animate-pulse bg-green-500/50"
                  )}
                />
              )}
              {status === "error" ? (
                <CircleAlert className="z-10 size-16 text-red-500" />
              ) : (
                <step.Icon className={cn("z-10 size-16 text-green-500")} />
              )}
            </motion.div>
          );
        })}
        <motion.div
          className={cn("flex aspect-square items-center justify-center")}
          animate={{
            width:
              currentStepIndex === ADD_POI_PROGRESS_STEPS.length - 1
                ? "4rem"
                : "0rem",
            filter: "blur(4px) saturate(0)",
            opacity: 0.5,
            scale: 0.5,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        />
      </div>
      {status === "error" ? (
        <div className="flex flex-col items-center">
          <span className="text-balance text-center font-bold text-destructive text-lg">
            {errorState?.title}
          </span>
          <span className="text-balance text-center text-muted-foreground">
            {errorState?.description}
          </span>
          <Button
            size={"sm"}
            variant={"outline"}
            className="mt-2 gap-2"
            onClick={handleStart}
          >
            <RefreshCcw className="size-4" /> Retry
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <span className="text-balance text-center font-bold text-lg text-primary">
            {ADD_POI_PROGRESS_STEPS[currentStepIndex].title}
          </span>
          <span className="text-balance text-center text-muted-foreground">
            {ADD_POI_PROGRESS_STEPS[currentStepIndex].description}
          </span>
        </div>
      )}
      <ModalFooter>
        {status !== "pending" && (
          <Button variant={"secondary"} onClick={() => handleBack()}>
            Go Back
          </Button>
        )}
        <Button
          variant={"secondary"}
          onClick={() => {
            hide();
            if (status === "success") {
              clear();
            }
          }}
        >
          {status === "pending" ? "Continue in background" : "Close"}
        </Button>
      </ModalFooter>
    </QuickModal>
  );
};

export default AddProofsOfImpactStep3;

import { getEASConfig } from "@/config/eas";
import { fetchFullHypercertById } from "@/graphql/hypercerts/queries/fullHypercertById";
import { tryCatch } from "@/lib/tryCatch";
import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import {
  CheckCircle,
  ChefHat,
  FileSignature,
  Flame,
  Hourglass,
  LucideProps,
} from "lucide-react";
import { create } from "zustand";
import { addAttestation } from "./utils";
import type { JsonRpcSigner } from "ethers";

type Step = {
  title: string;
  description: string;
  Icon: React.FC<LucideProps>;
  index: number;
};

export const ADD_POI_PROGRESS_STEPS: Step[] = [
  {
    title: "Initializing",
    description: "Starting the attestation process.",
    Icon: Flame,
    index: 0,
  },
  {
    title: "Preparing",
    description: "Please wait while we gather some necessary information.",
    Icon: ChefHat,
    index: 1,
  },
  {
    title: "Waiting to sign",
    description: "Please sign the transaction to attest the proof of impact.",
    Icon: FileSignature,
    index: 2,
  },
  {
    title: "Waiting for confirmation",
    description: "Please wait while the attestation is confirmed.",
    Icon: Hourglass,
    index: 3,
  },
  {
    title: "Completed",
    description: "The proof of impact has been added successfully.",
    Icon: CheckCircle,
    index: 4,
  },
];

type AddPoiProgressState = {
  currentStepIndex: number;
  status: "pending" | "success" | "error";
  errorState: {
    title: string;
    description: string;
  } | null;
};

type AddPoiProgressActions = {
  start: (
    hcExchangeClient: HypercertExchangeClient,
    signer: JsonRpcSigner,
    hypercertId: string,
    proofOfImpact: {
      title: string;
      description: string;
      sources: {
        url: string;
        description: string;
      }[];
    }
  ) => Promise<void>;
  reset: () => void;
};

const useAddPoiProgressStore = create<
  AddPoiProgressState & AddPoiProgressActions
>((set) => ({
  currentStepIndex: 0,
  status: "pending",
  errorState: null,
  start: async (hcExchangeClient, signer, hypercertId, proofOfImpact) => {
    set({ status: "pending" });
    let errorTitle = "Could not start the process";
    let errorDescription =
      "There was an error verifying your credentials. Please refresh the page and try again.";
    const chainId = hcExchangeClient.chainId;
    const easConfig = getEASConfig(chainId);
    if (!easConfig) {
      set({
        status: "error",
        errorState: { title: errorTitle, description: errorDescription },
      });
      return;
    }

    // ========== STEP 1
    set({ currentStepIndex: 1 });
    errorTitle = "Failed to gather necessary information";
    errorDescription =
      "We were unable to gather some important information. Please try again later.";
    const [hypercert, hypercertFetchError] = await tryCatch(
      fetchFullHypercertById(hypercertId)
    );
    if (hypercertFetchError || !hypercert) {
      set({
        status: "error",
        errorState: { title: errorTitle, description: errorDescription },
      });
      return;
    }

    // ========== STEP 2
    set({ currentStepIndex: 2 });
    errorTitle = "Rejected.";
    errorDescription = "The transaction was rejected.";
    const attestations = hypercert.attestations;
    const firstAttestationWithSameSchema = attestations.find(
      (attestation) => attestation.schemaUid === easConfig.schemaUID
    );
    const referencedAttestation = firstAttestationWithSameSchema?.uid;
    const [hcChain, hcContractAddress, hcTokenId] = hypercertId.split("-");
    const [transaction, transactionError] = await tryCatch(
      addAttestation(signer, chainId, {
        referencedAttestation,
        chainId: hcChain,
        contractAddress: hcContractAddress,
        tokenId: hcTokenId,
        title: proofOfImpact.title,
        description: proofOfImpact.description,
        sourceURLs: proofOfImpact.sources.map((source) => [
          source.url,
          source.description,
        ]),
      })
    );
    if (transactionError || !transaction) {
      set({
        status: "error",
        errorState: { title: errorTitle, description: errorDescription },
      });
      return;
    }

    // ========== STEP 3
    set({ currentStepIndex: 3 });
    errorTitle = "Transaction not confirmed";
    errorDescription =
      "The transaction could not be confirmed. Please try again later.";
    const [, receiptError] = await tryCatch(transaction.wait());
    if (receiptError) {
      set({
        status: "error",
        errorState: { title: errorTitle, description: errorDescription },
      });
      return;
    }

    // ========== STEP 4
    set({ currentStepIndex: 4, status: "success" });
  },
  reset: () =>
    set({ currentStepIndex: 0, status: "pending", errorState: null }),
}));

export default useAddPoiProgressStore;

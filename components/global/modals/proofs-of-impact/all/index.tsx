import ProofOfImpact from "@/app/(marketplace)/bumicert/[bumicertId]/_components/Widgets/ProofsOfImpact/ProofOfImpact";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import {
  BumicertAttestation,
  FullHypercert,
} from "@/graphql/hypercerts/queries/fullHypercertById";
import { PlusCircle } from "lucide-react";
import React from "react";
import AddProofsOfImpactStep1, {
  AddProofsOfImpactStep1ModalId,
} from "../add/step1";

export const AllProofsOfImpactModalId = "proofs-of-impact/view-all";

const AllProofsOfImpactModal = ({
  proofsOfImpact,
  bumicert,
}: {
  proofsOfImpact: BumicertAttestation[];
  bumicert: FullHypercert;
}) => {
  const { pushModal } = useModal();
  const creatorAddress = bumicert.creatorAddress as `0x${string}`;
  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>All Proofs of Impact</ModalTitle>
        <ModalDescription>
          View all proofs of impact for this bumicert.
        </ModalDescription>
      </ModalHeader>
      <div className="max-h-[72vh] overflow-y-auto mask-b-from-90%">
        <div className="w-full flex flex-col gap-2">
          {proofsOfImpact.map((proofOfImpact) => {
            return (
              <div
                className="w-full border border-border rounded-lg overflow-hidden bg-accent/40"
                key={proofOfImpact.uid}
              >
                <ProofOfImpact
                  attestation={proofOfImpact}
                  creatorAddress={creatorAddress}
                  key={proofOfImpact.uid}
                />
              </div>
            );
          })}
        </div>
        <div className="h-12"></div>
      </div>
      <ModalFooter>
        <Button
          onClick={() => {
            pushModal({
              id: AddProofsOfImpactStep1ModalId,
              content: (
                <AddProofsOfImpactStep1 bumicertId={bumicert.hypercertId} />
              ),
            });
          }}
        >
          <PlusCircle />
          Add Proof of Impact
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default AllProofsOfImpactModal;

"use client";
import AllProofsOfImpactModal, {
  AllProofsOfImpactModalId,
} from "@/components/global/modals/proofs-of-impact/all";
import { Button, ButtonProps } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import {
  BumicertAttestation,
  FullHypercert,
} from "@/graphql/hypercerts/queries/fullHypercertById";
import React from "react";

const ViewAllButton = ({
  proofsOfImpact,
  bumicert,
  ...props
}: Omit<ButtonProps, "onClick"> & {
  proofsOfImpact: BumicertAttestation[];
  bumicert: FullHypercert;
}) => {
  const { show, clear, pushModal } = useModal();
  return (
    <Button
      {...props}
      onClick={() => {
        clear();
        pushModal({
          id: AllProofsOfImpactModalId,
          content: (
            <AllProofsOfImpactModal
              proofsOfImpact={proofsOfImpact}
              bumicert={bumicert}
            />
          ),
        });
        show();
      }}
    />
  );
};

export default ViewAllButton;

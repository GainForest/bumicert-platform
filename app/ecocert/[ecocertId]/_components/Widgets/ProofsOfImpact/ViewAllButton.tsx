"use client";
import AllProofsOfImpactModal, {
  AllProofsOfImpactModalId,
} from "@/components/global/modals/proofs-of-impact/all";
import { Button, ButtonProps } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import {
  EcocertAttestation,
  FullHypercert,
} from "@/graphql/hypercerts/queries/fullHypercertById";
import React from "react";

const ViewAllButton = ({
  proofsOfImpact,
  ecocert,
  ...props
}: Omit<ButtonProps, "onClick"> & {
  proofsOfImpact: EcocertAttestation[];
  ecocert: FullHypercert;
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
              ecocert={ecocert}
            />
          ),
        });
        show();
      }}
    />
  );
};

export default ViewAllButton;

import React from "react";
import WidgetItem from "../WidgetItem";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { FullHypercert } from "@/graphql/hypercerts/queries/fullHypercertById";
import ViewAllButton from "./ViewAllButton";

const ProofsOfImpact = ({ ecocert }: { ecocert: FullHypercert }) => {
  const attestations = ecocert.attestations;
  const sortedAttestations = attestations.sort(
    (a, b) =>
      Number(b.creationBlockTimestamp) - Number(a.creationBlockTimestamp)
  );
  const validAttestations = sortedAttestations.filter((a) => {
    const attestationType = a.data.sources.at(0)?.type;
    if (attestationType === "url" || attestationType === undefined) {
      return true;
    }
    return false;
  });

  const firstProofOfImpact = validAttestations.at(0);

  return (
    <WidgetItem
      title={
        <div className="flex items-center gap-2">
          Proofs of Impact
          <div className="text-xs text-muted-foreground font-sans bg-muted rounded-md px-2 py-1">
            {validAttestations.length}
          </div>
        </div>
      }
      toolbar={
        <div className="flex items-center gap-2">
          <ViewAllButton
            variant={"ghost"}
            size={"sm"}
            proofsOfImpact={validAttestations}
            ecocert={ecocert}
          >
            View All
          </ViewAllButton>
          <Button size={"sm"}>
            <CirclePlus />
            Add Proof
          </Button>
        </div>
      }
    >
      <div className="bg-background border border-border rounded-lg w-full">
        {!firstProofOfImpact ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-muted p-4 font-sans">
            <p className="text-muted-foreground text-sm">
              No proof of impact found
            </p>
          </div>
        ) : (
          <></>
          // <ProofOfImpact
          //   key={firstProofOfImpact.uid}
          //   attestation={firstProofOfImpact}
          //   creatorAddress={ecocert.creatorAddress as `0x${string}`}
          // />
        )}
      </div>
    </WidgetItem>
  );
};

export default ProofsOfImpact;

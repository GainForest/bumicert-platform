"use client";

import React from "react";
import BumicertCard, { BumicertCardSkeleton } from "./EcocertCard";
import ErrorPage from "@/components/error-page";
import useSortedBumicerts from "../../_hooks/use-sorted-bumicerts";
import { useFilteredBumicerts } from "../../_hooks/use-filtered-bumicerts";
import NothingPage from "@/components/nothing-page";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { useQueryState } from "nuqs";
import { AnimatePresence } from "framer-motion";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { getEcocertsFromClaimActivities } from "climateai-sdk/utilities/hypercerts";
import { trpcApi } from "@/components/providers/TrpcProvider";

const Bumicerts = () => {
  const {
    data: claimsWithOrgInfo,
    isPending,
    error,
  } = trpcApi.hypercerts.claim.activity.getAllAcrossOrgs.useQuery({
    pdsDomain: allowedPDSDomains[0],
  });
  const ecocerts = claimsWithOrgInfo
    ? getEcocertsFromClaimActivities(claimsWithOrgInfo, allowedPDSDomains[0])
    : undefined;

  const filteredEcocerts = useFilteredBumicerts(ecocerts ?? []);
  const sortedAndFilteredEcocerts = useSortedBumicerts(filteredEcocerts ?? []);
  const [, setSearchParams] = useQueryState("q");

  if (error) {
    return (
      <ErrorPage
        error={error}
        title="Unable to load ecocerts."
        description="Something went wrong while fetching ecocerts."
      />
    );
  }

  return (
    <div className="my-4">
      <div className="flex items-center justify-center">
        <div className="w-full flex flex-wrap items-stretch justify-center gap-4">
          <AnimatePresence mode="wait">
            {isPending ? (
              Array.from({ length: 12 }).map((_, index) => (
                <BumicertCardSkeleton key={index} />
              ))
            ) : sortedAndFilteredEcocerts.length > 0 ? (
              sortedAndFilteredEcocerts.map((ecocert) => (
                <BumicertCard
                  key={ecocert.claimActivity.cid}
                  bumicert={ecocert}
                />
              ))
            ) : (
              <NothingPage
                title="No ecocerts found."
                description="Please try changing your search."
                cta={
                  <Button
                    onClick={() => {
                      setSearchParams("");
                    }}
                  >
                    <Eraser className="size-4" />
                    Clear search
                  </Button>
                }
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Bumicerts;

"use client";

import React from "react";
import BumicertCard, { BumicertCardSkeleton } from "./BumicertCard";
import ErrorPage from "@/components/error-page";
import useSortedBumicerts from "../../_hooks/use-sorted-bumicerts";
import { useFilteredBumicerts } from "../../_hooks/use-filtered-bumicerts";
import NothingPage from "@/components/nothing-page";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { useQueryState } from "nuqs";
import { AnimatePresence } from "framer-motion";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { getEcocertsFromClaimActivities as getBumicertsFromClaimActivities } from "gainforest-sdk/utilities/hypercerts";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { useExploreStore } from "../../store";

const Bumicerts = () => {
  const { bumicerts, error } = useExploreStore();

  const loading = bumicerts === null;

  const filteredBumicerts = useFilteredBumicerts(bumicerts ?? []);
  const sortedAndFilteredBumicerts = useSortedBumicerts(
    filteredBumicerts ?? []
  );
  const [, setSearchParams] = useQueryState("q");

  if (error) {
    return (
      <ErrorPage
        error={error}
        title="Unable to load bumicerts."
        description="Something went wrong while fetching bumicerts."
      />
    );
  }

  return (
    <div className="my-4">
      <div className="flex items-center justify-center">
        <div className="w-full flex flex-wrap items-stretch justify-center gap-4">
          <AnimatePresence mode="wait">
            {loading ? (
              Array.from({ length: 12 }).map((_, index) => (
                <BumicertCardSkeleton key={index} />
              ))
            ) : sortedAndFilteredBumicerts.length > 0 ? (
              sortedAndFilteredBumicerts.map((bumicert) => (
                <BumicertCard
                  key={bumicert.claimActivity.cid}
                  bumicert={bumicert}
                />
              ))
            ) : (
              <NothingPage
                title="No bumicerts found."
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

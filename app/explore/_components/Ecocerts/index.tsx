"use client";

import React from "react";
import EcocertCard, { EcocertCardSkeleton } from "./EcocertCard";
import {
  ALL_HYPERCERT_IDS,
  fetchHypercertById,
} from "@/graphql/hypercerts/queries/hypercertById";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "@/components/error-page";
import useSortedEcocerts from "../../_hooks/use-sorted-ecocerts";
import { useFilteredEcocerts } from "../../_hooks/use-filtered-ecocerts";
import NothingPage from "@/components/nothing-page";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { useQueryState } from "nuqs";
import { AnimatePresence } from "framer-motion";
import { trpcClient } from "@/lib/trpc/client";
import { getEcocertsFromClaims } from "@/server/utils/claims";

const Ecocerts = () => {
  const {
    data: ecocerts,
    isPending,
    error,
  } = useQuery({
    queryKey: ["ecocerts"],
    queryFn: async () => {
      const claimsWithOrgInfo =
        await trpcClient.hypercerts.claim.getAllAcrossOrgs.query();
      return getEcocertsFromClaims(claimsWithOrgInfo);
    },
  });

  const filteredEcocerts = useFilteredEcocerts(ecocerts ?? []);
  const sortedAndFilteredEcocerts = useSortedEcocerts(filteredEcocerts ?? []);
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
            {isPending ?
              Array.from({ length: 12 }).map((_, index) => (
                <EcocertCardSkeleton key={index} />
              ))
            : sortedAndFilteredEcocerts.length > 0 ?
              sortedAndFilteredEcocerts.map((ecocert) => (
                <EcocertCard key={ecocert.claim.cid} ecocert={ecocert} />
              ))
            : <NothingPage
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
            }
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Ecocerts;

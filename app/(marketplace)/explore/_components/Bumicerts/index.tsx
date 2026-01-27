"use client";

import React, { useMemo } from "react";
import BumicertCard, { BumicertCardSkeleton, hasValidImage } from "./BumicertCard";
import ErrorPage from "@/components/error-page";
import useSortedBumicerts from "../../_hooks/use-sorted-bumicerts";
import { useFilteredBumicerts } from "../../_hooks/use-filtered-bumicerts";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { AnimatePresence, motion } from "framer-motion";
import { useExploreStore } from "../../store";

const Bumicerts = () => {
  const { bumicerts, error } = useExploreStore();
  const loading = bumicerts === null;

  const filteredBumicerts = useFilteredBumicerts(bumicerts ?? []);
  const sortedAndFilteredBumicerts = useSortedBumicerts(filteredBumicerts ?? []);
  
  // Filter out bumicerts without valid images to avoid empty grid cells
  const validBumicerts = useMemo(
    () => sortedAndFilteredBumicerts.filter(hasValidImage),
    [sortedAndFilteredBumicerts]
  );
  const [search, setSearchParams] = useQueryState("q");
  const [selectedOrg, setSelectedOrg] = useQueryState("org");

  if (error) {
    return (
      <ErrorPage
        error={error}
        title="Unable to load bumicerts."
        description="Something went wrong while fetching bumicerts."
      />
    );
  }

  const clearFilters = () => {
    setSearchParams("");
    setSelectedOrg("");
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <BumicertCardSkeleton key={index} />
            ))}
          </motion.div>
        ) : validBumicerts.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {validBumicerts.map((bumicert, index) => (
              <motion.div
                key={bumicert.claimActivity.cid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="h-full"
              >
                <BumicertCard bumicert={bumicert} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Search className="size-7 text-muted-foreground/50" strokeWidth={1.25} />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No bumicerts found</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              {search || selectedOrg
                ? "Try adjusting your search or filters to find what you're looking for."
                : "No bumicerts have been published yet."}
            </p>
            {(search || selectedOrg) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="size-4 mr-1" strokeWidth={1.5} />
                Clear filters
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bumicerts;

"use client";

import { Ecocert as Bumicert } from "gainforest-sdk/types";
import { useQueryState } from "nuqs";
import { useMemo } from "react";

export const useFilteredBumicerts = (bumicerts: Bumicert[]) => {
  const [searchParams] = useQueryState("q", {
    defaultValue: "",
  });

  const filteredBumicerts = useMemo(() => {
    if (searchParams === "") return bumicerts;
    return bumicerts.filter(
      (bumicert) =>
        bumicert.claimActivity.value.title
          .toLowerCase()
          .includes(searchParams.toLowerCase()) ||
        bumicert.claimActivity.value.shortDescription
          .toLowerCase()
          .includes(searchParams.toLowerCase()) ||
        bumicert.claimActivity.value.description
          ?.toLowerCase()
          .includes(searchParams.toLowerCase())
    );
  }, [bumicerts, searchParams]);

  return filteredBumicerts;
};

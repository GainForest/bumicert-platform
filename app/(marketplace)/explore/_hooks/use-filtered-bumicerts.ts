"use client";

import { Ecocert as Bumicert } from "climateai-sdk/types";
import { useQueryState } from "nuqs";
import { useMemo } from "react";

export const useFilteredBumicerts = (bumicerts: Bumicert[]) => {
  const [searchParams] = useQueryState("q", {
    defaultValue: "",
  });
  const [selectedOrg] = useQueryState("org", {
    defaultValue: "",
  });

  const filteredBumicerts = useMemo(() => {
    let filtered = bumicerts;

    // Filter by organization
    if (selectedOrg) {
      filtered = filtered.filter(
        (bumicert) => bumicert.repo.did === selectedOrg
      );
    }

    // Filter by search query
    if (searchParams) {
      const query = searchParams.toLowerCase();
      filtered = filtered.filter(
        (bumicert) =>
          bumicert.claimActivity.value.title
            .toLowerCase()
            .includes(query) ||
          bumicert.claimActivity.value.shortDescription
            ?.toLowerCase()
            .includes(query) ||
          bumicert.claimActivity.value.description
            ?.toLowerCase()
            .includes(query) ||
          bumicert.organizationInfo.name
            ?.toLowerCase()
            .includes(query)
      );
    }

    return filtered;
  }, [bumicerts, searchParams, selectedOrg]);

  return filteredBumicerts;
};

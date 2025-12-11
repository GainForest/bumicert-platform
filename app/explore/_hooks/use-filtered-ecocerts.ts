"use client";

import { Ecocert } from "climateai-sdk/types";
import { useQueryState } from "nuqs";
import { useMemo } from "react";

export const useFilteredEcocerts = (ecocerts: Ecocert[]) => {
  const [searchParams] = useQueryState("q", {
    defaultValue: "",
  });

  const filteredEcocerts = useMemo(() => {
    if (searchParams === "") return ecocerts;
    return ecocerts.filter(
      (ecocert) =>
        ecocert.claimActivity.value.title
          .toLowerCase()
          .includes(searchParams.toLowerCase()) ||
        ecocert.claimActivity.value.shortDescription
          .toLowerCase()
          .includes(searchParams.toLowerCase()) ||
        ecocert.claimActivity.value.description
          ?.toLowerCase()
          .includes(searchParams.toLowerCase())
    );
  }, [ecocerts, searchParams]);

  return filteredEcocerts;
};

"use client";

import { Ecocert } from "@/types/ecocert";
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
        ecocert.claim.value.title
          .toLowerCase()
          .includes(searchParams.toLowerCase()) ||
        ecocert.claim.value.shortDescription
          .toLowerCase()
          .includes(searchParams.toLowerCase()) ||
        ecocert.claim.value.description
          ?.toLowerCase()
          .includes(searchParams.toLowerCase())
    );
  }, [ecocerts, searchParams]);

  return filteredEcocerts;
};

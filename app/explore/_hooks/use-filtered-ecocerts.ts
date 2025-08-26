"use client";

import { Hypercert } from "@/graphql/hypercerts/queries/hypercertById";
import { useQueryState } from "nuqs";
import { useMemo } from "react";

export const useFilteredEcocerts = (ecocerts: Hypercert[]) => {
  const [searchParams] = useQueryState("q", {
    defaultValue: "",
  });

  const filteredEcocerts = useMemo(() => {
    if (searchParams === "") return ecocerts;
    return ecocerts.filter(
      (ecocert) =>
        ecocert.name.toLowerCase().includes(searchParams.toLowerCase()) ||
        ecocert.description.toLowerCase().includes(searchParams.toLowerCase())
    );
  }, [ecocerts, searchParams]);

  return filteredEcocerts;
};

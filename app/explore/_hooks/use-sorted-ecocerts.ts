"use client";

import usePriceFeed from "@/components/providers/PriceFeedProvider";
import { Hypercert } from "@/graphql/hypercerts/queries/hypercertById";
import { parseAsStringLiteral, useQueryState } from "nuqs";

export type TEcocertSortingOptions = {
  key: "date-created" | "funds-raised" | "funding-goal";
  order: "asc" | "desc";
};

export const sortingOptions: Array<{
  value: TEcocertSortingOptions["key"];
  label: string;
}> = [
  { value: "date-created", label: "Date Created" },
  { value: "funds-raised", label: "Funds Raised" },
  { value: "funding-goal", label: "Funding Goal" },
];

export type HypercertWithUSDSales = Hypercert & {
  usdSales: number;
  usdFundingGoal: number;
};

const useSortedEcocerts = (ecocerts: Hypercert[]): HypercertWithUSDSales[] => {
  const [sortKey] = useQueryState(
    "sort",
    parseAsStringLiteral<TEcocertSortingOptions["key"]>(
      sortingOptions.map((option) => option.value)
    ).withDefault("date-created")
  );
  const [sortDirection] = useQueryState(
    "order",
    parseAsStringLiteral<TEcocertSortingOptions["order"]>([
      "asc",
      "desc",
    ]).withDefault("desc")
  );
  const priceFeed = usePriceFeed();

  const injectUSDSales = (ecocerts: Hypercert[]): HypercertWithUSDSales[] => {
    return ecocerts.map((ecocert) => {
      const pricePerPercentInUSD = ecocert.lastValidOrder?.pricePerPercentInUSD;
      const usdFundingGoal = pricePerPercentInUSD
        ? Number(pricePerPercentInUSD) * 100
        : 0;
      if (priceFeed.status !== "ready")
        return { ...ecocert, usdSales: 0, usdFundingGoal };
      const usdSales = ecocert.sales.reduce((acc, sale) => {
        const saleInUSD = priceFeed.weiToUsd(
          sale.currency as `0x${string}`,
          BigInt(sale.currencyAmount)
        );
        return acc + (saleInUSD ?? 0);
      }, 0);
      return {
        ...ecocert,
        usdSales,
        usdFundingGoal,
      };
    });
  };

  const ecocertsWithUSDSales = injectUSDSales(ecocerts);

  const getAscendingSortedEcocerts = (
    ecocerts: HypercertWithUSDSales[]
  ): HypercertWithUSDSales[] => {
    if (sortKey === "date-created") {
      return ecocerts.sort((a, b) => {
        return (
          Number(a.creationBlockTimestamp) - Number(b.creationBlockTimestamp)
        );
      });
    }
    if (sortKey === "funds-raised") {
      return ecocerts.sort((a, b) => {
        return a.usdSales - b.usdSales;
      });
    }
    if (sortKey === "funding-goal") {
      return ecocerts.sort((a, b) => {
        return a.usdFundingGoal - b.usdFundingGoal;
      });
    }
    return ecocerts;
  };

  const ascendingSortedEcocerts =
    getAscendingSortedEcocerts(ecocertsWithUSDSales);
  if (sortDirection === "desc") {
    return ascendingSortedEcocerts.reverse();
  }
  return ascendingSortedEcocerts;
};

export default useSortedEcocerts;

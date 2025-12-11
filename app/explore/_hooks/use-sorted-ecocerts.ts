"use client";

import { Ecocert } from "climateai-sdk/types";
import { parseAsStringLiteral, useQueryState } from "nuqs";

export type TEcocertSortingOptions = {
  key: "date-created";
  order: "asc" | "desc";
};

export const sortingOptions: Array<{
  value: TEcocertSortingOptions["key"];
  label: string;
}> = [{ value: "date-created", label: "Date Created" }];

const useSortedEcocerts = (ecocerts: Ecocert[]): Ecocert[] => {
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

  // const priceFeed = usePriceFeed();

  // const injectUSDSales = (ecocerts: Ecocert[]): Ecocert[] => {
  //   return ecocerts.map((ecocert) => {
  //     const pricePerPercentInUSD = ecocert.lastValidOrder?.pricePerPercentInUSD;
  //     const usdFundingGoal = pricePerPercentInUSD
  //       ? Number(pricePerPercentInUSD) * 100
  //       : 0;
  //     if (priceFeed.status !== "ready")
  //       return { ...ecocert, usdSales: 0, usdFundingGoal };
  //     const usdSales = ecocert.sales.reduce((acc, sale) => {
  //       const saleInUSD = priceFeed.weiToUsd(
  //         sale.currency as `0x${string}`,
  //         BigInt(sale.currencyAmount)
  //       );
  //       return acc + (saleInUSD ?? 0);
  //     }, 0);
  //     return {
  //       ...ecocert,
  //       usdSales,
  //       usdFundingGoal,
  //     };
  //   });
  // };

  // const ecocertsWithUSDSales = injectUSDSales(ecocerts);

  const getAscendingSortedEcocerts = (ecocerts: Ecocert[]): Ecocert[] => {
    if (sortKey === "date-created") {
      return ecocerts.sort((a, b) => {
        return (
          new Date(a.claimActivity.value.createdAt).getTime() -
          new Date(b.claimActivity.value.createdAt).getTime()
        );
      });
    }
    return ecocerts;
  };

  const ascendingSortedEcocerts = getAscendingSortedEcocerts(ecocerts);
  if (sortDirection === "desc") {
    return ascendingSortedEcocerts.reverse();
  }
  return ascendingSortedEcocerts;
};

export default useSortedEcocerts;

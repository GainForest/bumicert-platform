"use client";

import { Ecocert as Bumicert } from "gainforest-sdk/types";
import { parseAsStringLiteral, useQueryState } from "nuqs";

export type TBumicertSortingOptions = {
  key: "date-created";
  order: "asc" | "desc";
};

export const sortingOptions: Array<{
  value: TBumicertSortingOptions["key"];
  label: string;
}> = [{ value: "date-created", label: "Date Created" }];

const useSortedBumicerts = (bumicerts: Bumicert[]): Bumicert[] => {
  const [sortKey] = useQueryState(
    "sort",
    parseAsStringLiteral<TBumicertSortingOptions["key"]>(
      sortingOptions.map((option) => option.value)
    ).withDefault("date-created")
  );
  const [sortDirection] = useQueryState(
    "order",
    parseAsStringLiteral<TBumicertSortingOptions["order"]>([
      "asc",
      "desc",
    ]).withDefault("desc")
  );

  // const priceFeed = usePriceFeed();

  // const injectUSDSales = (bumicerts: Bumicert[]): Bumicert[] => {
  //   return bumicerts.map((bumicert) => {
  //     const pricePerPercentInUSD = bumicert.lastValidOrder?.pricePerPercentInUSD;
  //     const usdFundingGoal = pricePerPercentInUSD
  //       ? Number(pricePerPercentInUSD) * 100
  //       : 0;
  //     if (priceFeed.status !== "ready")
  //       return { ...bumicert, usdSales: 0, usdFundingGoal };
  //     const usdSales = bumicert.sales.reduce((acc, sale) => {
  //       const saleInUSD = priceFeed.weiToUsd(
  //         sale.currency as `0x${string}`,
  //         BigInt(sale.currencyAmount)
  //       );
  //       return acc + (saleInUSD ?? 0);
  //     }, 0);
  //     return {
  //       ...bumicert,
  //       usdSales,
  //       usdFundingGoal,
  //     };
  //   });
  // };

  // const bumicertsWithUSDSales = injectUSDSales(bumicerts);

  const getAscendingSortedBumicerts = (bumicerts: Bumicert[]): Bumicert[] => {
    if (sortKey === "date-created") {
      return bumicerts.sort((a, b) => {
        return (
          new Date(a.claimActivity.value.createdAt).getTime() -
          new Date(b.claimActivity.value.createdAt).getTime()
        );
      });
    }
    return bumicerts;
  };

  const ascendingSortedBumicerts = getAscendingSortedBumicerts(bumicerts);
  if (sortDirection === "desc") {
    return ascendingSortedBumicerts.reverse();
  }
  return ascendingSortedBumicerts;
};

export default useSortedBumicerts;

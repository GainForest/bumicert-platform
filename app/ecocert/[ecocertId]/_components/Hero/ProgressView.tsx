"use client";
import usePriceFeed from "@/components/providers/PriceFeedProvider";
import { Button } from "@/components/ui/button";
import { OrgHypercertsClaimClaim } from "@/lexicon-api";
import { getStripedBackground } from "@/lib/getStripedBackground";
import { getLastValidOrder } from "@/lib/hypercerts/getLastValidOrder";
import { motion } from "framer-motion";
import { CircleSlash2, HandHeart } from "lucide-react";
import React, { useMemo } from "react";

export const ProgressBar = ({
  totalSalesInUsd,
  fundingGoalInUsd,
}: {
  totalSalesInUsd: number;
  fundingGoalInUsd: number;
}) => (
  <div className="h-5 w-full sm:w-auto flex-auto sm:flex-1 rounded-sm bg-background border border-border relative overflow-hidden">
    <motion.div
      className="bg-primary h-full rounded-xs"
      initial={{
        width: 0,
      }}
      animate={{
        width: `${Math.min((totalSalesInUsd / fundingGoalInUsd) * 100, 100)}%`,
      }}
    ></motion.div>
    <div
      className="absolute inset-0"
      style={{
        background: getStripedBackground(
          "rgba(0 0 0 / 0.05)",
          "rgba(255 255 255 / 0.05)"
        ),
      }}
    ></div>
  </div>
);

const ProgressView = ({
  hypercert,
}: {
  hypercert: OrgHypercertsClaimClaim.Record;
}) => {
  // const priceFeed = usePriceFeed();
  // const sales = hypercert.sales;

  // const totalSalesInUsd = useMemo(() => {
  //   if (priceFeed.status !== "ready") return 0;
  //   return sales.reduce((acc, sale) => {
  //     const saleInUsd = priceFeed.weiToUsd(
  //       sale.currency as `0x${string}`,
  //       BigInt(sale.currencyAmount)
  //     );
  //     return acc + (saleInUsd ?? 0);
  //   }, 0);
  // }, [sales, priceFeed]);

  // const lastValidOrder = getLastValidOrder(hypercert.orders);
  // const fundingGoalInUsd = (lastValidOrder?.pricePerPercentInUSD ?? 0) * 100;

  // if (!lastValidOrder)
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-2 text-sm text-muted-foreground">
      <CircleSlash2 className="size-3" />
      <span className="text-center">
        This ecocert is not yet listed for sale.
      </span>
    </div>
  );

  // return (
  //   <div className="flex flex-col sm:flex-row items-center justify-between p-2 gap-4">
  //     <ProgressBar
  //       totalSalesInUsd={totalSalesInUsd}
  //       fundingGoalInUsd={fundingGoalInUsd}
  //     />
  //     <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2">
  //       <div className="flex flex-col items-start sm:items-end">
  //         <span className="text-sm flex items-end gap-0.5">
  //           <span className="text-primary font-bold">
  //             ${totalSalesInUsd.toFixed(2)}
  //           </span>
  //           <span className="font-bold">/</span>
  //           <span className="font-bold text-xs">
  //             ${fundingGoalInUsd.toFixed(2)}
  //           </span>
  //         </span>
  //         <span className="text-xs text-muted-foreground -mt-1">
  //           sold so far.
  //         </span>
  //       </div>
  //       <Button size={"sm"}>
  //         <HandHeart />
  //         Buy a fraction
  //       </Button>
  //     </div>
  //   </div>
  // );
};

export default ProgressView;

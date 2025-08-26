import React from "react";
import { Clock, ShoppingCart } from "lucide-react";
import Image from "next/image";
import CircularProgressBar from "@/components/circular-progressbar";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { HypercertWithUSDSales } from "../../_hooks/use-sorted-ecocerts";
import { motion } from "framer-motion";

const StripedDiv = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="h-40 rounded-t-lg rounded-b-xl border-b border-b-border shadow-inner p-3 group-hover:p-2 pb-0 group-hover:pb-0 overflow-hidden transition-all duration-300"
      style={{
        background: `repeating-linear-gradient(
          -55deg,
          color-mix(in oklab, var(--muted) 30%, transparent),
          color-mix(in oklab, var(--muted) 30%, transparent) 4px,
          color-mix(in oklab, var(--muted) 100%, transparent) 4px,
          color-mix(in oklab, var(--muted) 100%, transparent) 8px
        )`,
      }}
    >
      {children}
    </div>
  );
};

const EcocertCard = ({ ecocert }: { ecocert: HypercertWithUSDSales }) => {
  const percentageSold =
    ecocert.usdSales /
    Number(ecocert.lastValidOrder?.pricePerPercentInUSD ?? 1);
  return (
    <motion.div
      className="group bg-background rounded-lg shadow-lg w-[280px] flex flex-col dark:border dark:border-border"
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.75 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 0.75 }}
    >
      <Link
        href={`/ecocert/${ecocert.hypercertId}`}
        className="flex flex-col w-full"
      >
        <StripedDiv>
          <Image
            src={`/api/hypercerts/image/${ecocert.hypercertId}`}
            alt={ecocert.name}
            className="object-cover object-top h-full w-full shadow-lg"
            width={280}
            height={400}
          />
        </StripedDiv>

        <div className="p-3 flex flex-col justify-between gap-3 flex-1">
          <span className="font-serif font-bold text-lg line-clamp-2">
            {ecocert.name}
          </span>
          {ecocert.totalUnitsForSale === undefined ||
          ecocert.lastValidOrder === undefined ? (
            <div className="flex items-center justify-between gap-2 bg-muted/80 rounded-lg p-2 mt-1">
              <div className="flex flex-col text-sm text-muted-foreground justify-center">
                <span>
                  <Clock className="size-4" />
                </span>
                <span>Coming Soon...</span>
              </div>
              <CircularProgressBar value={0} size={40} text="_ _" />
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 bg-muted/80 rounded-lg p-2 mt-1">
              <div className="flex flex-col text-sm text-muted-foreground">
                <span>
                  <span className="text-muted-foreground">Raised:</span>{" "}
                  <b className="text-primary">${ecocert.usdSales.toFixed(2)}</b>
                  <span className="mx-1">{" · "}</span>
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    {ecocert.uniqueBuyersCount}{" "}
                    <ShoppingCart className="size-4" />
                  </span>
                </span>
                <span>
                  <span className="text-muted-foreground">Target:</span>{" "}
                  <b className="text-primary">
                    ${ecocert.usdFundingGoal.toFixed(2)}
                  </b>
                </span>
              </div>
              <CircularProgressBar
                value={percentageSold}
                size={40}
                text={`${
                  percentageSold > 999 ? ">999" : percentageSold.toFixed(0)
                }%`}
              />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default EcocertCard;

export const EcocertCardSkeleton = () => {
  return (
    <motion.div
      className="bg-background rounded-lg shadow-lg w-[280px] flex flex-col"
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.75 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 0.75 }}
    >
      <StripedDiv>{null}</StripedDiv>
      <div className="p-3 flex flex-col justify-between gap-3 flex-1">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="w-full p-2">
        <Skeleton className="h-16 w-full" />
      </div>
    </motion.div>
  );
};

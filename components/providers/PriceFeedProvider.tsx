"use client";

import { PriceConversionResponse } from "@/app/api/price-conversion/route";
import { currenciesByNetwork } from "@hypercerts-org/marketplace-sdk";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { BigNumber } from "bignumber.js";

type PriceFeedContextCatalog = {
  loading: {
    status: "loading";
  };
  error: {
    status: "error";
  };
  ready: {
    status: "ready";
    weiToUsd: (currencyAddress: `0x${string}`, amount: bigint) => number | null;
    usdToWei: (currencyAddress: `0x${string}`, amount: number) => bigint | null;
  };
};

export type PriceFeedContext =
  PriceFeedContextCatalog[keyof PriceFeedContextCatalog];

const priceFeedContext = createContext<PriceFeedContext | null>(null);

const supportedCurrenciesOnCelo = Object.values(currenciesByNetwork[42220]);

export const PriceFeedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["price-feed"],
    queryFn: async () => {
      const fetchWithThrow = async (address: string) => {
        const res = await fetch(
          `/api/price-conversion?currency_address=${address}&amount=1`
        );
        if (!res.ok) {
          throw new Error(`Price fetch failed: ${res.status}`);
        }
        return (await res.json()) as PriceConversionResponse;
      };

      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      const maxRetries = 3;
      const baseBackoffMs = 250;

      // First attempt all in parallel, but don't fail the whole batch
      const firstResults = await Promise.allSettled(
        supportedCurrenciesOnCelo.map((c) => fetchWithThrow(c.address))
      );

      // Collect failures to retry individually
      const results: Array<PriceConversionResponse | null> = new Array(
        supportedCurrenciesOnCelo.length
      ).fill(null);

      firstResults.forEach((r, i) => {
        if (r.status === "fulfilled") {
          results[i] = r.value;
        }
      });

      // Retry failed ones per-item with simple exponential backoff
      await Promise.all(
        results.map(async (value, i) => {
          if (value !== null) return; // already fulfilled
          const address = supportedCurrenciesOnCelo[i].address;
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              const v = await fetchWithThrow(address);
              results[i] = v;
              return;
            } catch {
              if (attempt === maxRetries) {
                return; // leave as null
              }
              const backoff = baseBackoffMs * 2 ** (attempt - 1);
              await sleep(backoff);
            }
          }
        })
      );

      // Never throw: return partial data; missing entries remain null
      return results;
    },
  });

  let providerValue: PriceFeedContext = {
    status: "loading",
  };

  if (error) {
    providerValue = {
      status: "error",
    };
  } else if (isLoading) {
    providerValue = {
      status: "loading",
    };
  } else if (data === undefined) {
    providerValue = {
      status: "error",
    };
  } else {
    providerValue = {
      status: "ready",
      weiToUsd: (currencyAddress, amount) => {
        const currencyIndex = supportedCurrenciesOnCelo.findIndex(
          (currency) => currency.address === currencyAddress
        );
        if (currencyIndex === -1) {
          return null;
        }
        const currency = supportedCurrenciesOnCelo[currencyIndex];
        const priceData = data[currencyIndex];
        if (priceData === null) {
          return null;
        }
        const amountInUSD = BigNumber(amount)
          .multipliedBy(priceData.usdPrice)
          .dividedBy(10 ** currency.decimals)
          .toNumber();
        return amountInUSD;
      },
      usdToWei: (currencyAddress, amount) => {
        const currencyIndex = supportedCurrenciesOnCelo.findIndex(
          (currency) => currency.address === currencyAddress
        );
        if (currencyIndex === -1) {
          return null;
        }
        const currency = supportedCurrenciesOnCelo[currencyIndex];
        const priceData = data[currencyIndex];
        if (priceData === null) {
          return null;
        }
        const amountInTokens = BigNumber(amount)
          .dividedBy(priceData.usdPrice)
          .toNumber();
        return BigInt(amountInTokens * 10 ** currency.decimals);
      },
    };
  }
  return (
    <priceFeedContext.Provider value={providerValue}>
      {children}
    </priceFeedContext.Provider>
  );
};

const usePriceFeed = () => {
  const context = useContext(priceFeedContext);
  if (context === null) {
    throw new Error("usePriceFeed must be used within a PriceFeedProvider");
  }
  return context;
};

export default usePriceFeed;

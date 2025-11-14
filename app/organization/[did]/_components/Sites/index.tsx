import { getServerCaller } from "@/server/routers/_app";
import React from "react";
import SitesClient, { AllSitesData } from "./SitesClient";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import { Serialize } from "@/lib/atproto/serialization";

const Sites = async ({ did }: { did: string }) => {
  const apiCaller = getServerCaller();

  const [response, error] = await tryCatch(
    apiCaller.gainforest.site.getAll({
      did,
    })
  );

  let allSitesData: AllSitesData = {
    sites: [],
    defaultSite: null,
  };
  if (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      // Display empty project sites
    } else {
      throw new Error("An unknown error occurred.");
    }
  } else {
    allSitesData = response;
  }

  const serializedInitialData = JSON.parse(
    JSON.stringify(allSitesData)
  ) as Serialize<AllSitesData>;

  return (
    <SitesClient did={did} serializedInitialData={serializedInitialData} />
  );
};
export default Sites;

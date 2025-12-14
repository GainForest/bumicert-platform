import { climateAiSdk } from "@/config/climateai-sdk.server";
import React from "react";
import SitesClient, { AllSitesData } from "./SitesClient";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import { serialize } from "climateai-sdk/utilities/transform";
import { allowedPDSDomains } from "@/config/climateai-sdk";

const Sites = async ({ did }: { did: string }) => {
  const apiCaller = climateAiSdk.getServerCaller();

  const [response, error] = await tryCatch(
    apiCaller.gainforest.organization.site.getAll({
      did,
      pdsDomain: allowedPDSDomains[0],
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

  const serializedInitialData = serialize(allSitesData);

  return (
    <SitesClient did={did} serializedInitialData={serializedInitialData} />
  );
};
export default Sites;

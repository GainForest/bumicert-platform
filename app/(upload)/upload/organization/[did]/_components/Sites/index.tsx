import { gainforestSdk } from "@/config/gainforest-sdk.server";
import React from "react";
import SitesClient, { AllSitesData } from "./SitesClient";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import { serialize } from "gainforest-sdk/utilities/transform";
import { allowedPDSDomains } from "@/config/gainforest-sdk";

const Sites = async ({ did }: { did: string }) => {
  const apiCaller = gainforestSdk.getServerCaller();

  // Guard: Ensure allowedPDSDomains is configured
  if (!allowedPDSDomains || allowedPDSDomains.length === 0) {
    throw new Error(
      `allowedPDSDomains is not configured. Cannot call apiCaller.hypercerts.location.getAll for did: ${did}`
    );
  }

  const [response, error] = await tryCatch(
    apiCaller.hypercerts.location.getAll({
      did,
      pdsDomain: allowedPDSDomains[0],
    })
  );

  let allSitesData: AllSitesData = {
    locations: [],
    defaultLocation: null,
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

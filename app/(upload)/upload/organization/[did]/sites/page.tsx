import React from "react";
import SitesHeaderContent from "./HeaderContent";
import Container from "@/components/ui/container";
import SitesClient, { AllSitesData } from "../_components/Sites/SitesClient";
import { climateAiSdk } from "@/config/climateai-sdk.server";
import { atprotoSDK } from "@/lib/atproto";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { serialize } from "climateai-sdk/utilities/transform";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import ErrorPage from "./error";

const SitesPage = async ({ params }: { params: Promise<{ did: string }> }) => {
  const { did: encodedDid } = await params;
  const did = decodeURIComponent(encodedDid);

  const serverCaller = climateAiSdk.getServerCaller(atprotoSDK);
  const [response, error] = await tryCatch(
    serverCaller.hypercerts.site.getAll({
      did: did,
      pdsDomain: allowedPDSDomains[0],
    })
  );

  let data: AllSitesData;

  try {
    if (error) {
      if (error instanceof TRPCError && error.code === "NOT_FOUND") {
        // Display empty sites data
        data = {
          sites: [],
          defaultSite: null,
        };
      } else {
        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new Error("Unable to fetch sites.");
        }
        throw new Error("An unknown error occurred.");
      }
    } else {
      data = response;
    }
  } catch (error) {
    console.error(
      "Redirecting to error page due to the following error:",
      error
    );
    return <ErrorPage error={error as Error} />;
  }

  const serializedInitialData = serialize(data);

  return (
    <Container>
      <SitesHeaderContent />
      <div className="p-2">
        {/* <h1 className="font-serif font-bold text-3xl mb-6">My Projects</h1> */}
        <SitesClient did={did} serializedInitialData={serializedInitialData} />
      </div>
    </Container>
  );
};

export default SitesPage;

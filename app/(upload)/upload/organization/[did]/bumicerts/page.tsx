import React from "react";
import BumicertsHeaderContent from "./HeaderContent";
import Container from "@/components/ui/container";
import { gainforestSdk } from "@/config/gainforest-sdk.server";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { serialize } from "gainforest-sdk/utilities/transform";
import BumicertsClient from "./_components/BumicertsClient";
import { getEcocertsFromClaimActivities } from "gainforest-sdk/utilities/hypercerts";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import ErrorPage from "./error";

const BumicertsPage = async ({
  params,
}: {
  params: Promise<{ did: string }>;
}) => {
  const { did: encodedDid } = await params;
  const did = decodeURIComponent(encodedDid);
  const serverCaller = gainforestSdk.getServerCaller();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let activitiesResponse: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orgInfoResponse: any;

  try {
    const [activitiesData, activitiesError] = await tryCatch(
      serverCaller.hypercerts.claim.activity.getAll({
        did: did,
        pdsDomain: allowedPDSDomains[0],
      })
    );

    if (activitiesError) {
      if (
        activitiesError instanceof TRPCError &&
        activitiesError.code === "NOT_FOUND"
      ) {
        // Display empty activities
        activitiesResponse = { activities: [] };
      } else {
        if (
          activitiesError instanceof TRPCError &&
          activitiesError.code === "BAD_REQUEST"
        ) {
          throw new Error("Unable to fetch activities.");
        }
        throw new Error("An unknown error occurred while fetching activities.");
      }
    } else {
      activitiesResponse = activitiesData;
    }

    const [orgInfoData, orgInfoError] = await tryCatch(
      serverCaller.gainforest.organization.info.get({
        did: did,
        pdsDomain: allowedPDSDomains[0],
      })
    );

    if (orgInfoError) {
      if (
        orgInfoError instanceof TRPCError &&
        orgInfoError.code === "NOT_FOUND"
      ) {
        throw new Error("This organization does not exist.");
      } else {
        if (
          orgInfoError instanceof TRPCError &&
          orgInfoError.code === "BAD_REQUEST"
        ) {
          throw new Error("This organization does not exist.");
        }
        throw new Error(
          "An unknown error occurred while fetching organization info."
        );
      }
    } else {
      orgInfoResponse = orgInfoData;
    }

    const bumicerts = getEcocertsFromClaimActivities(
      [
        {
          activities: activitiesResponse.activities,
          organizationInfo: orgInfoResponse.value,
          repo: {
            did,
          },
        },
      ],
      allowedPDSDomains[0]
    );

    const serializedInitialData = serialize(bumicerts);

    return (
      <Container>
        <BumicertsHeaderContent />
        <div className="p-2">
          <BumicertsClient
            did={did}
            serializedInitialData={serializedInitialData}
          />
        </div>
      </Container>
    );
  } catch (error) {
    console.error(
      "Redirecting to error page due to the following error:",
      error
    );
    return <ErrorPage error={error as Error} />;
  }
};

export default BumicertsPage;

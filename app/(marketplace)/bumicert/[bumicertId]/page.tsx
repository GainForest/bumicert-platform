import Container from "@/components/ui/container";
import React from "react";
import Hero from "./_components/Hero";
import Body from "./_components/Body";
import HeaderContent from "./_components/HeaderContent";
import { climateAiSdk } from "@/config/climateai-sdk.server";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import { serialize } from "climateai-sdk/utilities/transform";

const BumicertPage = async ({
  params,
}: {
  params: Promise<{ bumicertId: string }>;
}) => {
  const { bumicertId } = await params;
  const decodedBumicertId = decodeURIComponent(bumicertId);
  const parsedBumicertId = decodedBumicertId.includes("-")
    ? decodedBumicertId.split("-")
    : null;
  if (!parsedBumicertId) {
    throw new Error("This Bumicert does not exist.");
  }

  const [did, rkey] = parsedBumicertId;

  const caller = climateAiSdk.getServerCaller();
  const [bumicertResponses, bumicertFetchError] = await tryCatch(
    Promise.all([
      caller.gainforest.organization.info.get({
        did,
        pdsDomain: allowedPDSDomains[0],
      }),
      caller.hypercerts.claim.activity.get({
        did: did,
        rkey: rkey,
        pdsDomain: allowedPDSDomains[0],
      }),
    ])
  );

  if (bumicertFetchError) {
    if (
      bumicertFetchError instanceof TRPCError &&
      bumicertFetchError.code === "NOT_FOUND"
    ) {
      throw new Error("This Bumicert does not exist.");
    }
    console.error("Error fetching Bumicert", did, rkey, bumicertFetchError);
    throw new Error("An unknown error occurred.");
  }

  const [organizationInfoResponse, bumicertResponse] = bumicertResponses;

  const serializedOrganizationInfo = serialize(organizationInfoResponse.value);
  const serializedBumicert = serialize(bumicertResponse.value);

  if (bumicertResponse.value.image === undefined) {
    throw new Error("This Bumicert is not supported.");
  }

  return (
    <Container className="pb-16">
      <HeaderContent bumicertId={decodedBumicertId} />
      <Hero
        creatorDid={did}
        serializedBumicert={serializedBumicert}
        serializedOrganizationInfo={serializedOrganizationInfo}
      />
      <Body serializedBumicert={serializedBumicert} />
    </Container>
  );
};

export default BumicertPage;

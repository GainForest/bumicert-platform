import Container from "@/components/ui/container";
import { fetchFullHypercertById } from "@/graphql/hypercerts/queries/fullHypercertById";
import React from "react";
import Hero from "./_components/Hero";
import WidgetItem from "./_components/Widgets/WidgetItem";
import Body from "./_components/Body";
import HeaderContent from "./_components/HeaderContent";
import { climateAiSdk } from "@/config/climateai-sdk.server";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";

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

  if (bumicertResponse.value.image === undefined) {
    // We don't support Bumicerts that don't have an image.
    throw new Error("This Bumicert is not supported.");
  }

  return (
    <Container>
      <HeaderContent bumicertId={decodedBumicertId} />
      <Hero
        creatorDid={did}
        bumicert={bumicertResponse.value}
        organizationInfo={organizationInfoResponse.value}
      />
      <Body bumicert={bumicertResponse.value} />
      <hr className="my-4" />
      <div
        className={"grid gap-4"}
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(460px, 100%), 1fr))",
        }}
      >
        {/* <ProofsOfImpact bumicert={bumicert} /> */}
        <WidgetItem title="Reviews">Hello</WidgetItem>
        <WidgetItem title="Support">Hello</WidgetItem>
        <WidgetItem title="Contributors & Evaluators">Hello</WidgetItem>
      </div>
    </Container>
  );
};

export default BumicertPage;

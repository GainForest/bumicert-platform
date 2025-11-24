import Container from "@/components/ui/container";
import { fetchFullHypercertById } from "@/graphql/hypercerts/queries/fullHypercertById";
import React from "react";
import Hero from "./_components/Hero";
import WidgetItem from "./_components/Widgets/WidgetItem";
import Body from "./_components/Body";
import HeaderContent from "./_components/HeaderContent";
import { getServerCaller } from "@/server/routers/_app";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";

const EcocertPage = async ({
  params,
}: {
  params: Promise<{ ecocertId: string }>;
}) => {
  const { ecocertId } = await params;
  const decodedEcocertId = decodeURIComponent(ecocertId);
  const parsedEcocertId =
    decodedEcocertId.includes("-") ? decodedEcocertId.split("-") : null;
  if (!parsedEcocertId) {
    throw new Error("This Ecocert does not exist.");
  }

  const [did, rkey] = parsedEcocertId;

  const caller = getServerCaller();
  const [ecocertResponses, ecocertFetchError] = await tryCatch(
    Promise.all([
      caller.organizationInfo.get({ did }),
      caller.hypercerts.claim.get({ did: did, rkey: rkey }),
    ])
  );

  if (ecocertFetchError) {
    if (
      ecocertFetchError instanceof TRPCError &&
      ecocertFetchError.code === "NOT_FOUND"
    ) {
      throw new Error("This Ecocert does not exist.");
    }
    console.error("Error fetching Ecocert", did, rkey, ecocertFetchError);
    throw new Error("An unknown error occurred.");
  }

  const [organizationInfoResponse, ecocertResponse] = ecocertResponses;

  if (ecocertResponse.value.image === undefined) {
    // We don't support Ecocerts that don't have an image.
    throw new Error("This Ecocert is not supported.");
  }

  return (
    <Container>
      <HeaderContent ecocertId={decodedEcocertId} />
      <Hero
        creatorDid={did}
        ecocert={ecocertResponse.value}
        organizationInfo={organizationInfoResponse.value}
      />
      <Body ecocert={ecocertResponse.value} />
      <hr className="my-4" />
      <div
        className={"grid gap-4"}
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(460px, 100%), 1fr))",
        }}
      >
        {/* <ProofsOfImpact ecocert={ecocert} /> */}
        <WidgetItem title="Reviews">Hello</WidgetItem>
        <WidgetItem title="Support">Hello</WidgetItem>
        <WidgetItem title="Contributors & Evaluators">Hello</WidgetItem>
      </div>
    </Container>
  );
};

export default EcocertPage;

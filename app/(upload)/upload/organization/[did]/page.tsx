import Container from "@/components/ui/container";
import React from "react";
import Hero from "./_components/Hero";
import SubHero from "./_components/SubHero";
import AboutOrganization from "./_components/AboutOrganization";
import { AppGainforestOrganizationInfo } from "climateai-sdk/lex-api";
import HeaderContent from "./_components/HeaderContent";
import { OrganizationPageHydrator } from "./hydrator";
import Sites from "./_components/Sites";
import Projects from "./projects/_components/Projects";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSessionFromRequest } from "climateai-sdk/session";
import { serialize } from "climateai-sdk/utilities/transform";
import { climateAiSdk } from "@/config/climateai-sdk.server";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import SectionForData from "./_components/SectionForData";
import ErrorPage from "./error";

const EMPTY_ORGANIZATION_DATA: AppGainforestOrganizationInfo.Record = {
  $type: "app.gainforest.organization.info",
  displayName: "",
  wesite: undefined,
  logo: undefined,
  coverImage: undefined,
  shortDescription: "",
  longDescription: "",
  objectives: [],
  startDate: "",
  country: "",
  visibility: "Public",
  createdAt: new Date().toISOString(),
};

const OrganizationPage = async ({
  params,
}: {
  params: Promise<{ did: string }>;
}) => {
  const { did: encodedDid } = await params;
  const did = decodeURIComponent(encodedDid);

  const apiCaller = climateAiSdk.getServerCaller();
  const [response, error] = await tryCatch(
    apiCaller.gainforest.organization.info.get({
      did,
      pdsDomain: allowedPDSDomains[0],
    })
  );

  let data = EMPTY_ORGANIZATION_DATA;

  try {
    if (error) {
      if (error instanceof TRPCError && error.code === "NOT_FOUND") {
        // Display empty organization data
      } else {
        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new Error("This organization does not exist.");
        }
        console.error(error);
        throw new Error("An unknown error occurred.");
      }
    } else {
      data = response.value;
    }

    if (data.visibility === "Hidden") {
      try {
        const session = await getSessionFromRequest();
        if (session && session.did !== did) {
          throw new Error("This organization is hidden.");
        }
      } catch {
        throw new Error("This organization is hidden.");
      }
    }
  } catch (error) {
    console.error(
      "Redirecting to error page due to the following error:",
      error
    );
    return <ErrorPage error={error as Error} />;
  }

  const serializedData = serialize(data);

  return (
    <OrganizationPageHydrator
      initialSerializedData={serializedData}
      initialDid={did}
    >
      <Container>
        <HeaderContent />
        <Hero initialData={serializedData} initialDid={did} />
        <SubHero initialData={serializedData} />
        <AboutOrganization initialData={serializedData} />
        <hr className="my-8" />
        <Projects did={did} />
        <hr className="my-8" />
        <SectionForData title="Bumicerts" userDid={did}>
          <div className="w-full h-40 bg-muted rounded-lg mt-2 flex flex-col items-center justify-center text-center text-pretty font-serif text-xl text-muted-foreground font-bold">
            Your bumicerts will appear here.
          </div>
        </SectionForData>

        <hr className="my-8" />
        <Sites did={did} />
      </Container>
    </OrganizationPageHydrator>
  );
};

export default OrganizationPage;

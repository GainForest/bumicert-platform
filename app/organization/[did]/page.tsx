import Container from "@/components/ui/container";
import { getServerCaller } from "@/server/routers/_app";
import React from "react";
import Hero from "./_components/Hero";
import SubHero from "./_components/SubHero";
import AboutOrganization from "./_components/AboutOrganization";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";
import HeaderContent from "./_components/HeaderContent";
import { OrganizationPageHydrator } from "./hydrator";
import Sites from "./_components/Sites";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
};

const OrganizationPage = async ({
  params,
}: {
  params: Promise<{ did: string }>;
}) => {
  const { did: encodedDid } = await params;
  const did = decodeURIComponent(encodedDid);

  const apiCaller = getServerCaller();
  const [response, error] = await tryCatch(
    apiCaller.organizationInfo.get({ did })
  );

  let data = EMPTY_ORGANIZATION_DATA;
  if (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      // Display empty organization data
    } else {
      if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
        throw new Error("This organization does not exist.");
      }
      throw new Error("An unknown error occurred.");
    }
  } else {
    data = response.value;
  }

  const serializedData = JSON.parse(
    JSON.stringify(data)
  ) as AppGainforestOrganizationInfo.Record;

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
        <div className="p-2">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl">Ecocerts</h2>
            <Link href={`#`}>
              <Button variant={"ghost"}>
                View all <ArrowRight />
              </Button>
            </Link>
          </div>
          <div className="w-full h-40 bg-muted rounded-lg mt-2 flex flex-col items-center justify-center text-center text-pretty font-serif text-xl text-muted-foreground font-bold">
            Your ecocerts will appear here.
          </div>
        </div>
        <hr className="my-8" />
        <Sites did={did} />
      </Container>
    </OrganizationPageHydrator>
  );
};

export default OrganizationPage;

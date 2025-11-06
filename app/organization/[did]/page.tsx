import Container from "@/components/ui/container";
import { getServerCaller } from "@/server/routers/_app";
import React from "react";
import Hero from "./_components/Hero";
import SubHero from "./_components/SubHero";
import AboutOrganization from "./_components/AboutOrganization";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";
import HeaderContent from "./_components/HeaderContent";

const EMPTY_ORGANIZATION_DATA: AppGainforestOrganizationInfo.Record = {
  $type: "app.gainforest.organization.info",
  displayName: "",
  wesite: undefined,
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
  const response = await apiCaller.organizationInfo.get({ did });

  if (!response.success && response.code !== "RECORD_NOT_FOUND") {
    throw new Error(response.humanMessage);
  }

  const data = response.success ? response.data.value : EMPTY_ORGANIZATION_DATA;
  const serializedData = JSON.parse(
    JSON.stringify(data)
  ) as AppGainforestOrganizationInfo.Record;

  return (
    <Container>
      <HeaderContent />
      <Hero did={did} initialData={serializedData} />
      <SubHero initialData={serializedData} />
      <AboutOrganization initialData={serializedData} />
      {/* <ProjectSites did={did} /> */}
    </Container>
  );
};

export default OrganizationPage;

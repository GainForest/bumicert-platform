import Container from "@/components/ui/container";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { climateAiSdk } from "@/config/climateai-sdk.server";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import { AppGainforestOrganizationInfo } from "climateai-sdk/lex-api";
import { getSessionFromRequest } from "climateai-sdk/session";
import { serialize } from "climateai-sdk/utilities/transform";
import HeaderContent from "./_components/HeaderContent";
import Hero from "@/app/(upload)/upload/organization/[did]/_components/Hero";
import SubHero from "@/app/(upload)/upload/organization/[did]/_components/SubHero";
import AboutOrganization from "@/app/(upload)/upload/organization/[did]/_components/AboutOrganization";
import SectionForData from "@/app/(upload)/upload/organization/[did]/_components/SectionForData";
import { OrganizationPageHydrator } from "@/app/(upload)/upload/organization/[did]/hydrator";

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

  const serializedData = serialize(data);

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

  return (
    <OrganizationPageHydrator
      initialSerializedData={serializedData}
      initialDid={did}
    >
      <Container>
        <HeaderContent did={did} />
        <Hero initialData={serializedData} initialDid={did} />
        <SubHero initialData={serializedData} />
        <AboutOrganization initialData={serializedData} />
        <hr />
        <SectionForData title="Bumicerts" userDid={did}>
          <div className="w-full h-40 bg-muted rounded-lg mt-2 flex flex-col items-center justify-center text-center text-pretty font-serif text-xl text-muted-foreground font-bold">
            The bumicerts of this organization will appear here.
          </div>
        </SectionForData>
      </Container>
    </OrganizationPageHydrator>
  );
};

export default OrganizationPage;

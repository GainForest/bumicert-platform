import AboutOrganization from "@/app/(upload)/upload/organization/[did]/_components/AboutOrganization";
import Hero from "@/app/(upload)/upload/organization/[did]/_components/Hero";
import SectionForData from "@/app/(upload)/upload/organization/[did]/_components/SectionForData";
import SubHero from "@/app/(upload)/upload/organization/[did]/_components/SubHero";
import { OrganizationPageHydrator } from "@/app/(upload)/upload/organization/[did]/hydrator";
import Container from "@/components/ui/container";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { gainforestSdk } from "@/config/gainforest-sdk.server";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import { AppGainforestOrganizationInfo } from "gainforest-sdk/lex-api";
import { getAppSession } from "gainforest-sdk/oauth";
import { serialize } from "gainforest-sdk/utilities/transform";
import HeaderContent from "./_components/HeaderContent";
import ErrorPage from "./error";

const EMPTY_ORGANIZATION_DATA = {
  $type: "app.gainforest.organization.info" as const,
  displayName: "",
  website: undefined,
  logo: undefined,
  coverImage: undefined,
  shortDescription: { text: "", facets: [] },
  longDescription: { blocks: [] },
  objectives: [],
  startDate: "",
  country: "",
  visibility: "Public" as const,
  createdAt: new Date().toISOString(),
} as AppGainforestOrganizationInfo.Record;

const OrganizationPage = async ({
  params,
}: {
  params: Promise<{ did: string }>;
}) => {
  const { did: encodedDid } = await params;
  const did = decodeURIComponent(encodedDid);

  const apiCaller = gainforestSdk.getServerCaller();
  const [response, error] = await tryCatch(
    apiCaller.gainforest.organization.info.get({
      did,
      pdsDomain: allowedPDSDomains[0],
    })
  );

  let data = EMPTY_ORGANIZATION_DATA;

  if (error) {
    if (!(error instanceof TRPCError)) {
      console.error("An uncaught error occurred:", error);
      return <ErrorPage error={"An unknown error occurred."} />;
    }
    switch (error.code) {
      case "BAD_REQUEST":
        return <ErrorPage error="This organization does not exist." />;
      case "NOT_FOUND":
        // "NOT_FOUND" is expected when the info record is not found. So, we display empty data.
        data = EMPTY_ORGANIZATION_DATA;
        break;
      default:
        console.error("An uncaught TRPCError occurred:", error);
        return <ErrorPage error="An unknown error occurred." />;
    }
  } else {
    data = response.value;
  }

  const visibility = data.visibility as string;
  if (visibility === "Unlisted") {
    const [sessionResponse, sessionError] = await tryCatch(getAppSession());
    const notPubliclyVisible = sessionError ? true : !sessionResponse.isLoggedIn || sessionResponse.did !== did;
    if (notPubliclyVisible) {
      return <ErrorPage error={"This organization is not publicly visible."} />;
    }
  }
  const serializedData = serialize(data);

  return (
    <OrganizationPageHydrator
      initialSerializedData={serializedData}
      initialDid={did}
    >
      <Container>
        <HeaderContent did={did} />
        <Hero initialData={serializedData} initialDid={did} dynamic={false} />
        <SubHero initialData={serializedData} dynamic={false} />
        <AboutOrganization initialData={serializedData} dynamic={false} />
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

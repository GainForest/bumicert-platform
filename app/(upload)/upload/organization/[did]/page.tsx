import Container from "@/components/ui/container";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { gainforestSdk } from "@/config/gainforest-sdk.server";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import { AppGainforestOrganizationInfo } from "gainforest-sdk/lex-api";
import { getAppSession } from "gainforest-sdk/oauth";
import { serialize } from "gainforest-sdk/utilities/transform";
import AboutOrganization from "./_components/AboutOrganization";
import HeaderContent from "./_components/HeaderContent";
import Hero from "./_components/Hero";
import SectionForData from "./_components/SectionForData";
import Sites from "./_components/Sites";
import SubHero from "./_components/SubHero";
import ErrorPage from "./error";
import { OrganizationPageHydrator } from "./hydrator";
import Projects from "./projects/_components/Projects";

const EMPTY_ORGANIZATION_DATA = {
  $type: "app.gainforest.organization.info" as const,
  displayName: "",
  website: undefined,
  logo: undefined,
  coverImage: undefined,
  shortDescription: { text: "", facets: [] },
  longDescription: { blocks: [] },
  objectives: [],
  startDate: undefined,
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
      data = (response as { value: AppGainforestOrganizationInfo.Record }).value;
    }

    const visibility = data.visibility as string;
    if (visibility === "Unlisted") {
      try {
        const session = await getAppSession();
        if (!session.isLoggedIn || session.did !== did) {
          throw new Error("This organization is not publicly visible.");
        }
      } catch {
        throw new Error("This organization is not publicly visible.");
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

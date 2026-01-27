import Container from "@/components/ui/container";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { climateAiSdk } from "@/config/climateai-sdk.server";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import { AppGainforestOrganizationInfo } from "climateai-sdk/lex-api";
import { getSessionFromRequest } from "climateai-sdk/session";
import HeaderContent from "./_components/HeaderContent";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileMeta from "./_components/ProfileMeta";
import ProfileAbout from "./_components/ProfileAbout";
import BumicertsGrid from "./_components/BumicertsGrid";
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

  return (
    <>
      <HeaderContent did={did} />
      <Container className="pb-12">
        <ProfileHeader data={data} did={did} />
        <ProfileMeta data={data} />
        <ProfileAbout data={data} />
        <BumicertsGrid did={did} />
      </Container>
    </>
  );
};

export default OrganizationPage;

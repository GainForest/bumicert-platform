import { allowedPDSDomains } from "@/config/climateai-sdk";
import { climateAiSdk } from "@/config/climateai-sdk.server";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import { AppGainforestOrganizationInfo } from "climateai-sdk/lex-api";
import { getSessionFromRequest } from "climateai-sdk/session";
import { serialize } from "climateai-sdk/utilities/transform";
import ErrorPage from "./error";
import OrganizationPageClient, { type OrganizationPageData } from "./_components/OrganizationPageClient";

const EMPTY_ORGANIZATION_DATA: AppGainforestOrganizationInfo.Record = {
  $type: "app.gainforest.organization.info",
  displayName: "",
  website: undefined,
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

  // Fetch organization info and counts in parallel
  const [
    [orgInfoResponse, orgInfoError],
    [claimsResponse, claimsError],
    [projectsResponse, projectsError],
    [sitesResponse, sitesError],
    [layersResponse, layersError],
  ] = await Promise.all([
    tryCatch(
      apiCaller.gainforest.organization.info.get({
        did,
        pdsDomain: allowedPDSDomains[0],
      })
    ),
    tryCatch(
      apiCaller.hypercerts.claim.activity.getAll({
        did,
        pdsDomain: allowedPDSDomains[0],
      })
    ),
    tryCatch(
      apiCaller.hypercerts.claim.project.getAll({
        did,
        pdsDomain: allowedPDSDomains[0],
      })
    ),
    tryCatch(
      apiCaller.hypercerts.site.getAll({
        did,
        pdsDomain: allowedPDSDomains[0],
      })
    ),
    tryCatch(
      apiCaller.gainforest.organization.layer.getAll({
        did,
        pdsDomain: allowedPDSDomains[0],
      })
    ),
  ]);

  let data = EMPTY_ORGANIZATION_DATA;

  try {
    if (orgInfoError) {
      if (orgInfoError instanceof TRPCError && orgInfoError.code === "NOT_FOUND") {
        // Display empty organization data
      } else {
        if (orgInfoError instanceof TRPCError && orgInfoError.code === "BAD_REQUEST") {
          throw new Error("This organization does not exist.");
        }
        throw new Error("An unknown error occurred.");
      }
    } else {
      data = orgInfoResponse.value;
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

  // Process data
  const pageData: OrganizationPageData = {
    organizationInfo: data,
    bumicerts: !claimsError && claimsResponse ? claimsResponse.activities : [],
    projects: !projectsError && projectsResponse ? projectsResponse : [],
    sites: !sitesError && sitesResponse ? sitesResponse.sites : [],
    layers: !layersError && layersResponse ? layersResponse : [],
  };

  const serializedData = serialize(pageData);

  return (
    <OrganizationPageClient
      did={did}
      serializedData={serializedData}
    />
  );
};

export default OrganizationPage;

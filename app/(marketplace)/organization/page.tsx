import { climateAiSdk } from "@/config/climateai-sdk.server";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { getSessionFromRequest } from "climateai-sdk/session";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import Dashboard from "./_components/Dashboard";
import NotSignedIn from "./_components/NotSignedIn";
import { AppGainforestOrganizationInfo } from "climateai-sdk/lex-api";

const EMPTY_ORGANIZATION_DATA: AppGainforestOrganizationInfo.Record = {
  $type: "app.gainforest.organization.info",
  displayName: "My Organization",
  shortDescription: "",
  longDescription: "",
  objectives: [],
  startDate: "",
  country: "",
  visibility: "Public",
  createdAt: new Date().toISOString(),
};

export default async function MyOrganizationPage() {
  let session;
  try {
    session = await getSessionFromRequest();
  } catch (e) {
    // If session check fails/throws, we assume not signed in
    console.error("Failed to get session", e);
    return <NotSignedIn />;
  }

  if (!session) {
    return <NotSignedIn />;
  }

  const did = session.did;
  const apiCaller = climateAiSdk.getServerCaller();

  // Parallel data fetching
  const [
    [orgInfoResponse, orgInfoError],
    [claimsResponse, claimsError],
    [projectsResponse, projectsError],
    [sitesResponse, sitesError]
  ] = await Promise.all([
    tryCatch(apiCaller.gainforest.organization.info.get({
      did,
      pdsDomain: allowedPDSDomains[0],
    })),
    tryCatch(apiCaller.hypercerts.claim.activity.getAll({
      did,
      pdsDomain: allowedPDSDomains[0],
    })),
    tryCatch(apiCaller.hypercerts.claim.project.getAll({
      did,
      pdsDomain: allowedPDSDomains[0],
    })),
    tryCatch(apiCaller.hypercerts.site.getAll({
      did,
      pdsDomain: allowedPDSDomains[0],
    })),
  ]);

  // Process Organization Info
  let organizationInfo = EMPTY_ORGANIZATION_DATA;
  if (!orgInfoError && orgInfoResponse) {
    organizationInfo = orgInfoResponse.value;
  }

  // Process Counts
  const bumicertsCount = (!claimsError && claimsResponse) ? claimsResponse.activities.length : 0;
  const projectsCount = (!projectsError && projectsResponse) ? projectsResponse.length : 0;
  // Site response format is { sites: [], defaultSite: ... }
  const sitesCount = (!sitesError && sitesResponse) ? sitesResponse.sites.length : 0;

  return (
    <Dashboard
      did={did}
      organizationInfo={organizationInfo}
      bumicertsCount={bumicertsCount}
      projectsCount={projectsCount}
      sitesCount={sitesCount}
    />
  );
}

import { GetRecordResponse, getServerCaller } from "@/server/routers/_app";
import type { AppGainforestOrganizationSite } from "@/lexicon-api";
import React from "react";
import ProjectSitesClient from "./ProjectSitesClient";
import type { AppGainforestOrganizationDefaultSite } from "@/lexicon-api";

const ProjectSites = async ({ did }: { did: string }) => {
  const apiCaller = getServerCaller();
  const allProjectSitesResponse = await apiCaller.listProjectSites({ did });
  const defaultProjectSiteResponse = await apiCaller.getDefaultProjectSite({
    did,
  });

  return (
    <ProjectSitesClient
      initialAllProjectSites={allProjectSitesResponse.records.map(
        (r) => r as GetRecordResponse<AppGainforestOrganizationSite.Record>
      )}
      initialDefaultProjectSite={
        defaultProjectSiteResponse.value as AppGainforestOrganizationDefaultSite.Record
      }
    />
  );
};
export default ProjectSites;

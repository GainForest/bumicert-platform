import { gainforestSdk } from "@/config/gainforest-sdk.server";
import { atprotoSDK } from "@/lib/atproto";
import React from "react";
import ProjectsClient, {
  AllProjectsData,
  ProjectsSectionClient,
} from "./ProjectsClient";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import { serialize } from "gainforest-sdk/utilities/transform";
import { allowedPDSDomains } from "@/config/gainforest-sdk";

const Projects = async ({ did }: { did: string }) => {
  const apiCaller = gainforestSdk.getServerCaller(atprotoSDK);

  // Placeholder API call - replace with actual endpoint when available
  // For now, gracefully handle if the endpoint doesn't exist
  // TODO: Replace with actual endpoint: apiCaller.gainforest.organization.project.getAll
  let allProjectsData: AllProjectsData = {
    projects: [],
  };

  const [response, error] = await tryCatch(
    apiCaller.hypercerts.claim.project.getAll({
      did,
      pdsDomain: allowedPDSDomains[0],
    })
  );
  if (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      // Display empty projects
    } else {
      throw new Error("An unknown error occurred.");
    }
  } else {
    allProjectsData = {
      projects: response,
    };
  }

  const serializedInitialData = serialize(allProjectsData);

  return (
    <ProjectsSectionClient
      did={did}
      serializedInitialData={serializedInitialData}
    />
  );
};
export default Projects;

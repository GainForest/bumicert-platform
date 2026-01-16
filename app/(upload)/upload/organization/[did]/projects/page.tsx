import Container from "@/components/ui/container";
import React from "react";
import { getSessionFromRequest } from "climateai-sdk/session";
import { redirect } from "next/navigation";
import ProjectsClient, {
  AllProjectsData,
} from "./_components/Projects/ProjectsClient";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import { serialize } from "climateai-sdk/utilities/transform";
import { climateAiSdk } from "@/config/climateai-sdk.server";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import HeaderContent from "../_components/HeaderContent";
import ProjectsHeaderContent from "./HeaderContent";

const ProjectsPage = async ({
  params,
}: {
  params: Promise<{ did: string }>;
}) => {
  const { did: encodedDid } = await params;
  const did = decodeURIComponent(encodedDid);

  // Check if user is authenticated and owns this organization
  let session;
  try {
    session = await getSessionFromRequest();
  } catch {
    // Not authenticated, redirect to organization page
    redirect(`/organization/${encodeURIComponent(did)}`);
  }

  if (!session || session.did !== did) {
    // User doesn't own this organization, redirect to organization page
    redirect(`/organization/${encodeURIComponent(did)}`);
  }

  const apiCaller = climateAiSdk.getServerCaller();

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
    <Container>
      <ProjectsHeaderContent />
      <div className="p-2">
        <h1 className="font-serif font-bold text-3xl mb-6">My Projects</h1>
        <ProjectsClient
          did={did}
          serializedInitialData={serializedInitialData}
        />
      </div>
    </Container>
  );
};

export default ProjectsPage;

import Container from "@/components/ui/container";
import React from "react";
import { getAppSession } from "gainforest-sdk/oauth";
import { redirect } from "next/navigation";
import ProjectsClient, {
  AllProjectsData,
} from "./_components/Projects/ProjectsClient";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import { serialize } from "gainforest-sdk/utilities/transform";
import { gainforestSdk } from "@/config/gainforest-sdk.server";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import HeaderContent from "../_components/HeaderContent";
import ProjectsHeaderContent from "./HeaderContent";
import ErrorPage from "./error";

const ProjectsPage = async ({
  params,
}: {
  params: Promise<{ did: string }>;
}) => {
  const { did: encodedDid } = await params;
  const did = decodeURIComponent(encodedDid);

  const pdsDomain = allowedPDSDomains[0];
  if (!pdsDomain) {
    return <ErrorPage error={new Error("No PDS domain configured.")} />;
  }

  // Check if user is authenticated and owns this organization
  const session = await getAppSession();

  if (!session.isLoggedIn || session.did !== did) {
    // User doesn't own this organization, redirect to organization page
    redirect(`/organization/${encodeURIComponent(did)}`);
  }

  const apiCaller = gainforestSdk.getServerCaller();

  // Placeholder API call - replace with actual endpoint when available
  // For now, gracefully handle if the endpoint doesn't exist
  // TODO: Replace with actual endpoint: apiCaller.gainforest.organization.project.getAll
  let allProjectsData: AllProjectsData = {
    projects: [],
  };

  try {
    const [response, error] = await tryCatch(
      apiCaller.hypercerts.claim.project.getAll({
        did,
        pdsDomain,
      })
    );
    if (error) {
      if (error instanceof TRPCError && error.code === "NOT_FOUND") {
        // Display empty projects
      } else {
        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new Error("Unable to fetch projects.");
        }
        throw new Error("An unknown error occurred.");
      }
    } else {
      allProjectsData = {
        projects: response,
      };
    }
  } catch (error) {
    console.error(
      "Redirecting to error page due to the following error:",
      error
    );
    return <ErrorPage error={error as Error} />;
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

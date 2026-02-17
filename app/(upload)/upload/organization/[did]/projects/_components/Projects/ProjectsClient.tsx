"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import useHydratedData from "@/hooks/use-hydration";
import ProjectCard from "./ProjectCard";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { useAtprotoStore } from "@/components/stores/atproto";
import {
  SerializedSuperjson,
  deserialize,
} from "gainforest-sdk/utilities/transform";
import { GetRecordResponse } from "gainforest-sdk/types";
import Link from "next/link";
import { OrgHypercertsClaimCollection } from "gainforest-sdk/lex-api";
import SectionForData from "../../../_components/SectionForData";
import { links } from "@/lib/links";

export type AllProjectsData = {
  projects: GetRecordResponse<OrgHypercertsClaimCollection.Record>[];
};

type ProjectSectionClientProps = {
  did: string;
  serializedInitialData: SerializedSuperjson<AllProjectsData>;
  showManageButton?: boolean;
};

const ProjectsClient = ({
  did,
  serializedInitialData,
  showManageButton = false,
}: ProjectSectionClientProps) => {
  const initialData = deserialize(serializedInitialData);
  const auth = useAtprotoStore((state) => state.auth);
  const shouldEdit = auth.status === "AUTHENTICATED" && auth.user.did === did;

  // Placeholder query - replace with actual API endpoint when available
  // For now, this will gracefully handle if the endpoint doesn't exist
  // TODO: Replace with actual endpoint: trpcApi.gainforest.organization.project.getAll.useQuery
  const reactiveData = null;
  const isReactiveDataUpdating = false;

  const data = useHydratedData(initialData, reactiveData ?? null);
  const allProjects = data.projects;

  return (
    <>
      {allProjects.length === 0 ? (
        <div className="w-full bg-muted h-40 rounded-lg mt-2 flex flex-col items-center justify-center text-center text-pretty text-sm gap-2">
          <span className="font-serif font-bold text-xl text-muted-foreground">
            No projects yet.{" "}
          </span>
          {shouldEdit && showManageButton && (
            <Link href={links.upload.projects(did)}>
              <Button variant={"outline"} size={"sm"} className="mt-2">
                Manage projects
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 mt-4">
          {allProjects.map((project) => {
            return (
              <ProjectCard key={project.uri} projectData={project} did={did} />
            );
          })}
        </div>
      )}
    </>
  );
};

export const ProjectsSectionClient = (props: ProjectSectionClientProps) => {
  return (
    <SectionForData
      title="Projects"
      userDid={props.did}
      manageUrl={links.upload.projects(props.did)}
    >
      <ProjectsClient {...props} showManageButton />
    </SectionForData>
  );
};

export default ProjectsClient;

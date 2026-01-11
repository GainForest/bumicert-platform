"use client";
import React from "react";
import { getStripedBackground } from "@/lib/getStripedBackground";
import { cn } from "@/lib/utils";
import { AllProjectsData } from "./ProjectsClient";
import { PubLeafletBlocksText } from "climateai-sdk/lex-api";
import { $Typed } from "climateai-sdk/lex-api/utils";

export type ProjectData = AllProjectsData["projects"][number];
type ProjectCardProps = {
  projectData: ProjectData;
  did: string;
};

const ProjectCard = ({ projectData, did }: ProjectCardProps) => {
  const project = projectData.value;

  const ecocertsCount = project.activities?.length ?? 0;
  const measuredTreesClustersCount = 0;
  const sitesCount = 0;
  const layersCount = 0;

  return (
    <div
      className="border border-border rounded-xl overflow-hidden shadow-lg"
      style={{
        background: getStripedBackground(
          {
            variable: "--muted",
          },
          {
            variable: "--foreground",
            opacity: 10,
          },
          2
        ),
      }}
    >
      <div className="bg-background rounded-xl shadow-sm">
        <div className="px-3 py-4">
          <h3 className="font-medium text-lg mb-2">{project.title}</h3>
          {project.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {project.description.blocks.map((doc) => {
                const block = doc.block;
                if (block.$type === "pub.leaflet.blocks#text") {
                  const typedBlock = block as $Typed<PubLeafletBlocksText.Main>;
                  return typedBlock.plaintext;
                }
                return null;
              })}
            </p>
          )}

          <hr className="mt-3 mb-3 opacity-50" />

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ecocerts</span>
              <span className="font-medium">{ecocertsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Measured Tree Clusters
              </span>
              <span className="font-medium">{measuredTreesClustersCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sites</span>
              <span className="font-medium">{sitesCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Layers</span>
              <span className="font-medium">{layersCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

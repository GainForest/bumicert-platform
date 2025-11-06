"use client";

import type {
  AppGainforestOrganizationDefaultSite,
  AppGainforestOrganizationSite,
} from "@/lexicon-api";
import { GetRecordResponse } from "@/server/utils";
import React, { useState } from "react";

const ProjectSitesClient = ({
  initialAllProjectSites,
  initialDefaultProjectSite,
}: {
  initialAllProjectSites: GetRecordResponse<AppGainforestOrganizationSite.Record>[];
  initialDefaultProjectSite: AppGainforestOrganizationDefaultSite.Record | null;
}) => {
  const [allProjectSites] = useState(initialAllProjectSites);
  const [defaultProjectSite] = useState(initialDefaultProjectSite);

  return (
    <div className="p-2 mt-4">
      <h2 className="font-serif font-bold text-2xl">Project Sites</h2>
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 mt-2">
        {allProjectSites.map((site) => {
          const isDefaultSite = site.uri === defaultProjectSite?.site;
          return (
            <div key={site.cid} className="border border-border rounded-xl p-1">
              <iframe
                className="h-40 w-full rounded-lg"
                src={`https://gainforest.app/geo/view?source-value=${site.value.boundary}`}
              />
              <div className="p-2">
                <div className="flex items-center">
                  <h3 className="font-medium text-lg">{site.value.name}</h3>
                  {isDefaultSite ?
                    <span className="bg-primary px-1 py-0.5 text-xs">
                      Default
                    </span>
                  : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {site.value.area} hectares
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* <p className="text-justify mt-2">{data.longDescription}</p> */}
    </div>
  );
};

export default ProjectSitesClient;

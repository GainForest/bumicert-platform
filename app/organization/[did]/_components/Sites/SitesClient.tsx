"use client";

import { Button } from "@/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import useHydratedData from "@/hooks/use-hydration";
import SiteCard from "./SiteCard";
import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "@/lib/trpc/client";
import { useModal } from "@/components/ui/modal/context";
import { SiteEditorModal, SiteEditorModalId } from "./SiteEditorModal";
import { Serialize, unserialize } from "@/lib/atproto/serialization";
import { useAtprotoStore } from "@/components/stores/atproto";

const getAllSites = trpcClient.gainforest.site.getAll.query;
export type AllSitesData = Awaited<ReturnType<typeof getAllSites>>;

const SitesClient = ({
  did,
  serializedInitialData,
}: {
  did: string;
  serializedInitialData: Serialize<AllSitesData>;
}) => {
  const initialData = unserialize(serializedInitialData);
  const auth = useAtprotoStore((state) => state.auth);
  const shouldEdit = auth.status === "AUTHENTICATED" && auth.user.did === did;
  const {
    data: reactiveDataSerialized,
    isPlaceholderData: isOlderReactiveData,
  } = useQuery({
    queryKey: ["getAllSites", did],
    queryFn: async () =>
      (await getAllSites({ did })) as Serialize<AllSitesData>,
  });
  const isReactiveDataUpdating = isOlderReactiveData;
  const reactiveData = unserialize(reactiveDataSerialized);

  const data = useHydratedData(initialData, reactiveData ?? null);
  const allSites = data.sites;
  const defaultSite = data.defaultSite;
  console.log("=============");
  console.log(allSites);
  console.log("=============");

  const { pushModal, show } = useModal();

  const handleAddSite = () => {
    pushModal(
      {
        id: SiteEditorModalId,
        content: <SiteEditorModal initialData={null} did={did} />,
      },
      true
    );
    show();
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl">Sites</h2>
      </div>

      <section
        className={cn("w-full", isReactiveDataUpdating && "animate-pulse")}
      >
        {allSites.length === 0 ?
          <div className="w-full bg-muted h-40 rounded-lg mt-2 flex flex-col items-center justify-center text-center text-pretty text-sm">
            <span className="font-serif font-bold text-xl text-muted-foreground">
              No sites yet. {shouldEdit && "Click the button below to add one."}
            </span>

            {shouldEdit && (
              <Button
                variant={"outline"}
                size={"sm"}
                className="mt-2"
                onClick={() => handleAddSite()}
              >
                <CirclePlusIcon className="opacity-40" />
                Add a new site
              </Button>
            )}
          </div>
        : <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 mt-4">
            {allSites.map((site) => {
              return (
                <SiteCard
                  key={site.uri}
                  siteData={site}
                  defaultSite={defaultSite?.value.site ?? null}
                  did={did}
                />
              );
            })}

            {shouldEdit && (
              <Button
                variant={"outline"}
                className="h-auto rounded-xl flex-col text-lg"
                onClick={() => handleAddSite()}
              >
                <CirclePlusIcon className="size-8 opacity-40" />
                Add a new site
              </Button>
            )}
          </div>
        }
      </section>
    </div>
  );
};

export default SitesClient;

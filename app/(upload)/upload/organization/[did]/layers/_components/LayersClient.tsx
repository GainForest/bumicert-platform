"use client";

import { Button } from "@/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import useHydratedData from "@/hooks/use-hydration";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { useModal } from "@/components/ui/modal/context";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { useAtprotoStore } from "@/components/stores/atproto";
import {
  SerializedSuperjson,
  deserialize,
} from "climateai-sdk/utilities/transform";
import { AppGainforestOrganizationLayer } from "climateai-sdk/lex-api";
import { GetRecordResponse } from "climateai-sdk/types";
import {
  LayerEditorModal,
  LayerEditorModalId,
} from "../../../../../../../components/global/modals/upload/layer/editor";
import LayerCard from "./LayerCard";

export type AllLayersData =
  GetRecordResponse<AppGainforestOrganizationLayer.Record>[];

const LayersClient = ({
  did,
  serializedInitialData,
}: {
  did: string;
  serializedInitialData: SerializedSuperjson<AllLayersData>;
}) => {
  const initialData = deserialize(serializedInitialData);
  const auth = useAtprotoStore((state) => state.auth);
  const shouldEdit = auth.status === "AUTHENTICATED" && auth.user.did === did;

  const { data: reactiveData, isPlaceholderData: isOlderReactiveData } =
    trpcApi.gainforest.organization.layer.getAll.useQuery({
      did,
      pdsDomain: allowedPDSDomains[0],
    });
  const isReactiveDataUpdating = isOlderReactiveData;

  const data = useHydratedData(initialData, reactiveData ?? null);
  const allLayers = data ?? [];

  const { pushModal, show } = useModal();

  const handleAddLayer = () => {
    pushModal(
      {
        id: LayerEditorModalId,
        content: <LayerEditorModal initialData={null} />,
      },
      true
    );
    show();
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl">Layers</h2>
      </div>

      <section
        className={cn("w-full", isReactiveDataUpdating && "animate-pulse")}
      >
        {allLayers.length === 0 ? (
          <div className="w-full bg-muted h-40 rounded-lg mt-2 flex flex-col items-center justify-center text-center text-pretty text-sm">
            <span className="font-serif font-bold text-xl text-muted-foreground">
              No layers uploaded yet. {shouldEdit && "Add one below."}
            </span>

            {shouldEdit && (
              <Button
                variant={"outline"}
                size={"sm"}
                className="mt-2"
                onClick={() => handleAddLayer()}
              >
                <CirclePlusIcon className="opacity-40" />
                Add a new layer
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 mt-4">
            {allLayers.map((layer) => {
              return <LayerCard key={layer.uri} layerData={layer} did={did} />;
            })}

            {shouldEdit && (
              <Button
                variant={"outline"}
                className="h-auto rounded-xl flex-col text-lg"
                onClick={() => handleAddLayer()}
              >
                <CirclePlusIcon className="size-8 opacity-40" />
                Add a new layer
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default LayersClient;

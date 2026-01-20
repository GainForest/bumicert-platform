"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, ArrowUpRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAtprotoStore } from "@/components/stores/atproto";
import { useModal } from "@/components/ui/modal/context";
import {
  LayerEditorModal,
  LayerEditorModalId,
} from "../../../../../../../components/global/modals/upload/layer/editor";
import { AllLayersData } from "./LayersClient";
import { cn } from "@/lib/utils";
import Link from "next/link";

type LayerCardProps = {
  layerData: AllLayersData[number];
  did: string;
};

const friendlyType = (type?: string) =>
  type ? type.replaceAll("_", " ").replace("geojson", "GeoJSON") : "Layer";

const LayerCard = ({ layerData, did }: LayerCardProps) => {
  const layer = layerData.value;
  const auth = useAtprotoStore((state) => state.auth);
  const shouldEdit = auth.status === "AUTHENTICATED" && auth.user.did === did;
  const { pushModal, show } = useModal();

  const handleEdit = () => {
    pushModal(
      {
        id: LayerEditorModalId,
        content: <LayerEditorModal initialData={layerData} />,
      },
      true
    );
    show();
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-background">
      <div className="px-3 py-3 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-lg leading-tight">{layer.name}</h3>
          <p className="text-sm text-muted-foreground">
            {friendlyType(layer.type)}
          </p>
          {layer.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {layer.description}
            </p>
          )}
          {layer.uri && (
            <Link
              href={layer.uri}
              target="_blank"
              className={cn(
                "mt-2 inline-flex items-center gap-1 text-primary text-sm font-medium"
              )}
            >
              View drone data link <ArrowUpRight className="size-3" />
            </Link>
          )}
        </div>
        {shouldEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="size-4 mr-2" />
                Edit layer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="px-3 pb-3 text-xs text-muted-foreground">
        {layer.createdAt
          ? `Added ${new Date(layer.createdAt).toLocaleString()}`
          : "Added date unavailable"}
      </div>
    </div>
  );
};

export default LayerCard;

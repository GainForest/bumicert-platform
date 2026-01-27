"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Map, Layers, FileText, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import {
  SiteEditorModal,
  SiteEditorModalId,
} from "@/components/global/modals/upload/site/editor";
import {
  LayerEditorModal,
  LayerEditorModalId,
} from "@/components/global/modals/upload/layer/editor";
import AssetCard from "./AssetCard";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { Loader2 } from "lucide-react";

type AssetType = "all" | "sites" | "layers" | "bumicerts";

const filters: { id: AssetType; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: FileText },
  { id: "sites", label: "Sites", icon: Map },
  { id: "layers", label: "Layers", icon: Layers },
  { id: "bumicerts", label: "Bumicerts", icon: FileText },
];

interface DashboardProps {
  did: string;
}

const Dashboard = ({ did }: DashboardProps) => {
  const [activeFilter, setActiveFilter] = useState<AssetType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { pushModal, show } = useModal();

  // Fetch sites
  const { data: sitesData, isLoading: sitesLoading } =
    trpcApi.hypercerts.site.getAll.useQuery(
      { did, pdsDomain: allowedPDSDomains[0] },
      { enabled: !!did }
    );

  // Fetch layers
  const { data: layersData, isLoading: layersLoading } =
    trpcApi.hypercerts.monitoringLayer.getAll.useQuery(
      { did, pdsDomain: allowedPDSDomains[0] },
      { enabled: !!did }
    );

  // Fetch bumicerts
  const { data: bumicertsData, isLoading: bumicertsLoading } =
    trpcApi.hypercerts.claim.activity.getAll.useQuery(
      { did, pdsDomain: allowedPDSDomains[0] },
      { enabled: !!did }
    );

  const isLoading = sitesLoading || layersLoading || bumicertsLoading;

  // Combine all assets into a unified list
  const allAssets = useMemo(() => {
    const assets: {
      id: string;
      type: "sites" | "layers" | "bumicerts";
      name: string;
      description?: string;
      createdAt?: string;
      data: unknown;
    }[] = [];

    // Add sites
    sitesData?.sites?.forEach((site) => {
      assets.push({
        id: site.uri,
        type: "sites",
        name: site.value.name,
        description: site.value.description,
        createdAt: site.value.createdAt,
        data: site,
      });
    });

    // Add layers
    layersData?.layers?.forEach((layer) => {
      assets.push({
        id: layer.uri,
        type: "layers",
        name: layer.value.name,
        description: layer.value.description,
        createdAt: layer.value.createdAt,
        data: layer,
      });
    });

    // Add bumicerts
    bumicertsData?.activities?.forEach((bumicert) => {
      assets.push({
        id: bumicert.uri,
        type: "bumicerts",
        name: bumicert.value.title,
        description: bumicert.value.shortDescription,
        createdAt: bumicert.value.createdAt,
        data: bumicert,
      });
    });

    return assets;
  }, [sitesData, layersData, bumicertsData]);

  // Filter assets
  const filteredAssets = useMemo(() => {
    let filtered = allAssets;

    if (activeFilter !== "all") {
      filtered = filtered.filter((asset) => asset.type === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(query) ||
          asset.description?.toLowerCase().includes(query)
      );
    }

    // Sort by createdAt (newest first)
    return filtered.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [allAssets, activeFilter, searchQuery]);

  const handleAddSite = () => {
    pushModal(
      { id: SiteEditorModalId, content: <SiteEditorModal initialData={null} /> },
      true
    );
    show();
  };

  const handleAddLayer = () => {
    pushModal(
      { id: LayerEditorModalId, content: <LayerEditorModal initialData={null} /> },
      true
    );
    show();
  };

  const counts = {
    all: allAssets.length,
    sites: sitesData?.sites?.length ?? 0,
    layers: layersData?.layers?.length ?? 0,
    bumicerts: bumicertsData?.activities?.length ?? 0,
  };

  return (
    <div className="mt-8">
      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {/* Filter pills */}
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-all",
                  activeFilter === filter.id
                    ? "bg-background text-foreground shadow-sm font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <filter.icon className="size-3.5" strokeWidth={1.5} />
                <span>{filter.label}</span>
                <span className="text-xs text-muted-foreground ml-0.5">
                  {counts[filter.id]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm bg-background border border-border/50 rounded-lg focus:outline-none focus:border-border w-48 placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Add button */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleAddSite}>
            <Plus className="size-4 mr-1" strokeWidth={1.5} />
            Site
          </Button>
          <Button size="sm" variant="outline" onClick={handleAddLayer}>
            <Plus className="size-4 mr-1" strokeWidth={1.5} />
            Layer
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" strokeWidth={1.5} />
        </div>
      ) : filteredAssets.length === 0 ? (
        <EmptyState
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          onAddSite={handleAddSite}
          onAddLayer={handleAddLayer}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              type={asset.type}
              name={asset.name}
              description={asset.description}
              createdAt={asset.createdAt}
              data={asset.data}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EmptyState = ({
  activeFilter,
  searchQuery,
  onAddSite,
  onAddLayer,
}: {
  activeFilter: AssetType;
  searchQuery: string;
  onAddSite: () => void;
  onAddLayer: () => void;
}) => {
  if (searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Search className="size-10 text-muted-foreground/30 mb-4" strokeWidth={1} />
        <p className="text-muted-foreground">No results found for &ldquo;{searchQuery}&rdquo;</p>
      </div>
    );
  }

  const messages: Record<AssetType, { title: string; description: string; action?: () => void; actionLabel?: string }> = {
    all: {
      title: "No assets yet",
      description: "Start by adding your first site or layer",
    },
    sites: {
      title: "No sites yet",
      description: "Add a site boundary to get started",
      action: onAddSite,
      actionLabel: "Add Site",
    },
    layers: {
      title: "No layers yet",
      description: "Add a monitoring layer to track changes",
      action: onAddLayer,
      actionLabel: "Add Layer",
    },
    bumicerts: {
      title: "No bumicerts yet",
      description: "Create your first bumicert from the Create page",
    },
  };

  const msg = messages[activeFilter];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        {activeFilter === "sites" && <Map className="size-7 text-muted-foreground/50" strokeWidth={1.25} />}
        {activeFilter === "layers" && <Layers className="size-7 text-muted-foreground/50" strokeWidth={1.25} />}
        {activeFilter === "bumicerts" && <FileText className="size-7 text-muted-foreground/50" strokeWidth={1.25} />}
        {activeFilter === "all" && <Plus className="size-7 text-muted-foreground/50" strokeWidth={1.25} />}
      </div>
      <h3 className="font-medium text-foreground mb-1">{msg.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{msg.description}</p>
      {msg.action && (
        <Button size="sm" onClick={msg.action}>
          <Plus className="size-4 mr-1" strokeWidth={1.5} />
          {msg.actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Dashboard;

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CirclePlusIcon,
  Search,
  LayoutGrid,
  List,
  ChevronLeft,
  MapPin,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useHydratedData from "@/hooks/use-hydration";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { useAtprotoStore } from "@/components/stores/atproto";
import {
  SerializedSuperjson,
  deserialize,
} from "gainforest-sdk/utilities/transform";
import { AppGainforestOrganizationRecordingsAudio } from "gainforest-sdk/lex-api";
import { GetRecordResponse } from "gainforest-sdk/types";
import {
  useQueryState,
  parseAsString,
  parseAsStringLiteral,
  parseAsFloat,
} from "nuqs";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  haversineDistance,
  parseCoordinateString,
  PRECISION_LEVELS,
} from "@/lib/haversine";
import AudioCard from "./AudioCard";
import AudioEditor from "./AudioEditor";
import AudioListItem from "./AudioListItem";

export type AllAudioData =
  GetRecordResponse<AppGainforestOrganizationRecordingsAudio.Record>[];

export type AudioData = AllAudioData[number];

const viewOptions = ["grid", "list", "add", "edit"] as const;

const precisionOptions = ["exact", "nearby", "area", "region"] as const;

const precisionLabels: Record<(typeof precisionOptions)[number], string> = {
  exact: "Exact",
  nearby: "Nearby",
  area: "Area",
  region: "Region",
};

const AudioClient = ({
  did,
  serializedInitialData,
}: {
  did: string;
  serializedInitialData: SerializedSuperjson<AllAudioData>;
}) => {
  const initialData = deserialize(serializedInitialData);
  const auth = useAtprotoStore((state) => state.auth);
  const shouldEdit = auth.status === "AUTHENTICATED" && auth.user.did === did;

  const { data: reactiveResponse, isPlaceholderData: isOlderReactiveData } =
    trpcApi.gainforest.organization.recordings.audio.getAll.useQuery({
      did,
      pdsDomain: allowedPDSDomains[0],
    });
  const reactiveData = reactiveResponse?.recordings ?? null;
  const isReactiveDataUpdating = isOlderReactiveData;

  const data = useHydratedData(initialData, reactiveData);
  const allAudio = data ?? [];

  // URL state management (nuqs)
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    parseAsString.withDefault("")
  );

  const [viewMode, setViewMode] = useQueryState(
    "view",
    parseAsStringLiteral(viewOptions).withDefault("grid")
  );

  // Edit mode URI tracking
  const [editUri, setEditUri] = useQueryState(
    "editUri",
    parseAsString.withDefault("")
  );

  // Coordinate filter URL state
  const [filterLat, setFilterLat] = useQueryState(
    "filterLat",
    parseAsFloat.withDefault(NaN)
  );
  const [filterLng, setFilterLng] = useQueryState(
    "filterLng",
    parseAsFloat.withDefault(NaN)
  );
  const [filterPrecision, setFilterPrecision] = useQueryState(
    "filterPrecision",
    parseAsStringLiteral(precisionOptions).withDefault("nearby")
  );

  // Local UI state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isFilterActive =
    !Number.isNaN(filterLat) && !Number.isNaN(filterLng);

  // Filter logic
  const filteredAudio = allAudio.filter((audio) => {
    const matchesSearch =
      !searchQuery ||
      audio.value.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audio.value.description?.text
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesLocation = (() => {
      if (Number.isNaN(filterLat) || Number.isNaN(filterLng)) return true; // no filter active
      const coords = audio.value.metadata?.coordinates;
      if (!coords) return false; // recording has no coordinates, exclude it
      const parsed = parseCoordinateString(coords);
      if (!parsed) return false;
      const distance = haversineDistance(
        filterLat,
        filterLng,
        parsed.lat,
        parsed.lng
      );
      return distance <= PRECISION_LEVELS[filterPrecision];
    })();

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="p-2">
      {/* Header Row - only visible when not in add/edit mode */}
      {viewMode !== "add" && viewMode !== "edit" && (
        <div>
          <h2 className="font-serif font-bold text-2xl">Audio Recordings</h2>
          <p className="text-sm text-muted-foreground">
            Upload and manage audio recordings for your organization.
          </p>
        </div>
      )}

      {/* Add/Edit Mode View */}
      {(viewMode === "add" || viewMode === "edit") && shouldEdit && (
        <>
          <div className="mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setViewMode("list");
                setEditUri(null);
              }}
            >
              <ChevronLeft className="size-4" />
              Back
            </Button>
          </div>
          <AudioEditor
            did={did}
            mode={viewMode as "add" | "edit"}
            initialData={
              viewMode === "edit"
                ? allAudio.find((a) => a.uri === editUri) ?? null
                : null
            }
            onClose={() => {
              setViewMode("list");
              setEditUri(null);
            }}
            onSuccess={() => {
              // AudioEditor handles the 3s delay internally
            }}
          />
        </>
      )}

      {/* Toolbar - only shown when not in add/edit mode */}
      {viewMode !== "add" && viewMode !== "edit" && (
        <div className="mt-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search recordings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value || null)}
                className="pl-9"
              />
            </div>

            {/* Location Filter Button */}
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="flex items-center gap-2"
            >
              <MapPin className="size-4" />
              Location
              {isFilterActive && (
                <Badge variant="secondary" className="ml-1">
                  {precisionLabels[filterPrecision]}
                </Badge>
              )}
            </Button>

            {/* View Toggle */}
            <div className="flex items-center border rounded-lg p-0.5 gap-0.5">
              <Button
                size="icon"
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="h-8 w-8"
              >
                <LayoutGrid className="size-4" />
              </Button>
              <div className="h-4 w-0.5 bg-border" />
              <Button
                size="icon"
                variant={viewMode === "list" ? "secondary" : "ghost"}
                onClick={() => setViewMode("list")}
                className="h-8 w-8"
              >
                <List className="size-4" />
              </Button>
            </div>

            {/* Add Button - at the end */}
            {shouldEdit && (
              <Button onClick={() => setViewMode("add")}>
                <CirclePlusIcon className="opacity-60" />
                Add
              </Button>
            )}
          </div>

          {/* Expandable Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div className="flex flex-col gap-3 mt-3 p-3 border border-border rounded-lg bg-muted/30">
                  {/* Row 1: Lat/Lng inputs */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Latitude (e.g. -3.4653)"
                      value={Number.isNaN(filterLat) ? "" : filterLat}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setFilterLat(isNaN(val) ? null : val);
                      }}
                    />
                    <Input
                      type="number"
                      step="any"
                      placeholder="Longitude (e.g. 142.0723)"
                      value={Number.isNaN(filterLng) ? "" : filterLng}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setFilterLng(isNaN(val) ? null : val);
                      }}
                    />
                  </div>

                  {/* Row 2: Precision toggle */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-sm text-muted-foreground">
                      Precision:
                    </span>
                    <div className="flex items-center border rounded-lg p-0.5 gap-0.5 flex-wrap">
                      {precisionOptions.map((level, index) => (
                        <span key={level} className="contents">
                          {index > 0 && (
                            <div className="h-4 w-0.5 bg-border" />
                          )}
                          <Button
                            size="sm"
                            variant={
                              filterPrecision === level ? "secondary" : "ghost"
                            }
                            onClick={() => setFilterPrecision(level)}
                          >
                            {precisionLabels[level]}
                          </Button>
                        </span>
                      ))}
                    </div>
                    {/* Clear button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setFilterLat(null);
                        setFilterLng(null);
                        setFilterPrecision(null);
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Content - only shown when not in add/edit mode */}
      {viewMode !== "add" && viewMode !== "edit" && (
        <section
          className={cn("w-full", isReactiveDataUpdating && "animate-pulse")}
        >
          {filteredAudio.length === 0 ? (
            <div className="w-full bg-muted h-40 rounded-lg mt-4 flex flex-col items-center justify-center text-center">
              {allAudio.length === 0 ? (
                <>
                  <span className="font-serif font-bold text-xl text-muted-foreground">
                    No audio recordings uploaded yet.
                  </span>
                  {shouldEdit && (
                    <Button className="mt-3" onClick={() => setViewMode("add")}>
                      <CirclePlusIcon className="opacity-60" />
                      Add recording
                    </Button>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground">
                  {isFilterActive
                    ? "No recordings found near this location."
                    : "No recordings match your search criteria."}
                </span>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {filteredAudio.map((audio) => (
                <AudioCard key={audio.uri} audioData={audio} did={did} />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border mt-4">
              {filteredAudio.map((audio) => (
                <AudioListItem
                  key={audio.uri}
                  audioData={audio}
                  did={did}
                  onEdit={(uri) => {
                    setEditUri(uri);
                    setViewMode("edit");
                  }}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default AudioClient;

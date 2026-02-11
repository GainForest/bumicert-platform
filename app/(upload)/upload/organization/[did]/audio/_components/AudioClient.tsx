"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CirclePlusIcon, Search, LayoutGrid, List, ChevronLeft } from "lucide-react";
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
} from "nuqs";
import AudioCard from "./AudioCard";
import AudioEditor from "./AudioEditor";
import AudioListItem from "./AudioListItem";

export type AllAudioData =
  GetRecordResponse<AppGainforestOrganizationRecordingsAudio.Record>[];

export type AudioData = AllAudioData[number];

const viewOptions = ["grid", "list", "add", "edit"] as const;

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

  const [formatFilter, setFormatFilter] = useQueryState(
    "format",
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

  // Filter logic
  const filteredAudio = allAudio.filter((audio) => {
    const matchesSearch =
      !searchQuery ||
      audio.value.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audio.value.description?.text
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesFormat =
      !formatFilter || audio.value.metadata.format === formatFilter;

    return matchesSearch && matchesFormat;
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
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

          {/* Format Filter */}
          <Select
            value={formatFilter || "all"}
            onValueChange={(v) => setFormatFilter(v === "all" ? null : v)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All formats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All formats</SelectItem>
              <SelectItem value="mp3">MP3</SelectItem>
              <SelectItem value="wav">WAV</SelectItem>
              <SelectItem value="flac">FLAC</SelectItem>
              <SelectItem value="ogg">OGG</SelectItem>
              <SelectItem value="m4a">M4A</SelectItem>
              <SelectItem value="aac">AAC</SelectItem>
            </SelectContent>
          </Select>

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
                  No recordings match your search criteria.
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

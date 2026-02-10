"use client";

import { Button } from "@/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import useHydratedData from "@/hooks/use-hydration";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { useModal } from "@/components/ui/modal/context";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { useAtprotoStore } from "@/components/stores/atproto";
import {
  SerializedSuperjson,
  deserialize,
} from "gainforest-sdk/utilities/transform";
import { AppGainforestOrganizationRecordingsAudio } from "gainforest-sdk/lex-api";
import { GetRecordResponse } from "gainforest-sdk/types";
import {
  AudioEditorModal,
  AudioEditorModalId,
} from "@/components/global/modals/upload/audio/editor";
import AudioCard from "./AudioCard";

export type AllAudioData =
  GetRecordResponse<AppGainforestOrganizationRecordingsAudio.Record>[];

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

  const { pushModal, show } = useModal();

  const handleAddAudio = () => {
    pushModal(
      {
        id: AudioEditorModalId,
        content: <AudioEditorModal initialData={null} />,
      },
      true
    );
    show();
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl">Audio Recordings</h2>
      </div>

      <section
        className={cn("w-full", isReactiveDataUpdating && "animate-pulse")}
      >
        {allAudio.length === 0 ? (
          <div className="w-full bg-muted h-40 rounded-lg mt-2 flex flex-col items-center justify-center text-center text-pretty text-sm">
            <span className="font-serif font-bold text-xl text-muted-foreground">
              No audio recordings uploaded yet. {shouldEdit && "Add one below."}
            </span>

            {shouldEdit && (
              <Button
                variant={"outline"}
                size={"sm"}
                className="mt-2"
                onClick={() => handleAddAudio()}
              >
                <CirclePlusIcon className="opacity-40" />
                Add audio recording
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 mt-4">
            {allAudio.map((audio) => {
              return <AudioCard key={audio.uri} audioData={audio} did={did} />;
            })}

            {shouldEdit && (
              <Button
                variant={"outline"}
                className="h-auto rounded-xl flex-col text-lg"
                onClick={() => handleAddAudio()}
              >
                <CirclePlusIcon className="size-8 opacity-40" />
                Add audio recording
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default AudioClient;

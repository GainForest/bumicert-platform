"use client";
import React, { useRef, useState } from "react";
import {
  Loader2,
  MoreVertical,
  Pause,
  Pencil,
  Play,
  Trash2,
  Clock,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AllAudioData } from "./AudioClient";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/components/ui/modal/context";
import {
  AudioEditorModal,
  AudioEditorModalId,
} from "@/components/global/modals/upload/audio/editor";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { useAtprotoStore } from "@/components/stores/atproto";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { getBlobUrl } from "gainforest-sdk/utilities/atproto";

export type AudioData = AllAudioData[number];
type AudioCardProps = {
  audioData: AudioData;
  did: string;
};

const AudioCard = ({ audioData, did }: AudioCardProps) => {
  const audio = audioData.value;
  const audioUrl = getBlobUrl(did, audio.audioBlob.file, allowedPDSDomains[0]);

  const auth = useAtprotoStore((state) => state.auth);
  const shouldEdit = auth.status === "AUTHENTICATED" && auth.user.did === did;
  const { pushModal, show } = useModal();
  const utils = trpcApi.useUtils();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { mutate: deleteAudio, isPending: isDeletingAudio } =
    trpcApi.gainforest.organization.recordings.audio.delete.useMutation({
      onSuccess: () => {
        utils.gainforest.organization.recordings.audio.getAll.invalidate({
          did,
          pdsDomain: allowedPDSDomains[0],
        });
      },
    });

  const handleEdit = () => {
    pushModal(
      {
        id: AudioEditorModalId,
        content: <AudioEditorModal initialData={audioData} />,
      },
      true
    );
    show();
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const formatDuration = (durationInSeconds: string) => {
    const seconds = parseFloat(durationInSeconds);
    if (isNaN(seconds)) return durationInSeconds;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const disableActions = isDeletingAudio;

  return (
    <div className="border border-border rounded-xl overflow-hidden shadow-lg">
      <div className="bg-background rounded-xl shadow-sm">
        <div className="flex items-center justify-between p-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5 ml-0.5" />
            )}
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Music className="size-3" />
            <span className="uppercase">{audio.metadata.format}</span>
          </div>
        </div>

        <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} />

        <hr className="opacity-50" />
        <div className="px-3 py-2">
          <h3 className="font-medium text-lg">
            {audio.name || "Untitled Recording"}
          </h3>
          {audio.description?.text && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {audio.description.text}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="size-4" />
              <span>{formatDuration(audio.metadata.duration)}</span>
            </span>

            <span className="text-sm text-muted-foreground">
              {audio.metadata.sampleRate / 1000}kHz
            </span>
          </div>
          <hr className="mt-3 opacity-50" />
          <div className="w-full flex items-center justify-between text-sm text-muted-foreground mt-1">
            <span>
              {new Date(audio.metadata.recordedAt).toLocaleDateString()}
            </span>

            <div className="flex items-center">
              {shouldEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} size={"sm"}>
                      {disableActions ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <MoreVertical />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleEdit()}
                      disabled={disableActions}
                    >
                      <Pencil />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={disableActions}
                      variant="destructive"
                      onClick={() =>
                        deleteAudio({
                          did,
                          audioRecordingAtUri: audioData.uri,
                          pdsDomain: allowedPDSDomains[0],
                        })
                      }
                    >
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCard;

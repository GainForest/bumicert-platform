"use client";
import React, { useState } from "react";
import {
  Loader2,
  MoreVertical,
  Pencil,
  Trash2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { mutate: deleteAudio, isPending: isDeletingAudio } =
    trpcApi.gainforest.organization.recordings.audio.delete.useMutation({
      onSuccess: () => {
        utils.gainforest.organization.recordings.audio.getAll.invalidate({
          did,
          pdsDomain: allowedPDSDomains[0],
        });
        setIsConfirmingDelete(false);
      },
      onError: () => {
        setIsConfirmingDelete(false);
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

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteAudio({
      did,
      audioRecordingAtUri: audioData.uri,
      pdsDomain: allowedPDSDomains[0],
    });
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const disableActions = isDeletingAudio;

  return (
    <div className="border border-border rounded-xl overflow-hidden shadow-lg">
      <div className="bg-background rounded-xl shadow-sm">
        <div className="p-3">
          <audio controls className="w-full h-10" preload="metadata">
            <source src={audioUrl} type={`audio/${audio.metadata.format}`} />
            Your browser does not support the audio element.
          </audio>
        </div>

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
          {audio.metadata.coordinates && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
              <MapPin className="size-4" />
              <span>{audio.metadata.coordinates}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground uppercase">
              {audio.metadata.format} · {audio.metadata.sampleRate / 1000}kHz
            </span>
          </div>
          <hr className="mt-3 opacity-50" />
          <div className="w-full flex items-center justify-between text-sm text-muted-foreground mt-1">
            <span>
              {new Date(audio.metadata.recordedAt).toLocaleDateString()}
            </span>

            <div className="flex items-center">
              {shouldEdit && !isConfirmingDelete && (
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
                      onClick={handleDeleteClick}
                    >
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {isConfirmingDelete && (
            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium mb-2">
                Delete this audio recording?
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleConfirmDelete}
                  disabled={isDeletingAudio}
                >
                  {isDeletingAudio ? (
                    <Loader2 className="animate-spin mr-1 size-3" />
                  ) : null}
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelDelete}
                  disabled={isDeletingAudio}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioCard;

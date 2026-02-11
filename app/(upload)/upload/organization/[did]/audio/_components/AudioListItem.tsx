"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader2, MoreVertical, Pencil, Trash2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioData } from "./AudioClient";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { useAtprotoStore } from "@/components/stores/atproto";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { getBlobUrl } from "gainforest-sdk/utilities/atproto";
import CircularProgressBar from "@/components/circular-progressbar";

type AudioListItemProps = {
  audioData: AudioData;
  did: string;
  onEdit: (uri: string) => void;
};

// Circular audio player for mobile
const CircularAudioPlayer = ({
  audioUrl,
  format,
}: {
  audioUrl: string;
  format: string;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    const handlePause = () => {
      setIsPlaying(false);
    };
    const handlePlay = () => {
      setIsPlaying(true);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, []);

  return (
    <button
      onClick={togglePlay}
      className="relative shrink-0 focus:outline-none"
    >
      <CircularProgressBar
        value={progress}
        size={44}
        strokeWidth={4}
        text={
          isPlaying ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4 ml-0.5" />
          )
        }
      />
      <audio ref={audioRef} preload="metadata">
        <source src={audioUrl} type={`audio/${format}`} />
      </audio>
    </button>
  );
};

type ActionsMenuProps = {
  isDeletingAudio: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

const ActionsMenu = ({ isDeletingAudio, onEdit, onDelete }: ActionsMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="shrink-0 size-8">
        {isDeletingAudio ? (
          <Loader2 className="animate-spin size-4" />
        ) : (
          <MoreVertical className="size-4" />
        )}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={onEdit}>
        <Pencil className="size-4" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onClick={onDelete}>
        <Trash2 className="size-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const AudioListItem = ({ audioData, did, onEdit }: AudioListItemProps) => {
  const audio = audioData.value;
  const audioUrl = getBlobUrl(did, audio.audioBlob.file, allowedPDSDomains[0]);

  const auth = useAtprotoStore((state) => state.auth);
  const shouldEdit = auth.status === "AUTHENTICATED" && auth.user.did === did;
  const utils = trpcApi.useUtils();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { mutate: deleteAudio, isPending: isDeletingAudio } =
    trpcApi.gainforest.organization.recordings.audio.delete.useMutation({
      onSuccess: () => {
        utils.gainforest.organization.recordings.audio.getAll.invalidate({
          did,
          pdsDomain: allowedPDSDomains[0],
        });
        setShowDeleteDialog(false);
      },
      onError: () => {
        setShowDeleteDialog(false);
      },
    });

  const handleConfirmDelete = () => {
    deleteAudio({
      did,
      audioRecordingAtUri: audioData.uri,
      pdsDomain: allowedPDSDomains[0],
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Truncate name to max 20 characters
  const truncatedName = (audio.name || "Untitled").length > 20
    ? (audio.name || "Untitled").slice(0, 20) + "..."
    : (audio.name || "Untitled");

  return (
    <>
      {/* Desktop Layout (md+) */}
      <div className="hidden md:flex items-center gap-4 py-2">
        {/* Name - fixed width, truncated */}
        <span className="font-medium shrink-0 w-48 truncate" title={audio.name || "Untitled"}>
          {truncatedName}
        </span>

        {/* Time */}
        <span className="text-sm text-muted-foreground shrink-0">
          {formatTime(audio.metadata.recordedAt)}
        </span>

        {/* Coordinates */}
        <span className="text-sm text-muted-foreground shrink-0 w-32 truncate">
          {audio.metadata.coordinates || "\u2014"}
        </span>

        {/* Native Audio Player - takes remaining space */}
        <audio controls className="h-8 flex-1 min-w-[200px]" preload="metadata">
          <source src={audioUrl} type={`audio/${audio.metadata.format}`} />
        </audio>

        {/* Menu */}
        {shouldEdit && (
          <ActionsMenu
            isDeletingAudio={isDeletingAudio}
            onEdit={() => onEdit(audioData.uri)}
            onDelete={() => setShowDeleteDialog(true)}
          />
        )}
      </div>

      {/* Mobile Layout (< md) */}
      <div className="flex md:hidden items-center gap-3 py-3">
        {/* Circular Audio Player */}
        <CircularAudioPlayer audioUrl={audioUrl} format={audio.metadata.format} />

        {/* Info Column */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-medium truncate">
            {audio.name || "Untitled"}
          </span>
          <span className="text-sm text-muted-foreground truncate">
            {audio.metadata.coordinates || formatTime(audio.metadata.recordedAt)}
          </span>
        </div>

        {/* Menu */}
        {shouldEdit && (
          <ActionsMenu
            isDeletingAudio={isDeletingAudio}
            onEdit={() => onEdit(audioData.uri)}
            onDelete={() => setShowDeleteDialog(true)}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete audio recording?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{audio.name || "Untitled"}&quot;. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAudio}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeletingAudio}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingAudio && <Loader2 className="animate-spin mr-2 size-4" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AudioListItem;

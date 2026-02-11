"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { Loader2, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileInput from "@/components/ui/FileInput";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { toFileGenerator } from "gainforest-sdk/zod";
import { parseAtUri } from "gainforest-sdk/utilities/atproto";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { useAtprotoStore } from "@/components/stores/atproto";
import { AudioData } from "./AudioClient";

type AudioEditorProps = {
  did: string;
  mode: "add" | "edit";
  initialData?: AudioData | null;
  onClose: () => void;
  onSuccess: () => void;
};

const AudioEditor = ({
  did,
  mode,
  initialData,
  onClose,
  onSuccess,
}: AudioEditorProps) => {
  const auth = useAtprotoStore((state) => state.auth);
  const authenticatedDid =
    auth.status === "AUTHENTICATED" ? auth.user.did : null;

  const initialAudio = initialData?.value;
  const { rkey } = initialData?.uri
    ? parseAtUri(initialData.uri)
    : { rkey: undefined };

  const [name, setName] = useState(initialAudio?.name ?? "");
  const [description, setDescription] = useState(
    initialAudio?.description?.text ?? ""
  );
  const [coordinates, setCoordinates] = useState(
    initialAudio?.metadata?.coordinates ?? ""
  );
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recordedAt, setRecordedAt] = useState(
    initialAudio?.metadata?.recordedAt
      ? new Date(initialAudio.metadata.recordedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const utils = trpcApi.useUtils();

  const {
    mutate: handleAdd,
    isPending: isAdding,
    error: addError,
  } = trpcApi.gainforest.organization.recordings.audio.create.useMutation({
    onSuccess: () => {
      utils.gainforest.organization.recordings.audio.getAll.invalidate({
        did,
        pdsDomain: allowedPDSDomains[0],
      });
      setIsCompleted(true);
    },
  });

  const {
    mutate: handleUpdate,
    isPending: isUpdating,
    error: updateError,
  } = trpcApi.gainforest.organization.recordings.audio.update.useMutation({
    onSuccess: () => {
      utils.gainforest.organization.recordings.audio.getAll.invalidate({
        did,
        pdsDomain: allowedPDSDomains[0],
      });
      setIsCompleted(true);
    },
  });

  // Auto-navigate back after 3 seconds of success
  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, onSuccess, onClose]);

  const executeAddOrEdit = async () => {
    if (!authenticatedDid) {
      setError("You must be authenticated to perform this action.");
      return;
    }

    setError(null);

    try {
      if (mode === "add") {
        if (!audioFile) {
          setError("Audio file is required.");
          return;
        }

        const audioFileInput = await toFileGenerator(audioFile);

        handleAdd({
          did,
          recording: {
            name: name.trim() || undefined,
            description: description.trim()
              ? { text: description.trim() }
              : undefined,
            recordedAt: new Date(recordedAt).toISOString(),
            coordinates: coordinates.trim() || undefined,
          },
          uploads: {
            audioFile: audioFileInput,
          },
          pdsDomain: allowedPDSDomains[0],
        });
      } else {
        if (!rkey) {
          setError("Record key is required for editing.");
          return;
        }

        if (audioFile) {
          const audioFileInput = await toFileGenerator(audioFile);

          handleUpdate({
            did,
            rkey,
            recording: {
              name: name.trim() || undefined,
              description: description.trim()
                ? { text: description.trim() }
                : undefined,
              recordedAt: new Date(recordedAt).toISOString(),
              coordinates: coordinates.trim() || undefined,
            },
            uploads: {
              audioFile: audioFileInput,
            },
            pdsDomain: allowedPDSDomains[0],
          });
        } else {
          handleUpdate({
            did,
            rkey,
            recording: {
              name: name.trim() || undefined,
              description: description.trim()
                ? { text: description.trim() }
                : undefined,
              recordedAt: new Date(recordedAt).toISOString(),
              coordinates: coordinates.trim() || undefined,
            },
            pdsDomain: allowedPDSDomains[0],
          });
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    }
  };

  const isPending = isAdding || isUpdating;
  const hasAudioInput = audioFile !== null;
  const disableSubmission = mode === "add" && !hasAudioInput;
  const displayError = error || addError?.message || updateError?.message;

  // Success feedback UI
  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center mt-4">
        <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
          <CheckIcon className="size-6 text-white" />
        </div>
        <span className="text-lg font-medium mt-2">
          Audio {mode === "edit" ? "updated" : "uploaded"} successfully
        </span>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">
          {mode === "edit"
            ? `Edit Audio: ${initialData?.value.name || "Untitled"}`
            : "Add an Audio"}
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload Area */}
        <div className="flex flex-col">
          <label className="text-sm text-muted-foreground mb-2">
            {mode === "edit" ? "Replace audio file (optional)" : "Audio File"}
          </label>
          <FileInput
            placeholder="Drop or click to upload audio"
            value={audioFile ?? undefined}
            supportedFileTypes={[
              "audio/mpeg",
              "audio/wav",
              "audio/ogg",
              "audio/mp4",
              "audio/webm",
              "audio/flac",
              "audio/aac",
              "audio/x-m4a",
              "audio/aiff",
            ]}
            maxSizeInMB={100}
            onFileChange={(file) => setAudioFile(file)}
            className="flex-1 min-h-[200px]"
          />
          <span className="text-xs text-muted-foreground mt-2">
            WAV, MP3, M4A, AAC, FLAC, OGG, Opus, WebM, AIFF (max 100MB)
          </span>
        </div>

        {/* Right: Form Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">
              Name (optional)
            </label>
            <Input
              placeholder="Morning bird calls"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">
              Description (optional)
            </label>
            <Textarea
              placeholder="Recorded at the main observation site during sunrise"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">Recorded at</label>
            <Input
              type="datetime-local"
              value={recordedAt}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRecordedAt(e.target.value)
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">
              Coordinates (optional)
            </label>
            <Input
              placeholder="-3.4653, 142.0723"
              value={coordinates}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCoordinates(e.target.value)
              }
            />
            <span className="text-xs text-muted-foreground">
              Format: latitude, longitude (optionally altitude)
            </span>
          </div>
        </div>
      </div>

      {displayError && (
        <div className="text-sm text-destructive mt-4">
          {displayError.startsWith("[") ? "Bad Request" : displayError}
        </div>
      )}

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          onClick={executeAddOrEdit}
          disabled={disableSubmission || isPending}
        >
          {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
          {mode === "edit"
            ? isPending
              ? "Saving..."
              : "Save"
            : isPending
              ? "Uploading..."
              : "Upload"}
        </Button>
      </div>
    </div>
  );
};

export default AudioEditor;

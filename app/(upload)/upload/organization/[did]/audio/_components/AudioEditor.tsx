"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
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
import { parseAudioMetadata } from "@/lib/audio-metadata";
import { cleanFilename } from "@/lib/clean-filename";
import MultiAudioFileInput from "./MultiAudioFileInput";
import AudioFileList, { type AudioFileEntry } from "./AudioFileList";
import { AudioData } from "./AudioClient";

type AudioEditorProps = {
  did: string;
  mode: "add" | "edit";
  initialData?: AudioData | null;
  onClose: () => void;
  onSuccess: () => void;
};

const AUTO_CLOSE_MS = 3000;

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
  const [countdownStarted, setCountdownStarted] = useState(false);

  // Add mode state
  const [fileEntries, setFileEntries] = useState<AudioFileEntry[]>([]);
  const [addCoordinates, setAddCoordinates] = useState("");
  const [uploadState, setUploadState] = useState<
    | { status: "idle" }
    | { status: "uploading"; current: number; total: number }
    | { status: "cancelled"; uploaded: number; total: number }
    | { status: "completed" }
    | { status: "error"; message: string; uploaded: number; total: number }
  >({ status: "idle" });
  const cancelRef = useRef(false);
  const [cancelClicked, setCancelClicked] = useState(false);

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

  const { mutateAsync: createAudioAsync } =
    trpcApi.gainforest.organization.recordings.audio.create.useMutation();

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

  // Auto-navigate back after AUTO_CLOSE_MS of success (both add and edit modes)
  const showSuccess = isCompleted || uploadState.status === "completed";
  useEffect(() => {
    if (showSuccess) {
      // Trigger the countdown bar animation on next frame
      requestAnimationFrame(() => setCountdownStarted(true));
      const timer = setTimeout(() => {
        onSuccess();
        onClose();
      }, AUTO_CLOSE_MS);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, onSuccess, onClose]);

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
            name: name.trim(),
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
              name: name.trim(),
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
              name: name.trim(),
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
  const isNameValid = name.trim().length > 0;
  const disableSubmission = !isNameValid || (mode === "add" && !hasAudioInput);
  const displayError = error || addError?.message || updateError?.message;

  // Handle files change in add mode — extract metadata for each new file
  const handleFilesChange = async (newFiles: File[]) => {
    const existingFiles = fileEntries.map((e) => e.file);
    const addedFiles = newFiles.filter((f) => !existingFiles.includes(f));

    const newEntries: AudioFileEntry[] = await Promise.all(
      addedFiles.map(async (file) => {
        const metadata = await parseAudioMetadata(file);
        return {
          file,
          name: metadata.name ?? cleanFilename(file.name),
          recordedAt: metadata.date
            ? new Date(metadata.date).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          dateAutoDetected: metadata.date !== null,
          description: "",
        };
      })
    );

    setFileEntries((prev) => [...prev, ...newEntries]);
  };

  // Sequential batch upload
  const handleBatchUpload = async () => {
    if (!authenticatedDid) return;

    cancelRef.current = false;
    setCancelClicked(false);
    setUploadState({ status: "uploading", current: 1, total: fileEntries.length });

    let completedCount = 0;

    for (let i = 0; i < fileEntries.length; i++) {
      if (cancelRef.current) {
        break;
      }

      setUploadState({
        status: "uploading",
        current: i + 1,
        total: fileEntries.length,
      });

      const entry = fileEntries[i];

      try {
        const audioFileInput = await toFileGenerator(entry.file);
        await createAudioAsync({
          did,
          recording: {
            name: entry.name.trim(),
            description: entry.description.trim()
              ? { text: entry.description.trim() }
              : undefined,
            recordedAt: new Date(entry.recordedAt).toISOString(),
            coordinates: addCoordinates.trim() || undefined,
          },
          uploads: {
            audioFile: audioFileInput,
          },
          pdsDomain: allowedPDSDomains[0],
        });
        completedCount++;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setUploadState({
          status: "error",
          message,
          uploaded: completedCount,
          total: fileEntries.length,
        });
        return;
      }
    }

    if (cancelRef.current) {
      setUploadState({
        status: "cancelled",
        uploaded: completedCount,
        total: fileEntries.length,
      });
    } else {
      utils.gainforest.organization.recordings.audio.getAll.invalidate({
        did,
        pdsDomain: allowedPDSDomains[0],
      });
      setUploadState({ status: "completed" });
    }
  };

  // ── ADD MODE ──────────────────────────────────────────────────────────────

  if (mode === "add") {
    // Completed state — success UI with countdown bar
    if (uploadState.status === "completed") {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-center mt-4">
          <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
            <CheckIcon className="size-6 text-white" />
          </div>
          <span className="text-lg font-medium mt-2">
            Audio uploaded successfully
          </span>
          <div className="w-full max-w-xs h-1 bg-muted rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-primary rounded-full"
              style={{
                width: countdownStarted ? "0%" : "100%",
                transition: countdownStarted
                  ? `width ${AUTO_CLOSE_MS}ms linear`
                  : "none",
              }}
            />
          </div>
        </div>
      );
    }

    // Cancelled state
    if (uploadState.status === "cancelled") {
      return (
        <div className="mt-4 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-muted-foreground">
            {uploadState.uploaded} of {uploadState.total} recordings uploaded
            successfully. {uploadState.total - uploadState.uploaded} were not
            uploaded.
          </p>
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </div>
      );
    }

    // Error state
    if (uploadState.status === "error") {
      return (
        <div className="mt-4 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-destructive">{uploadState.message}</p>
          <p className="text-muted-foreground">
            {uploadState.uploaded} recording(s) were uploaded before the error.
          </p>
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </div>
      );
    }

    const isUploading = uploadState.status === "uploading";
    const uploadDisabled =
      fileEntries.length === 0 ||
      fileEntries.some((e) => e.name.trim() === "") ||
      isUploading;

    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">Add an Audio</h3>
        </div>

        <MultiAudioFileInput
          files={fileEntries.map((e) => e.file)}
          onFilesChange={handleFilesChange}
        />

        <AudioFileList entries={fileEntries} onEntriesChange={setFileEntries} />

        {fileEntries.length > 0 && (
          <>
            <hr className="opacity-50 my-4" />
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">
                Coordinates (optional)
              </label>
              <Input
                placeholder="-3.4653, 142.0723"
                value={addCoordinates}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAddCoordinates(e.target.value)
                }
              />
              <span className="text-xs text-muted-foreground">
                Format: latitude, longitude (optionally altitude)
              </span>
            </div>
          </>
        )}

        {isUploading && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Uploading {uploadState.current} of {uploadState.total}…
            </p>
            <div className="h-1 bg-muted rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${(uploadState.current / uploadState.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          {isUploading && (
            <Button
              variant="outline"
              disabled={cancelClicked}
              onClick={() => {
                cancelRef.current = true;
                setCancelClicked(true);
              }}
            >
              {cancelClicked ? "Cancelling…" : "Cancel upload"}
            </Button>
          )}
          <Button onClick={handleBatchUpload} disabled={uploadDisabled}>
            {isUploading ? <Loader2 className="animate-spin mr-2" /> : null}
            Upload {fileEntries.length} recording
            {fileEntries.length !== 1 ? "s" : ""}
          </Button>
        </div>
      </div>
    );
  }

  // ── EDIT MODE (COMPLETELY UNCHANGED) ─────────────────────────────────────

  // Success feedback UI
  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center mt-4">
        <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
          <CheckIcon className="size-6 text-white" />
        </div>
        <span className="text-lg font-medium mt-2">
          Audio updated successfully
        </span>
        <div className="w-full max-w-xs h-1 bg-muted rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-primary rounded-full"
            style={{
              width: countdownStarted ? "0%" : "100%",
              transition: countdownStarted
                ? `width ${AUTO_CLOSE_MS}ms linear`
                : "none",
            }}
          />
        </div>
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
              Name <span className="text-destructive">*</span>
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

      {(!isNameValid || displayError) && (
        <div className="text-sm text-destructive mt-4">
          {!isNameValid
            ? "Name is required."
            : displayError?.startsWith("[")
              ? "Bad Request"
              : displayError}
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

"use client";
import { FolderUpIcon } from "lucide-react";
import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import QuickTooltip from "@/components/ui/quick-tooltip";

export const MAX_AUDIO_BATCH_SIZE = 10;

export const SUPPORTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp4",
  "audio/webm",
  "audio/flac",
  "audio/aac",
  "audio/x-m4a",
  "audio/aiff",
] as const;

export const MAX_AUDIO_SIZE_MB = 100;

type MultiAudioFileInputProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  className?: string;
};

const isValidAudioFile = (file: File): boolean => {
  const validType = (SUPPORTED_AUDIO_TYPES as readonly string[]).includes(
    file.type
  );
  const validSize = file.size <= MAX_AUDIO_SIZE_MB * 1024 * 1024;
  return validType && validSize;
};

const MultiAudioFileInput = ({
  files,
  onFilesChange,
  className,
}: MultiAudioFileInputProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = useCallback(
    (newFiles: File[]) => {
      setError("");
      const slotsAvailable = MAX_AUDIO_BATCH_SIZE - files.length;
      if (slotsAvailable <= 0) return;

      const validFiles: File[] = [];
      let rejectedCount = 0;

      for (const file of newFiles) {
        if (isValidAudioFile(file)) {
          validFiles.push(file);
        } else {
          rejectedCount++;
        }
      }

      const filesToAdd = validFiles.slice(0, slotsAvailable);
      const skippedDueToCap = validFiles.length - filesToAdd.length;
      const totalRejected = rejectedCount + skippedDueToCap;

      if (totalRejected > 0) {
        setError(
          `${totalRejected} file${totalRejected !== 1 ? "s were" : " was"} skipped (unsupported format or too large).`
        );
      }

      if (filesToAdd.length > 0) {
        onFilesChange([...files, ...filesToAdd]);
      }
    },
    [files, onFilesChange]
  );

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFilesAdded(droppedFiles);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length > 0) {
      handleFilesAdded(selectedFiles);
    }
    // Reset input so the same files can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const atCapacity = files.length >= MAX_AUDIO_BATCH_SIZE;
  const hasFiles = files.length > 0;
  const isCompact = hasFiles && !atCapacity;

  return (
    <div className={cn("w-full", className)}>
      {!atCapacity && (
        <div
          className={cn(
            "w-full flex flex-col items-center justify-center border border-dashed border-border rounded-md transition-colors",
            isCompact ? "min-h-20" : "min-h-40",
            isDragOver ? "border-primary bg-primary/5" : "bg-foreground/1"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={SUPPORTED_AUDIO_TYPES.join(",")}
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2 p-4">
            <div className="flex items-center gap-1">
              <QuickTooltip content="Upload from device" asChild>
                <button
                  type="button"
                  className="h-7 w-7 flex items-center justify-center bg-foreground/10 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={handleUploadClick}
                >
                  <FolderUpIcon className="size-4" />
                </button>
              </QuickTooltip>
            </div>

            <span className="text-sm text-center px-2 text-muted-foreground">
              {isCompact
                ? `Drop more files (${files.length}/${MAX_AUDIO_BATCH_SIZE})`
                : `Drop or select up to ${MAX_AUDIO_BATCH_SIZE} audio files`}
            </span>
          </div>
        </div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default MultiAudioFileInput;

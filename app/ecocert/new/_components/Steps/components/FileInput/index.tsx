"use client";
import { ClipboardIcon, FolderUpIcon, FileIcon, Trash2 } from "lucide-react";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useDragAndDrop from "./useDragAndDrop";
import QuickTooltip from "@/components/ui/quick-tooltip";

// Helper function to check if file is an image
const isImageFile = (file: File): boolean => {
  if (file.type === undefined) return false;
  return file.type.startsWith("image/");
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper function to validate the file
const validateFile = (
  file: File,
  maxSizeInMB: number,
  supportedFileTypes: string[]
): true => {
  console.log(file);

  if (file.size > maxSizeInMB * 1024 * 1024) {
    throw new Error(`File size exceeds ${maxSizeInMB}MB.`);
  }

  const isValidType = supportedFileTypes.some((type) => {
    if (type.endsWith("/*")) {
      const category = type.split("/")[0];
      return file.type.startsWith(category + "/");
    }
    if (type.startsWith(".")) {
      // Check file extension
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type === type;
  });

  if (!isValidType) {
    throw new Error(`Unsupported file type.`);
  }

  return true;
};

interface FileInputProps {
  placeholder?: string;
  supportedFileTypes?: string[];
  onFileChange?: (file: File | null) => void;
  value?: File | null;
  maxSizeInMB?: number;
}

const FileInput = ({
  placeholder = "Upload or drag and drop your file",
  supportedFileTypes = ["image/*"],
  onFileChange,
  value,
  maxSizeInMB = 10,
}: FileInputProps) => {
  const [error, setError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Master handler for all file selection events
  const handleFileSelect = useCallback(
    (file: File) => {
      // Check for validation errors
      setError("");
      let validationError: null | Error = null;
      try {
        validateFile(file, maxSizeInMB, supportedFileTypes);
      } catch (error) {
        validationError = error as Error;
      }
      if (validationError) {
        handleRemoveFile();
        setError(validationError.message);
        return;
      }

      // Update the states
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      onFileChange?.(file);
      if (isImageFile(file)) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl("");
      }
    },
    [onFileChange, maxSizeInMB, supportedFileTypes, previewUrl]
  );

  // Drag and drop handlers
  const { isDragOver, handleDragOver, handleDragLeave, handleDrop } =
    useDragAndDrop(handleFileSelect);

  // Paste from clipboard handler
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();

      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], "clipboard-image.png", { type });
            handleFileSelect(file);
            return;
          }
        }
      }

      setError("No image found in clipboard");
    } catch {
      setError("Failed to read from clipboard");
    }
  };

  // Upload from device handler
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    // Clean up preview URL to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    onFileChange?.(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Effect to handle preview URL creation when value changes
  useEffect(() => {
    if (value && isImageFile(value)) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl("");
    }
  }, [value]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div
      className="w-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      <div
        className={cn(
          "w-full h-40 border border-dashed border-border rounded-md transition-colors relative overflow-hidden",
          isDragOver ? "border-primary bg-primary/5" : "",
          error ? "border-destructive" : "",
          value ? "bg-background" : "bg-foreground/[0.01]"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={supportedFileTypes.join(",")}
          onChange={(event) => {
            const file = event.target.files?.item(0);
            if (file) {
              handleFileSelect(file);
            }
          }}
          className="hidden"
        />

        {/* Remove button - always visible when file is selected */}
        {value && (
          <button
            type="button"
            className="absolute top-2 right-2 px-1.5 z-10 h-5 flex items-center justify-center gap-1 bg-background/50 hover:bg-red-100 dark:hover:bg-red-900 backdrop-blur-lg transition-colors rounded-full shadow-lg cursor-pointer"
            onClick={handleRemoveFile}
          >
            <Trash2 className="size-3 text-foreground" />
            <span className="text-xs font-medium text-red-700 dark:text-red-300">
              Remove
            </span>
          </button>
        )}

        {/* Image Preview */}
        {value && isImageFile(value) && previewUrl && (
          <div className="w-full h-full relative">
            <img
              src={previewUrl}
              alt={value.name}
              className="w-full h-full object-cover"
            />
            {/* Overlay for drag and drop when image is shown */}
            {isDragOver && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="text-primary font-medium">
                  Drop to replace image
                </div>
              </div>
            )}
          </div>
        )}

        {/* File Preview (non-image) */}
        {value && !isImageFile(value) && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
            <FileIcon className="size-12 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium text-sm truncate max-w-full">
                {value.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(value.size)}
              </p>
            </div>
            {/* Overlay for drag and drop when file is shown */}
            {isDragOver && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-md">
                <div className="text-primary font-medium">
                  Drop to replace file
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Interface (when no file selected) */}
        {!value && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <QuickTooltip content="Paste from clipboard" asChild>
                <button
                  type="button"
                  className="h-7 w-7 flex items-center justify-center bg-foreground/10 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={handlePasteFromClipboard}
                >
                  <ClipboardIcon className="size-4" />
                </button>
              </QuickTooltip>
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

            <span className="text-sm text-center px-2 text-muted-foreground origin-center">
              {placeholder}
            </span>
          </div>
        )}
      </div>

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

export default FileInput;

import { useModal } from "@/components/ui/modal/context";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { useState, type ChangeEvent } from "react";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { toFileGenerator } from "gainforest-sdk/zod";
import { Button } from "@/components/ui/button";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { AppGainforestOrganizationRecordingsAudio } from "gainforest-sdk/lex-api";
import { parseAtUri } from "gainforest-sdk/utilities/atproto";
import FileInput from "@/components/ui/FileInput";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GetRecordResponse } from "gainforest-sdk/types";
import { useAtprotoStore } from "@/components/stores/atproto";

export const AudioEditorModalId = "audio/editor";

type AudioData = GetRecordResponse<AppGainforestOrganizationRecordingsAudio.Record>;

type AudioEditorModalProps = {
  initialData: AudioData | null;
};

export const AudioEditorModal = ({ initialData }: AudioEditorModalProps) => {
  const initialAudio = initialData?.value;
  const initialName = initialAudio?.name;
  const initialDescription = initialAudio?.description?.text;

  const auth = useAtprotoStore((state) => state.auth);
  const did = auth.user?.did;

  const { rkey } = initialData?.uri
    ? parseAtUri(initialData.uri)
    : { rkey: undefined };
  const mode = rkey ? "edit" : "add";

  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState(initialDescription ?? "");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recordedAt, setRecordedAt] = useState(
    initialAudio?.metadata?.recordedAt
      ? new Date(initialAudio.metadata.recordedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );

  const hasAudioInput = audioFile !== null;
  const disableSubmission = mode === "add" && !hasAudioInput;

  const [isCompleted, setIsCompleted] = useState(false);

  const { stack, popModal, hide } = useModal();
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

  const executeAddOrEdit = async () => {
    if (mode === "add") {
      const audioFileInput =
        audioFile === null ? null : await toFileGenerator(audioFile);

      if (!audioFileInput) {
        throw new Error("Audio file is required");
      }

      await handleAdd({
        did: did!,
        recording: {
          name: name.trim() || undefined,
          description: description.trim()
            ? { text: description.trim() }
            : undefined,
          recordedAt: new Date(recordedAt).toISOString(),
        },
        uploads: {
          audioFile: audioFileInput,
        },
        pdsDomain: allowedPDSDomains[0],
      });
    } else {
      if (!rkey) {
        throw new Error("Record key is required for editing");
      }

      if (hasAudioInput) {
        const audioFileInput = await toFileGenerator(audioFile!);

        await handleUpdate({
          did: did!,
          rkey,
          recording: {
            name: name.trim() || undefined,
            description: description.trim()
              ? { text: description.trim() }
              : undefined,
            recordedAt: new Date(recordedAt).toISOString(),
          },
          uploads: {
            audioFile: audioFileInput,
          },
          pdsDomain: allowedPDSDomains[0],
        });
      } else {
        await handleUpdate({
          did: did!,
          rkey,
          recording: {
            name: name.trim() || undefined,
            description: description.trim()
              ? { text: description.trim() }
              : undefined,
            recordedAt: new Date(recordedAt).toISOString(),
          },
          pdsDomain: allowedPDSDomains[0],
        });
      }
    }
  };

  const isPending = isAdding || isUpdating;
  const error = addError || updateError;

  return (
    <ModalContent>
      <ModalHeader
        backAction={stack.length === 1 ? undefined : () => popModal()}
      >
        <ModalTitle>
          {mode === "edit" ? "Edit" : "Add"} Audio Recording
        </ModalTitle>
        <ModalDescription>
          {mode === "edit"
            ? "Edit the audio recording information."
            : "Add a new audio recording to the organization."}
        </ModalDescription>
      </ModalHeader>
      <AnimatePresence mode="wait">
        {!isCompleted && (
          <motion.section
            key={"form"}
            className="w-full"
            exit={{
              opacity: 0,
              filter: "blur(10px)",
              scale: 0.5,
            }}
          >
            <div className="flex flex-col w-full mt-4 gap-4">
              <div className="flex flex-col gap-0.5">
                <label
                  htmlFor="name-for-audio"
                  className="text-sm text-muted-foreground"
                >
                  Name (optional)
                </label>
                <Input
                  placeholder="Morning bird calls"
                  id="name-for-audio"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <label
                  htmlFor="description-for-audio"
                  className="text-sm text-muted-foreground"
                >
                  Description (optional)
                </label>
                <Textarea
                  placeholder="Recorded at the main observation site during sunrise"
                  id="description-for-audio"
                  value={description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <label
                  htmlFor="recorded-at"
                  className="text-sm text-muted-foreground"
                >
                  Recorded at
                </label>
                <Input
                  type="datetime-local"
                  id="recorded-at"
                  value={recordedAt}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setRecordedAt(e.target.value)
                  }
                />
              </div>

              <hr className="opacity-50" />

              <div className="flex flex-col gap-0.5">
                <label className="text-sm text-muted-foreground">
                  {mode === "edit" ? "Replace audio file (optional)" : "Audio file"}
                </label>
                <FileInput
                  placeholder="Upload an audio file"
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
                />
                <span className="text-xs text-muted-foreground mt-1">
                  Supported formats: WAV, MP3, M4A, AAC, FLAC, OGG, Opus, WebM, AIFF (max 100MB)
                </span>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive mt-2">
                {error.message.startsWith("[") ? "Bad Request" : error.message}
              </div>
            )}
          </motion.section>
        )}
        {isCompleted && (
          <motion.section
            key={"completed"}
            className="w-full h-40 border border-border rounded-lg p-4 flex flex-col items-center justify-center text-center"
            initial={{
              opacity: 0,
              filter: "blur(10px)",
              scale: 0.5,
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
            }}
          >
            <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
              <CheckIcon className="size-6 text-white" />
            </div>
            <span className="text-lg text-center text-pretty font-medium mt-2">
              Audio recording {mode === "edit" ? "updated" : "added"}{" "}
              successfully
            </span>
          </motion.section>
        )}
      </AnimatePresence>

      <ModalFooter>
        {!isCompleted && (
          <Button
            onClick={() => executeAddOrEdit()}
            disabled={disableSubmission || isPending}
          >
            {isPending && <Loader2 className="animate-spin mr-2" />}
            {mode === "edit"
              ? isPending
                ? "Saving..."
                : "Save"
              : isPending
                ? "Adding..."
                : "Add"}
          </Button>
        )}
        {isCompleted && (
          <Button
            onClick={() => {
              if (stack.length === 1) {
                hide().then(() => {
                  popModal();
                });
              } else {
                popModal();
              }
            }}
          >
            Close
          </Button>
        )}
      </ModalFooter>
    </ModalContent>
  );
};

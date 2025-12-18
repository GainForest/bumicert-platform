import { useModal } from "@/components/ui/modal/context";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { useState, type ChangeEvent } from "react";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { toBlobRefGenerator, toFileGenerator } from "climateai-sdk/zod";
import { Button } from "@/components/ui/button";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { SiteData } from "./SiteCard";
import { parseAtUri } from "climateai-sdk/utilities/atproto";
import FileInput from "@/app/(marketplace)/ecocert/new/_components/Steps/components/FileInput";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckIcon, Loader2, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getShapefilePreviewUrl } from "./utils";
import DrawPolygonModal, {
  DrawPolygonModalId,
} from "@/components/global/modals/draw-polygon";

export const SiteEditorModalId = "site/editor";

type SiteEditorModalProps = {
  initialData: SiteData | null;
  did: string;
};

export const SiteEditorModal = ({ initialData, did }: SiteEditorModalProps) => {
  const initialSite = initialData?.value;
  const initialName = initialSite?.name;
  const initialShapefile = initialSite?.shapefile;

  const { rkey } = initialData?.uri
    ? parseAtUri(initialData.uri)
    : { rkey: undefined };
  const mode = rkey ? "edit" : "add";

  const previewUrl = initialShapefile
    ? getShapefilePreviewUrl(initialShapefile.blob, did)
    : null;

  const [name, setName] = useState(initialName ?? "");
  const [shapefile, setShapefile] = useState<File | null>(null);
  const [showEditor, setShowEditor] = useState(mode === "add" || !previewUrl);

  // For edit mode, shapefile is optional if we're keeping the existing one
  const hasShapefileInput = shapefile !== null;
  const disableSubmission =
    !name.trim() || (mode === "add" && !hasShapefileInput);

  const [isCompleted, setIsCompleted] = useState(false);

  const { stack, popModal, hide, pushModal, show } = useModal();
  const utils = trpcApi.useUtils();

  const {
    mutate: handleAdd,
    isPending: isAdding,
    error: addError,
  } = trpcApi.gainforest.organization.site.create.useMutation({
    onSuccess: () => {
      utils.gainforest.organization.site.getAll.invalidate({
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
  } = trpcApi.gainforest.organization.site.update.useMutation({
    onSuccess: () => {
      utils.gainforest.organization.site.getAll.invalidate({
        did,
        pdsDomain: allowedPDSDomains[0],
      });
      setIsCompleted(true);
    },
  });

  const executeAddOrEdit = async () => {
    if (mode === "add") {
      const shapefileInput =
        shapefile === null ? null : await toFileGenerator(shapefile);

      if (!shapefileInput) {
        throw new Error("Shapefile is required");
      }

      await handleAdd({
        site: {
          name: name.trim(),
        },
        uploads: {
          shapefile: shapefileInput,
        },
        pdsDomain: allowedPDSDomains[0],
      });
    } else {
      // Edit mode
      if (!rkey) {
        throw new Error("Record key is required for editing");
      }

      // If no new shapefile is provided, keep the existing one
      if (!hasShapefileInput && initialShapefile) {
        const sitePayload = {
          name: name.trim(),
          lat: initialSite!.lat,
          lon: initialSite!.lon,
          area: initialSite!.area,
          ...(initialShapefile.$type === "app.gainforest.common.defs#smallBlob"
            ? {
                shapefile: {
                  $type: "app.gainforest.common.defs#smallBlob" as const,
                  blob: toBlobRefGenerator(initialShapefile.blob),
                },
              }
            : {}),
        };

        await handleUpdate({
          rkey,
          site: sitePayload,
          pdsDomain: allowedPDSDomains[0],
        });
      } else {
        const shapefileInput =
          shapefile === null ? null : await toFileGenerator(shapefile);

        if (!shapefileInput) {
          throw new Error("Shapefile is required");
        }

        await handleUpdate({
          rkey,
          site: {
            name: name.trim(),
            lat: initialSite!.lat,
            lon: initialSite!.lon,
            area: initialSite!.area,
          },
          uploads: {
            shapefile: shapefileInput,
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
        <ModalTitle>{mode === "edit" ? "Edit" : "Add"} Site</ModalTitle>
        <ModalDescription>
          {mode === "edit"
            ? "Edit the site information."
            : "Add a new site to the organization."}
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
            <div className="flex flex-col w-full mt-4">
              <div className="flex flex-col gap-0.5">
                <label
                  htmlFor="name-for-site"
                  className="text-sm text-muted-foreground"
                >
                  Enter a name for the site
                </label>
                <Input
                  placeholder="Grassroots Farm"
                  id="name-for-site"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                />
              </div>
            </div>
            <hr className="my-4 opacity-50" />
            {!showEditor && previewUrl && (
              <div className="mt-4 relative">
                <iframe
                  src={previewUrl}
                  className="w-full h-64 rounded-lg border border-border"
                  title="Site shapefile preview"
                />
                <Button
                  size="sm"
                  className="absolute top-3 right-3"
                  variant={"outline"}
                  onClick={() => setShowEditor(true)}
                >
                  Edit
                </Button>
              </div>
            )}
            {showEditor && (
              <>
                <div className="flex items-center gap-1 w-full">
                  {mode === "edit" && (
                    <Button
                      variant={"ghost"}
                      onClick={() => setShowEditor(false)}
                    >
                      <ArrowLeft />
                    </Button>
                  )}
                </div>
                <div className="mt-2 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <FileInput
                        placeholder="Upload a GeoJSON file"
                        value={shapefile ?? undefined}
                        supportedFileTypes={["application/geo+json"]}
                        maxSizeInMB={10}
                        onFileChange={(file) => setShapefile(file)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-px bg-border flex-1" />
                    <span className="text-xs text-muted-foreground">or</span>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      pushModal({
                        id: DrawPolygonModalId,
                        content: (
                          <DrawPolygonModal
                            onSubmit={(polygonJSONString: string) => {
                              // Convert JSON string to File
                              const blob = new Blob([polygonJSONString], {
                                type: "application/geo+json",
                              });
                              const file = new File(
                                [blob],
                                "drawn-polygon.geojson",
                                {
                                  type: "application/geo+json",
                                }
                              );
                              setShapefile(file);
                            }}
                          />
                        ),
                      });
                      show();
                    }}
                  >
                    <Pencil className="size-4 mr-2" />
                    Draw a site
                  </Button>
                </div>
              </>
            )}
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
            className="w-full h-40 border border-border rounded-lg p-4 flex flex-col items-center justify-center"
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
            <span className="text-lg font-medium mt-2">
              Site {mode === "edit" ? "updated" : "added"} successfully
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

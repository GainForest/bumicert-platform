import { useModal } from "@/components/ui/modal/context";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { useState } from "react";
import { trpcClient } from "@/lib/trpc/client";
import {
  toBlobRefGenerator,
  toFileGenerator,
} from "@/server/routers/atproto/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { KnownShapefileT, SiteData } from "./SiteCard";
import getRkeyFromAtUri from "@/lib/atproto/getRkeyFromAtUri";
import FileInput from "@/app/ecocert/new/_components/Steps/components/FileInput";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getShapefilePreviewUrl } from "./utils";

export const SiteEditorModalId = "site/editor";

type SiteEditorModalProps = {
  initialData: SiteData | null;
  did: string;
};

export const SiteEditorModal = ({ initialData, did }: SiteEditorModalProps) => {
  const initialSite = initialData?.value;
  const initialName = initialSite?.name;
  const initialShapefile = initialSite?.shapefile as
    | KnownShapefileT
    | undefined;

  const rkey = initialData?.uri ? getRkeyFromAtUri(initialData.uri) : undefined;
  const mode = rkey ? "edit" : "add";

  // Initialize URL tab if editing and shapefile is a URI
  const initialShapefileUrl =
    initialShapefile?.$type === "app.gainforest.common.defs#uri" ?
      initialShapefile.uri
    : "";

  const previewUrl =
    initialShapefile ?
      initialShapefile.$type === "app.gainforest.common.defs#uri" ?
        getShapefilePreviewUrl(initialShapefile.uri, did)
      : getShapefilePreviewUrl(initialShapefile.blob, did)
    : null;

  const [name, setName] = useState(initialName ?? "");
  const [shapefile, setShapefile] = useState<File | null>(null);
  const [shapefileEditUrl, setShapefileEditUrl] =
    useState<string>(initialShapefileUrl);
  const [tab, setTab] = useState<"url" | "file">(
    initialShapefileUrl ? "url" : "file"
  );
  const [showEditor, setShowEditor] = useState(mode === "add" || !previewUrl);

  // For edit mode, shapefile is optional if we're keeping the existing one
  const hasShapefileInput =
    tab === "file" ? shapefile !== null : shapefileEditUrl.trim() !== "";
  const disableSubmission =
    !name.trim() || (mode === "add" && !hasShapefileInput);

  const [isCompleted, setIsCompleted] = useState(false);

  const { stack, popModal, hide } = useModal();
  const queryClient = useQueryClient();

  const {
    mutate: handleAddOrEdit,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (mode === "add") {
        if (!hasShapefileInput) {
          throw new Error("Shapefile is required");
        }

        const shapefileInput =
          tab === "file" && shapefile ? await toFileGenerator(shapefile)
          : tab === "url" && shapefileEditUrl ? shapefileEditUrl
          : null;

        if (!shapefileInput) {
          throw new Error("Shapefile is required");
        }

        await trpcClient.gainforest.site.create.mutate({
          site: {
            name: name.trim(),
          },
          uploads: {
            shapefile: shapefileInput,
          },
        });
      } else {
        // Edit mode
        if (!rkey) {
          throw new Error("Record key is required for editing");
        }

        // If no new shapefile is provided, keep the existing one
        if (!hasShapefileInput && initialShapefile) {
          await trpcClient.gainforest.site.update.mutate({
            rkey,
            site: {
              name: name.trim(),
              shapefile:
                initialShapefile.$type === "app.gainforest.common.defs#uri" ?
                  {
                    $type: "app.gainforest.common.defs#uri",
                    uri: initialShapefile.uri,
                  }
                : {
                    $type: "app.gainforest.common.defs#smallBlob",
                    blob: toBlobRefGenerator(initialShapefile.blob),
                  },
              lat: initialSite!.lat,
              lon: initialSite!.lon,
              area: initialSite!.area,
            },
          });
        } else {
          const shapefileInput =
            tab === "file" && shapefile ? await toFileGenerator(shapefile)
            : tab === "url" && shapefileEditUrl ? shapefileEditUrl
            : null;

          if (!shapefileInput) {
            throw new Error("Shapefile is required");
          }

          await trpcClient.gainforest.site.update.mutate({
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
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllSites", did],
      });
      setIsCompleted(true);
    },
  });

  return (
    <ModalContent>
      <ModalHeader
        backAction={stack.length === 1 ? undefined : () => popModal()}
      >
        <ModalTitle>{mode === "edit" ? "Edit" : "Add"} Site</ModalTitle>
        <ModalDescription>
          {mode === "edit" ?
            "Edit the site information."
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
                  onChange={(e) => setName(e.target.value)}
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
                  <Button
                    className="flex-1 border-primary"
                    variant={tab === "file" ? "outline" : "ghost"}
                    onClick={() => setTab("file")}
                  >
                    File
                  </Button>
                  <Button
                    className="flex-1 border-primary"
                    variant={tab === "url" ? "outline" : "ghost"}
                    onClick={() => setTab("url")}
                  >
                    URL
                  </Button>
                </div>
                <div className="mt-2">
                  {tab === "file" && (
                    <FileInput
                      placeholder="Upload a GeoJSON file"
                      value={shapefile ?? undefined}
                      supportedFileTypes={["application/geo+json"]}
                      maxSizeInMB={10}
                      onFileChange={(file) => setShapefile(file)}
                    />
                  )}
                  {tab === "url" && (
                    <Input
                      placeholder="https://example.com/shapefile.geojson"
                      value={shapefileEditUrl}
                      onChange={(e) => setShapefileEditUrl(e.target.value)}
                    />
                  )}
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
            onClick={() => handleAddOrEdit()}
            disabled={disableSubmission || isPending}
          >
            {isPending && <Loader2 className="animate-spin mr-2" />}
            {mode === "edit" ?
              isPending ?
                "Saving..."
              : "Save"
            : isPending ?
              "Adding..."
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

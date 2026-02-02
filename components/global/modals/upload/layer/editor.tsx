"use client";

import { useModal } from "@/components/ui/modal/context";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GetRecordResponse } from "climateai-sdk/types";
import { AppGainforestOrganizationLayer } from "climateai-sdk/lex-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckIcon, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const LayerEditorModalId = "layer/editor";

type LayerData = GetRecordResponse<AppGainforestOrganizationLayer.Record>;

type LayerEditorModalProps = {
  initialData: LayerData | null;
};

const layerTypes: {
  value: AppGainforestOrganizationLayer.Record["type"];
  label: string;
}[] = [
  { value: "geojson_points", label: "GeoJSON points" },
  { value: "geojson_points_trees", label: "GeoJSON points (trees)" },
  { value: "geojson_line", label: "GeoJSON line" },
  { value: "choropleth", label: "Choropleth" },
  { value: "choropleth_shannon", label: "Choropleth (Shannon)" },
  { value: "raster_tif", label: "Raster (TIF)" },
  { value: "tms_tile", label: "TMS tile" },
];

export const LayerEditorModal = ({ initialData }: LayerEditorModalProps) => {
  const initialLayer = initialData?.value;
  const mode = initialData ? "edit" : "add";

  const [name, setName] = useState(initialLayer?.name ?? "");
  const [type, setType] = useState<
    AppGainforestOrganizationLayer.Record["type"] | ""
  >(initialLayer?.type ?? "");
  const [uri, setUri] = useState(initialLayer?.uri ?? "");
  const [description, setDescription] = useState(
    initialLayer?.description ?? ""
  );

  const { stack, popModal, hide } = useModal();

  // TODO: SDK does not yet support layer.createOrUpdate - this feature is temporarily disabled
  // Once climateai-sdk adds the createOrUpdate procedure for layers, uncomment the following:
  // import { useMemo } from "react";
  // import { allowedPDSDomains } from "@/config/climateai-sdk";
  // import { trpcApi } from "@/components/providers/TrpcProvider";
  // import { useAtprotoStore } from "@/components/stores/atproto";
  // import { parseAtUri } from "climateai-sdk/utilities/atproto";
  //
  // const rkey = useMemo(
  //   () => (initialData?.uri ? parseAtUri(initialData.uri).rkey : undefined),
  //   [initialData]
  // );
  // const auth = useAtprotoStore((state) => state.auth);
  // const did = auth.user?.did ?? "";
  // const utils = trpcApi.useUtils();
  // const layerRouter = trpcApi.gainforest.organization.layer;
  // const [isCompleted, setIsCompleted] = useState(false);
  //
  // const {
  //   mutate: handleCreateOrUpdate,
  //   isPending,
  //   error,
  // } = layerRouter.createOrUpdate.useMutation({
  //   onSuccess: () => {
  //     utils.gainforest.organization.layer.getAll.invalidate({
  //       did,
  //       pdsDomain: allowedPDSDomains[0],
  //     });
  //     setIsCompleted(true);
  //   },
  // });

  const isCompleted = false; // Will be state when feature is enabled
  const isPending = false;
  const error = null;
  const isFeatureDisabled = true; // Remove this when SDK supports layer.createOrUpdate

  const disableSubmit = !name.trim() || !type || !uri.trim() || isFeatureDisabled;

  const onSubmit = () => {
    // TODO: Restore when SDK supports layer.createOrUpdate
    // handleCreateOrUpdate({
    //   did,
    //   rkey,
    //   layer: {
    //     name: name.trim(),
    //     type: type as AppGainforestOrganizationLayer.Record["type"],
    //     uri: uri.trim(),
    //     description: description.trim() || undefined,
    //   },
    //   pdsDomain: allowedPDSDomains[0],
    // });
    console.warn("Layer create/update is not yet supported by the SDK");
  };

  return (
    <ModalContent>
      <ModalHeader
        backAction={stack.length === 1 ? undefined : () => popModal()}
      >
        <ModalTitle>{mode === "edit" ? "Edit layer" : "Add layer"}</ModalTitle>
        <ModalDescription>
          {mode === "edit"
            ? "Update this layer’s details."
            : "Add a new layer for your organization."}
        </ModalDescription>
      </ModalHeader>

      <AnimatePresence mode="wait">
        {!isCompleted && (
          <motion.section
            key="form"
            className="flex flex-col gap-4"
            exit={{
              opacity: 0,
              filter: "blur(10px)",
              scale: 0.5,
            }}
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="layer-name"
                className="text-sm text-muted-foreground"
              >
                Layer name
              </label>
              <Input
                id="layer-name"
                placeholder="Canopy analysis"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">
                Layer type
              </label>
              <Select
                value={type}
                onValueChange={(
                  val: AppGainforestOrganizationLayer.Record["type"]
                ) => setType(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {layerTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="layer-uri"
                className="text-sm text-muted-foreground"
              >
                Drone data file link
              </label>
              <Input
                id="layer-uri"
                placeholder="https://drive.google.com/..."
                value={uri}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUri(e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Paste a share link from Google Drive, Dropbox, or any hosted URL
                to your drone data file.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="layer-description"
                className="text-sm text-muted-foreground"
              >
                Description (optional)
              </label>
              <Textarea
                id="layer-description"
                placeholder="What does this layer show?"
                value={description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
              />
            </div>

            {error && (
              <div className="text-sm text-destructive">
                {String(error)}
              </div>
            )}

            {isFeatureDisabled && (
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                Layer creation/editing is coming soon. This feature is not yet available.
              </div>
            )}

            <ModalFooter>
              <Button onClick={onSubmit} disabled={disableSubmit || isPending}>
                {isPending && <Loader2 className="animate-spin mr-2" />}
                {isFeatureDisabled
                  ? "Coming soon"
                  : mode === "edit"
                  ? isPending
                    ? "Saving..."
                    : "Save"
                  : isPending
                  ? "Adding..."
                  : "Add layer"}
              </Button>
            </ModalFooter>
          </motion.section>
        )}

        {isCompleted && (
          <motion.section
            key="completed"
            className="w-full h-40 border border-border rounded-lg p-4 flex flex-col items-center justify-center gap-2"
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
            <span className="text-lg font-medium">
              Layer {mode === "edit" ? "updated" : "added"} successfully
            </span>

            <ModalFooter>
              <Button
                onClick={() => {
                  if (stack.length === 1) {
                    hide().then(() => popModal());
                  } else {
                    popModal();
                  }
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </motion.section>
        )}
      </AnimatePresence>
    </ModalContent>
  );
};

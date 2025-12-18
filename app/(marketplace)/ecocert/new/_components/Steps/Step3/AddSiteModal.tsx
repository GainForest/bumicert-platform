"use client";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { useModal } from "@/components/ui/modal/context";
import FileInput from "../components/FileInput";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { useAtprotoStore } from "@/components/stores/atproto";
import { Loader2, PenIcon, UploadIcon } from "lucide-react";
import { trpcApi } from "@/components/providers/TrpcProvider";
import FormField from "../components/FormField";
import { Input } from "@/components/ui/input";

export const AddSiteModalId = "ecocert/new/step3/add-site";

export const AddSiteModal = () => {
  const { stack, popModal, hide } = useModal();
  const [geoJsonFile, setGeoJsonFile] = useState<File | null>(null);
  const [siteName, setSiteName] = useState<string>("");

  const utils = trpcApi.useUtils();
  const auth = useAtprotoStore((state) => state.auth);
  const {
    mutate: createSite,
    isPending: isCreatingSite,
    isSuccess: isCreated,
    error: createSiteError,
  } = trpcApi.gainforest.organization.site.create.useMutation({
    onSuccess: () => {
      utils.gainforest.organization.site.getAll.invalidate({
        did: auth.user?.did ?? "",
        pdsDomain: allowedPDSDomains[0],
      });
    },
  });

  const handleCreateSite = async () => {
    if (!geoJsonFile) throw new Error("GeoJSON file is required");
    await createSite({
      site: {
        name: siteName,
      },
      uploads: {
        shapefile: {
          name: geoJsonFile.name,
          type: geoJsonFile.type,
          dataBase64: await geoJsonFile
            .arrayBuffer()
            .then((buffer) => Buffer.from(buffer).toString("base64")),
        },
      },
      pdsDomain: allowedPDSDomains[0],
    });
  };
  return (
    <ModalContent>
      <ModalHeader
        backAction={
          stack.length === 1
            ? undefined
            : () => {
                popModal();
              }
        }
      >
        <ModalTitle>Add Site</ModalTitle>
        <ModalDescription>
          Add a new site to your organization.
        </ModalDescription>
      </ModalHeader>
      <div className="flex flex-col gap-2 mb-2">
        <FormField label="Name" Icon={PenIcon} biokoMode={false}>
          <Input
            value={siteName}
            id="name"
            placeholder="Name of the site"
            onChange={(e) => setSiteName(e.target.value)}
          />
        </FormField>
      </div>
      <FileInput
        placeholder="Upload or drag and drop a GeoJSON file"
        supportedFileTypes={["application/geo+json"]}
        maxSizeInMB={10}
        onFileChange={(file) => {
          setGeoJsonFile(file);
        }}
        value={geoJsonFile}
      />
      {createSiteError && (
        <div className="text-sm text-destructive mt-2">
          {createSiteError.message.startsWith("[")
            ? "Bad Request"
            : createSiteError.message}
        </div>
      )}
      <ModalFooter>
        {isCreated ? (
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
            Done
          </Button>
        ) : (
          <Button
            disabled={isCreatingSite || !geoJsonFile || siteName.trim() === ""}
            onClick={() => handleCreateSite()}
          >
            {isCreatingSite ? (
              <Loader2 className="animate-spin" />
            ) : (
              <UploadIcon />
            )}
            {isCreatingSite ? "Creating..." : "Create"}
          </Button>
        )}
      </ModalFooter>
    </ModalContent>
  );
};

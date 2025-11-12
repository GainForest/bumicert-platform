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
import { trpcClient } from "@/lib/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtprotoStore } from "@/components/stores/atproto";
import {
  Loader2,
  PenIcon,
  UnfoldHorizontalIcon,
  UnfoldVerticalIcon,
  UploadIcon,
} from "lucide-react";
import FormField from "../components/FormField";
import { Input } from "@/components/ui/input";

export const AddSiteModalId = "ecocert/new/step3/add-site";

export const AddSiteModal = () => {
  const { stack, popModal, hide } = useModal();
  const [geoJsonFile, setGeoJsonFile] = useState<File | null>(null);
  const [siteName, setSiteName] = useState<string>("");
  const [siteLat, setSiteLat] = useState<string>("");
  const [siteLon, setSiteLon] = useState<string>("");

  const queryClient = useQueryClient();
  const auth = useAtprotoStore((state) => state.auth);
  const {
    mutate: createSite,
    isPending: isCreatingSite,
    isSuccess: isCreated,
    error: createSiteError,
  } = useMutation({
    mutationKey: ["createSite"],
    mutationFn: async () => {
      if (!geoJsonFile) throw new Error("GeoJSON file is required");
      await trpcClient.gainforest.site.create.mutate({
        site: {
          name: siteName,
          lat: siteLat,
          lon: siteLon,
          area: "100",
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
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllSites", auth.user?.did],
      });
    },
  });
  return (
    <ModalContent>
      <ModalHeader
        backAction={
          stack.length === 1 ?
            undefined
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
        <div className="flex items-center gap-2">
          <FormField
            label="Latitude"
            Icon={UnfoldVerticalIcon}
            biokoMode={false}
          >
            <Input
              value={siteLat}
              id="latitude"
              placeholder="90"
              onChange={(e) => setSiteLat(e.target.value)}
            />
          </FormField>
          <FormField
            label="Longitude"
            Icon={UnfoldHorizontalIcon}
            biokoMode={false}
          >
            <Input
              id="longitude"
              value={siteLon}
              placeholder="-180"
              onChange={(e) => setSiteLon(e.target.value)}
            />
          </FormField>
        </div>
      </div>
      <FileInput
        placeholder="Upload or drag and drop a GeoJSON file"
        supportedFileTypes={["application/geo+json", "application/json"]}
        maxSizeInMB={10}
        onFileChange={(file) => {
          setGeoJsonFile(file);
        }}
        value={geoJsonFile}
      />
      {createSiteError && (
        <div className="text-sm text-destructive mt-2">
          {createSiteError.message.startsWith("[") ?
            "Bad Request"
          : createSiteError.message}
        </div>
      )}
      <ModalFooter>
        {isCreated ?
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
        : <Button
            disabled={
              isCreatingSite ||
              !geoJsonFile ||
              siteName.trim() === "" ||
              siteLat.trim() === "" ||
              siteLon.trim() === ""
            }
            onClick={() => createSite()}
          >
            {isCreatingSite ?
              <Loader2 className="animate-spin" />
            : <UploadIcon />}
            {isCreatingSite ? "Creating..." : "Create"}
          </Button>
        }
      </ModalFooter>
    </ModalContent>
  );
};

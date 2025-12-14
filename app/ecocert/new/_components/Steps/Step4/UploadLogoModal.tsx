import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import FileInput from "../components/FileInput";
import { useState } from "react";
import { Loader2, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allowedPDSDomains, trpcClient } from "@/config/climateai-sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtprotoStore } from "@/components/stores/atproto";
import { useModal } from "@/components/ui/modal/context";
import { toBlobRefGenerator, toFileGenerator } from "climateai-sdk/zod";

export const UploadLogoModalId = "upload/organization/logo";

export const UploadLogoModal = () => {
  const { stack, popModal, hide } = useModal();
  const [logo, setLogo] = useState<File | null>(null);
  const auth = useAtprotoStore((state) => state.auth);
  const queryClient = useQueryClient();

  const {
    data: organizationInfo,
    isPending: isPendingOrganizationInfo,
    isPlaceholderData: isOlderData,
  } = useQuery({
    queryKey: ["organizationInfo", auth.user?.did],
    queryFn: async () => {
      const response = await trpcClient.gainforest.organization.info.get.query({
        pdsDomain: allowedPDSDomains[0],
        did: auth.user?.did ?? "",
      });
      return response.value;
    },
  });
  const isLoadingOrganizationInfo = isPendingOrganizationInfo || isOlderData;
  const {
    mutate: uploadLogo,
    isPending: isUploadingLogo,
    isSuccess: isUploaded,
  } = useMutation({
    mutationFn: async () => {
      if (!auth.user?.did) throw new Error("User is not authenticated");
      if (!logo) throw new Error("Logo is required");
      if (!organizationInfo)
        throw new Error("Organization information is required");
      return await trpcClient.gainforest.organization.info.createOrUpdate.mutate(
        {
          did: auth.user?.did ?? "",
          uploads: {
            logo: await toFileGenerator(logo),
          },
          info: {
            ...organizationInfo,
            logo: organizationInfo.logo
              ? toBlobRefGenerator(organizationInfo.logo.image)
              : undefined,
            coverImage: organizationInfo.coverImage
              ? toBlobRefGenerator(organizationInfo.coverImage.image)
              : undefined,
          },
          pdsDomain: allowedPDSDomains[0],
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizationInfo", auth.user?.did],
      });
    },
  });
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
        <ModalTitle>Upload Logo</ModalTitle>
        <ModalDescription>
          Upload a logo for your organization.
        </ModalDescription>
      </ModalHeader>
      {isLoadingOrganizationInfo ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin" />
          <span className="text-sm text-muted-foreground">
            Loading organization information...
          </span>
        </div>
      ) : (
        <FileInput
          placeholder="Upload a logo for your organization"
          supportedFileTypes={[
            "image/jpg",
            "image/jpeg",
            "image/png",
            "image/webp",
          ]}
          maxSizeInMB={5}
          value={logo}
          onFileChange={setLogo}
        />
      )}

      <ModalFooter>
        {isUploaded ? (
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
            disabled={isLoadingOrganizationInfo || !logo || isUploadingLogo}
            onClick={() => uploadLogo()}
          >
            {isUploadingLogo ? (
              <Loader2 className="animate-spin" />
            ) : (
              <UploadIcon />
            )}
            {isUploadingLogo ? "Uploading..." : "Upload"}
          </Button>
        )}
      </ModalFooter>
    </ModalContent>
  );
};

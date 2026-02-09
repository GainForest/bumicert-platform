import { BumicertArt } from "@/app/(marketplace)/bumicert/create/[draftId]/_components/Steps/Step4/BumicertPreviewCard";
import { Ecocert as Bumicert } from "gainforest-sdk/types";
import {
  deserialize,
  SerializedSuperjson,
} from "gainforest-sdk/utilities/transform";
import { OrgHypercertsDefs as Defs } from "gainforest-sdk/lex-api";
import React from "react";
import { getBlobUrl } from "gainforest-sdk/utilities/atproto";
import { allowedPDSDomains } from "@/config/gainforest-sdk";

const BumicertsClient = ({
  did,
  serializedInitialData,
}: {
  did: string;
  serializedInitialData: SerializedSuperjson<Array<Bumicert>>;
}) => {
  const initialData = deserialize(serializedInitialData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {initialData.map((bumicert) => {
        const image = bumicert.claimActivity.value.image;
        let coverImageUrl: string;
        const smallImageType: Defs.SmallImage["$type"] =
          "org.hypercerts.defs#smallImage";
        const uriType: Defs.Uri["$type"] = "org.hypercerts.defs#uri";
        if (image?.$type === smallImageType) {
          const blob = (image as Defs.SmallImage).image;
          coverImageUrl = getBlobUrl(did, blob, allowedPDSDomains[0]);
        } else if (image?.$type === uriType) {
          coverImageUrl = (image as Defs.Uri).uri;
        } else {
          return null;
        }

        return (
          <div
            className="flex items-center justify-center"
            key={bumicert.claimActivity.uri}
          >
            <BumicertArt
              logoUrl={bumicert.organizationInfo.logoUrl}
              coverImage={coverImageUrl}
              title={bumicert.claimActivity.value.title}
              objectives={
                (bumicert.claimActivity.value.workScope as { withinAnyOf?: string[] } | undefined)?.withinAnyOf ?? []
              }
              startDate={bumicert.claimActivity.value.startDate ? new Date(bumicert.claimActivity.value.startDate) : undefined}
              endDate={bumicert.claimActivity.value.endDate ? new Date(bumicert.claimActivity.value.endDate) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
};

export default BumicertsClient;

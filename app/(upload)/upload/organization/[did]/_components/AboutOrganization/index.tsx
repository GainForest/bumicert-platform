"use client";
import React, { useEffect, useMemo } from "react";
import type { AppGainforestOrganizationInfo } from "gainforest-sdk/lex-api";
import { useOrganizationPageStore } from "../../store";
import useHydratedData from "@/hooks/use-hydration";
import {
  deserialize,
  SerializedSuperjson,
} from "gainforest-sdk/utilities/transform";
import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";
import QuickTooltip from "@/components/ui/quick-tooltip";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { LinearDocument } from 'leaflet-parser';
import type { LinearDocumentType } from 'leaflet-parser';

const DynamicEditableLinearDocument = dynamic(
  () => import('leaflet-parser').then(mod => mod.EditableLinearDocument),
  { ssr: false }
);

const EMPTY_LINEAR_DOCUMENT = { blocks: [] };

const AboutOrganization = ({
  initialData,
  dynamic = true,
}: {
  initialData: SerializedSuperjson<AppGainforestOrganizationInfo.Record>;
  dynamic?: boolean;
}) => {
  const reactiveData = useOrganizationPageStore((state) => state.data);
  const data = useHydratedData(
    deserialize(initialData),
    dynamic ? reactiveData : null
  );
  const isEditing = useOrganizationPageStore((state) => state.isEditing);
  const editingData = useOrganizationPageStore(
    (state) => state.aboutEditingData
  );
  const setEditingData = useOrganizationPageStore(
    (actions) => actions.setAboutEditingData
  );

  const extractPlaintext = (doc: LinearDocumentType): string => {
    if (!doc || !doc.blocks) return '';
    return doc.blocks.map((b) => {
      const block = b.block;
      if ('plaintext' in block) return block.plaintext;
      return '';
    }).join('\n');
  };

  const longDescriptionError = useMemo(() => {
    if (!isEditing) return null;
    const plaintext = extractPlaintext(editingData.longDescription);
    if (plaintext.length < 50) return "Long description is too short.";
    if (plaintext.length > 5000) return "Long description is too long.";
    return null;
  }, [editingData.longDescription, isEditing]);

  useEffect(() => {
    setEditingData({
      longDescription: data.longDescription ?? EMPTY_LINEAR_DOCUMENT,
    });
  }, [isEditing, data, setEditingData]);

  return (
    <div className="p-2 mt-6">
      <h2 className="font-serif font-bold text-2xl">About Organization</h2>
      {isEditing ? (
        <div className="relative">
          <div className={cn(
            "bg-background min-h-44 w-full mt-2 rounded-md border border-border overflow-hidden",
            longDescriptionError && "border-destructive"
          )}>
            <DynamicEditableLinearDocument
              document={editingData.longDescription}
              onChange={(doc) => setEditingData({ ...editingData, longDescription: doc })}
            />
          </div>
          {longDescriptionError && (
            <QuickTooltip
              asChild
              content={longDescriptionError}
              contentClassName="text-white"
              backgroundColor="var(--destructive)"
            >
              <Button
                variant={"destructive"}
                size={"icon-sm"}
                className="absolute top-1 right-1 h-6 w-6"
              >
                <CircleAlert />
              </Button>
            </QuickTooltip>
          )}
        </div>
      ) : (
        <div className="mt-2">
          {data.longDescription.blocks.length === 0 ? (
            <span className="text-muted-foreground">
              No long description provided.
            </span>
          ) : (
            <LinearDocument document={data.longDescription} />
          )}
        </div>
      )}
    </div>
  );
};

export default AboutOrganization;

"use client";
import React, { useEffect, useMemo } from "react";
import type { AppGainforestOrganizationInfo } from "climateai-sdk/lex-api";
import { useOrganizationPageStore } from "../../store";
import { Textarea } from "@/components/ui/textarea";
import useHydratedData from "@/hooks/use-hydration";
import {
  deserialize,
  SerializedSuperjson,
} from "climateai-sdk/utilities/transform";
import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";
import QuickTooltip from "@/components/ui/quick-tooltip";
import { Button } from "@/components/ui/button";

const AboutOrganization = ({
  initialData,
}: {
  initialData: SerializedSuperjson<AppGainforestOrganizationInfo.Record>;
}) => {
  const reactiveData = useOrganizationPageStore((state) => state.data);
  const data = useHydratedData(deserialize(initialData), reactiveData);
  const isEditing = useOrganizationPageStore((state) => state.isEditing);
  const editingData = useOrganizationPageStore(
    (state) => state.aboutEditingData
  );
  const setEditingData = useOrganizationPageStore(
    (actions) => actions.setAboutEditingData
  );

  const longDescriptionError = useMemo(() => {
    if (!isEditing) return null;
    const longDescription = editingData.longDescription;
    if (longDescription.length < 50) return "Long description is too short.";
    if (longDescription.length > 5000) return "Long description is too long.";
    return null;
  }, [editingData.longDescription, isEditing]);

  useEffect(() => {
    setEditingData({
      longDescription: data.longDescription,
    });
  }, [isEditing, data]);

  return (
    <div className="p-2 mt-6">
      <h2 className="font-serif font-bold text-2xl">About Organization</h2>
      {isEditing ? (
        <div className="relative">
          <Textarea
            value={editingData.longDescription}
            placeholder="Long description"
            className={cn(
              "bg-background min-h-44 w-full mt-2",
              longDescriptionError &&
                "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40 pr-8"
            )}
            onChange={(e) =>
              setEditingData({
                ...editingData,
                longDescription: e.target.value,
              })
            }
          />
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
        <p className="text-justify mt-2">
          {data.longDescription === "" ? (
            <span className="text-muted-foreground">
              No long description provided.
            </span>
          ) : (
            data.longDescription
          )}
        </p>
      )}
    </div>
  );
};

export default AboutOrganization;

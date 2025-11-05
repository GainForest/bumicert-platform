"use client";
import React, { useEffect, useState } from "react";
import type { AppGainforestOrganizationInfo } from "@/lexicon-api";
import { useOrganizationPageStore } from "../../store";
import { Textarea } from "@/components/ui/textarea";

const AboutOrganization = ({
  initialData,
}: {
  initialData: AppGainforestOrganizationInfo.Record;
}) => {
  const [data] = useState(initialData);
  const isEditing = useOrganizationPageStore((state) => state.isEditing);
  const editingData = useOrganizationPageStore(
    (state) => state.aboutEditingData
  );
  const setEditingData = useOrganizationPageStore(
    (actions) => actions.setAboutEditingData
  );

  useEffect(() => {
    setEditingData({
      longDescription: data.longDescription,
    });
  }, [isEditing, data]);

  return (
    <div className="p-2 mt-6">
      <h2 className="font-serif font-bold text-2xl">About Organization</h2>
      {isEditing ?
        <Textarea
          value={editingData.longDescription}
          placeholder="Long description"
          className="bg-background min-h-44 w-full mt-2"
          onChange={(e) =>
            setEditingData({
              ...editingData,
              longDescription: e.target.value,
            })
          }
        />
      : <p className="text-justify mt-2">
          {data.longDescription === "" ?
            <span className="text-muted-foreground">
              No long description provided.
            </span>
          : data.longDescription}
        </p>
      }
    </div>
  );
};

export default AboutOrganization;

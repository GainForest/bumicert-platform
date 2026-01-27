"use client";

import React, { useEffect, useMemo } from "react";
import { useOrganizationPageStore } from "../../store";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const AboutSection = () => {
  const data = useOrganizationPageStore((state) => state.data);
  const isEditing = useOrganizationPageStore((state) => state.isEditing);
  const aboutEditingData = useOrganizationPageStore((state) => state.aboutEditingData);
  const setAboutEditingData = useOrganizationPageStore((state) => state.setAboutEditingData);

  const longDescriptionError = useMemo(() => {
    if (!isEditing) return null;
    const longDescription = aboutEditingData.longDescription;
    if (longDescription.length > 0 && longDescription.length < 50) return "Too short (min 50 characters)";
    if (longDescription.length > 5000) return "Too long (max 5000 characters)";
    return null;
  }, [aboutEditingData.longDescription, isEditing]);

  useEffect(() => {
    if (isEditing && data) {
      setAboutEditingData({
        longDescription: data.longDescription,
      });
    }
  }, [isEditing, data, setAboutEditingData]);

  if (!data) return null;

  // Don't show section if not editing and no content
  if (!isEditing && !data.longDescription) return null;

  return (
    <div className="mt-6 pt-6 border-t border-border/30">
      <h2 className="text-sm font-medium text-foreground mb-3">About</h2>
      {isEditing ? (
        <div className="relative">
          <Textarea
            value={aboutEditingData.longDescription}
            placeholder="Tell people more about your organization..."
            className={cn(
              "min-h-32 resize-none",
              longDescriptionError && "border-amber-500 focus-visible:ring-amber-500/20"
            )}
            onChange={(e) =>
              setAboutEditingData({
                longDescription: e.target.value,
              })
            }
          />
          {longDescriptionError && (
            <span className="text-xs text-amber-600 dark:text-amber-500 mt-1 block">
              {longDescriptionError}
            </span>
          )}
          <span className="text-xs text-muted-foreground mt-1 block">
            {aboutEditingData.longDescription.length} / 5000 characters
          </span>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {data.longDescription}
        </p>
      )}
    </div>
  );
};

export default AboutSection;

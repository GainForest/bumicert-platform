"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { useOrganizationPageStore } from "../../store";
import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { Pencil, Check, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import { SaveInfoModal, SaveInfoModalId } from "../SaveInfoModal";
import { useAtprotoStore } from "@/components/stores/atproto";
import {
  ImageEditorModal,
  ImageEditorModalId,
} from "../../_modals/image-editor";
import EditableText from "@/components/ui/editable-text";
import { cn } from "@/lib/utils";

interface OrganizationHeaderProps {
  did: string;
}

const OrganizationHeader = ({ did }: OrganizationHeaderProps) => {
  const auth = useAtprotoStore((state) => state.auth);
  const data = useOrganizationPageStore((state) => state.data);
  const isEditing = useOrganizationPageStore((state) => state.isEditing);
  const setIsEditing = useOrganizationPageStore((state) => state.setIsEditing);
  const editingData = useOrganizationPageStore((state) => state.heroEditingData);
  const setEditingData = useOrganizationPageStore((state) => state.setHeroEditingData);
  const { show, pushModal } = useModal();

  const isOwner = auth.status === "AUTHENTICATED" && auth.user.did === did;

  const logoUrl = data.logo
    ? getBlobUrl(did, data.logo.image, allowedPDSDomains[0])
    : null;

  const displayNameError = useMemo(() => {
    if (!isEditing) return null;
    const displayName = editingData.displayName;
    if (displayName.length < 8) return "Too short";
    if (displayName.length > 255) return "Too long";
    return null;
  }, [editingData.displayName, isEditing]);

  useEffect(() => {
    if (isEditing) {
      setEditingData({
        displayName: data.displayName,
        shortDescription: data.shortDescription,
        coverImage: data.coverImage?.image,
        logoImage: data.logo?.image,
      });
    }
  }, [isEditing]);

  const handleSave = () => {
    pushModal(
      { id: SaveInfoModalId, content: <SaveInfoModal /> },
      true
    );
    show();
  };

  const handleEditLogo = () => {
    pushModal(
      { id: ImageEditorModalId, content: <ImageEditorModal type="logo" /> },
      true
    );
    show();
  };

  return (
    <div className="flex items-start gap-4 py-6">
      {/* Logo */}
      <div className="relative shrink-0">
        <div className={cn(
          "w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border/50",
          isEditing && "ring-2 ring-primary/20"
        )}>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={data.displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
              <Upload className="size-6" strokeWidth={1.25} />
            </div>
          )}
        </div>
        {isEditing && (
          <button
            onClick={handleEditLogo}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Pencil className="size-3" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <EditableText
            value={editingData.displayName}
            onChange={(value) => setEditingData({ ...editingData, displayName: value })}
            className="text-2xl font-serif font-semibold"
            placeholder="Organization name"
          />
        ) : (
          <h1 className="text-2xl font-serif font-semibold text-foreground truncate">
            {data.displayName || "Unnamed Organization"}
          </h1>
        )}
        {isEditing ? (
          <EditableText
            value={editingData.shortDescription}
            onChange={(value) => setEditingData({ ...editingData, shortDescription: value })}
            className="text-sm text-muted-foreground mt-1"
            placeholder="Short description..."
            multiline
          />
        ) : (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {data.shortDescription || "No description"}
          </p>
        )}
        {displayNameError && isEditing && (
          <span className="text-xs text-amber-600 dark:text-amber-500 mt-1">
            {displayNameError}
          </span>
        )}
      </div>

      {/* Actions */}
      {isOwner && (
        <div className="flex items-center gap-2 shrink-0">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                <X className="size-4" strokeWidth={1.5} />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check className="size-4" strokeWidth={1.5} />
                Save
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="size-4" strokeWidth={1.5} />
              Edit
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationHeader;

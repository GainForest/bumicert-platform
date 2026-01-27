"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { useOrganizationPageStore } from "../../store";
import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { Pencil, Check, X, Upload, MapPin, Globe, Calendar, Eye, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import { SaveInfoModal, SaveInfoModalId } from "../SaveInfoModal";
import { useAtprotoStore } from "@/components/stores/atproto";
import {
  ImageEditorModal,
  ImageEditorModalId,
} from "../../_modals/image-editor";
import CountrySelectorModal, {
  CountrySelectorModalId,
} from "../../_modals/country-selector";
import WebsiteEditorModal, {
  WebsiteEditorModalId,
} from "../../_modals/website-editor";
import {
  StartDateSelectorModal,
  StartDateSelectorModalId,
} from "../../_modals/start-date-selector";
import VisibilitySelectorModal, {
  VisibilitySelectorModalId,
} from "../../_modals/visibility-selector";
import EditableText from "@/components/ui/editable-text";
import { cn } from "@/lib/utils";
import { countries } from "@/lib/countries";

interface OrganizationHeaderProps {
  did: string;
}

const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

const formatWebsite = (website: string | undefined) => {
  if (!website) return null;
  return website.replace(/^https?:\/\//, "").replace(/\/$/, "");
};

const OrganizationHeader = ({ did }: OrganizationHeaderProps) => {
  const auth = useAtprotoStore((state) => state.auth);
  const data = useOrganizationPageStore((state) => state.data);
  const isEditing = useOrganizationPageStore((state) => state.isEditing);
  const setIsEditing = useOrganizationPageStore((state) => state.setIsEditing);
  const heroEditingData = useOrganizationPageStore((state) => state.heroEditingData);
  const setHeroEditingData = useOrganizationPageStore((state) => state.setHeroEditingData);
  const subHeroEditingData = useOrganizationPageStore((state) => state.subHeroEditingData);
  const setSubHeroEditingData = useOrganizationPageStore((state) => state.setSubHeroEditingData);
  const { show, pushModal } = useModal();

  const isOwner = auth.status === "AUTHENTICATED" && auth.user.did === did;

  // Compute logoUrl safely (data may be null during hydration)
  const logoUrl = data?.logo
    ? getBlobUrl(did, data.logo.image, allowedPDSDomains[0])
    : null;

  // All hooks must be called before any conditional returns
  const displayNameError = useMemo(() => {
    if (!isEditing) return null;
    const displayName = heroEditingData.displayName;
    if (displayName.length < 8) return "Too short";
    if (displayName.length > 255) return "Too long";
    return null;
  }, [heroEditingData.displayName, isEditing]);

  useEffect(() => {
    if (isEditing && data) {
      setHeroEditingData({
        displayName: data.displayName,
        shortDescription: data.shortDescription,
        coverImage: data.coverImage?.image,
        logoImage: data.logo?.image,
      });
      setSubHeroEditingData({
        country: data.country,
        website: data.website,
        startDate: data.startDate ?? null,
        visibility: data.visibility,
        objectives: data.objectives,
      });
    }
  }, [isEditing, data, setHeroEditingData, setSubHeroEditingData]);

  const handleSave = () => {
    pushModal(
      { id: SaveInfoModalId, content: <SaveInfoModal /> },
      true
    );
    show();
  };

  const handleEditLogo = () => {
    pushModal(
      {
        id: ImageEditorModalId + `/${did}/logo-image`,
        content: (
          <ImageEditorModal
            title="Edit Organization Logo"
            description="Choose an image to update the organization logo."
            initialImage={heroEditingData.logoImage}
            did={did}
            onImageChange={(image) => {
              setHeroEditingData({
                ...heroEditingData,
                logoImage: image,
              });
            }}
          />
        ),
      },
      true
    );
    show();
  };

  const handleEditCountry = () => {
    pushModal(
      {
        id: CountrySelectorModalId,
        content: (
          <CountrySelectorModal
            initialCountryCode={subHeroEditingData.country}
            onCountryChange={(country) => {
              setSubHeroEditingData({
                ...subHeroEditingData,
                country,
              });
            }}
          />
        ),
      },
      true
    );
    show();
  };

  const handleEditWebsite = () => {
    pushModal(
      {
        id: WebsiteEditorModalId,
        content: (
          <WebsiteEditorModal
            initialWebsite={subHeroEditingData.website}
            onWebsiteChange={(website) => {
              setSubHeroEditingData({
                ...subHeroEditingData,
                website,
              });
            }}
          />
        ),
      },
      true
    );
    show();
  };

  const handleEditStartDate = () => {
    const initialDate = subHeroEditingData.startDate
      ? new Date(subHeroEditingData.startDate)
      : new Date();
    pushModal(
      {
        id: StartDateSelectorModalId,
        content: (
          <StartDateSelectorModal
            initialStartDate={initialDate}
            onStartDateChange={(startDate) => {
              setSubHeroEditingData({
                ...subHeroEditingData,
                startDate: startDate.toISOString(),
              });
            }}
          />
        ),
      },
      true
    );
    show();
  };

  const handleEditVisibility = () => {
    pushModal(
      {
        id: VisibilitySelectorModalId,
        content: (
          <VisibilitySelectorModal
            initialVisibility={subHeroEditingData.visibility}
            onVisibilityChange={(visibility) => {
              setSubHeroEditingData({
                ...subHeroEditingData,
                visibility,
              });
            }}
          />
        ),
      },
      true
    );
    show();
  };

  // Return null if data hasn't loaded yet (after all hooks)
  if (!data) {
    return null;
  }

  // Get display values
  const countryData = isEditing
    ? countries[subHeroEditingData.country]
    : countries[data.country];
  const websiteDisplay = isEditing
    ? formatWebsite(subHeroEditingData.website)
    : formatWebsite(data.website);
  const dateDisplay = isEditing
    ? formatDate(subHeroEditingData.startDate)
    : formatDate(data.startDate);
  const visibilityDisplay = isEditing
    ? subHeroEditingData.visibility
    : data.visibility;

  return (
    <div className="py-6">
      {/* Main header row */}
      <div className="flex items-start gap-4">
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
              value={heroEditingData.displayName}
              onChange={(value) => setHeroEditingData({ ...heroEditingData, displayName: value })}
              className="text-2xl font-serif font-semibold px-2 py-1 -mx-2 rounded-md ring-1 ring-border/50 focus:ring-primary"
              placeholder="Organization name"
              editable
            />
          ) : (
            <h1 className="text-2xl font-serif font-semibold text-foreground truncate">
              {data.displayName || "Unnamed Organization"}
            </h1>
          )}
          {isEditing ? (
            <EditableText
              value={heroEditingData.shortDescription}
              onChange={(value) => setHeroEditingData({ ...heroEditingData, shortDescription: value })}
              className="text-sm text-muted-foreground mt-2 px-2 py-1 -mx-2 rounded-md ring-1 ring-border/50 focus:ring-primary"
              placeholder="Short description..."
              multiline
              editable
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

      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
        {/* Country */}
        <MetadataChip
          icon={MapPin}
          label={countryData ? `${countryData.emoji} ${countryData.name}` : "Add country"}
          isEmpty={!countryData}
          isEditing={isEditing}
          onClick={handleEditCountry}
        />

        {/* Website */}
        <MetadataChip
          icon={Globe}
          label={websiteDisplay || "Add website"}
          isEmpty={!websiteDisplay}
          isEditing={isEditing}
          onClick={handleEditWebsite}
        />

        {/* Start date */}
        <MetadataChip
          icon={Calendar}
          label={dateDisplay ? `Since ${dateDisplay}` : "Add start date"}
          isEmpty={!dateDisplay}
          isEditing={isEditing}
          onClick={handleEditStartDate}
        />

        {/* Visibility */}
        <MetadataChip
          icon={Eye}
          label={visibilityDisplay}
          isEmpty={false}
          isEditing={isEditing}
          onClick={handleEditVisibility}
        />
      </div>
    </div>
  );
};

interface MetadataChipProps {
  icon: React.ElementType;
  label: string;
  isEmpty: boolean;
  isEditing: boolean;
  onClick: () => void;
}

const MetadataChip = ({ icon: Icon, label, isEmpty, isEditing, onClick }: MetadataChipProps) => {
  if (isEditing) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors",
          "hover:bg-foreground/5 border border-transparent hover:border-border/50",
          isEmpty && "text-muted-foreground/50"
        )}
      >
        <Icon className="size-3.5" strokeWidth={1.5} />
        <span>{label}</span>
        <ChevronRight className="size-3 ml-0.5" strokeWidth={1.5} />
      </button>
    );
  }

  if (isEmpty) return null;

  return (
    <div className="flex items-center gap-1.5">
      <Icon className="size-3.5" strokeWidth={1.5} />
      <span>{label}</span>
    </div>
  );
};

export default OrganizationHeader;

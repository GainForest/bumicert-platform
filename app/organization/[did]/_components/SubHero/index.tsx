"use client";
import { Button } from "@/components/ui/button";
import type { AppGainforestOrganizationInfo } from "@/lexicon-api";
import {
  ArrowUpRightFromSquare,
  Calendar,
  ChevronRight,
  Eye,
  Globe,
  LucideIcon,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useOrganizationPageStore } from "../../store";
import { useModal } from "@/components/ui/modal/context";
import VisibilitySelectorModal, {
  VisibilitySelectorModalId,
} from "../../_modals/visibility-selector";
import WebsiteEditorModal, {
  WebsiteEditorModalId,
} from "../../_modals/website-editor";
import { countries } from "@/lib/countries";
import CountrySelectorModal, {
  CountrySelectorModalId,
} from "../../_modals/country-selector";
import {
  StartDateSelectorModal,
  StartDateSelectorModalId,
} from "../../_modals/start-date-selector";
import useHydratedData from "@/hooks/use-hydration";

const formatWebsite = (website: string | undefined) => {
  if (!website) return undefined;
  const websiteWithoutProtocol = website.replace(/^https?:\/\//, "");
  return websiteWithoutProtocol.length > 16 ?
      websiteWithoutProtocol.slice(0, 16) + "..."
    : websiteWithoutProtocol;
};

const getCountryData = (country: string) => {
  if (countries[country]) {
    return countries[country];
  }
  return null;
};

const formatCountryName = (countryName: string | undefined) => {
  if (!countryName) return undefined;
  return countryName.length > 16 ?
      countryName.slice(0, 16) + "..."
    : countryName;
};

const getDateFromString = (dateString: string | undefined) => {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return undefined;
    }
    return date;
  } catch {
    return undefined;
  }
};

const formatDate = (date: Date | undefined) => {
  if (!date) return undefined;
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const SubHero = ({
  initialData,
}: {
  initialData: AppGainforestOrganizationInfo.Record;
}) => {
  const reactiveData = useOrganizationPageStore((state) => state.data);
  const data = useHydratedData(initialData, reactiveData);

  const isEditing = useOrganizationPageStore((state) => state.isEditing);
  const editingData = useOrganizationPageStore(
    (state) => state.subHeroEditingData
  );
  const setEditingData = useOrganizationPageStore(
    (actions) => actions.setSubHeroEditingData
  );

  useEffect(() => {
    setEditingData({
      country: data.country,
      website: data.website,
      startDate: data.startDate ?? null,
      visibility: data.visibility,
      objectives: data.objectives,
    });
  }, [isEditing, data]);

  const countryData = getCountryData(data.country);
  const editingCountryData = getCountryData(editingData.country);

  return (
    <div className="flex items-stretch gap-2 px-2 -mt-6 relative z-10">
      <SubHeroChip
        PropertyIcon={MapPin}
        propertyName="Country of origin"
        propertyValue={formatCountryName(countryData?.name) ?? "NOT_DEFINED"}
        editingPropertyValue={
          formatCountryName(editingCountryData?.name) ?? "NOT_DEFINED"
        }
        modalId={CountrySelectorModalId}
        modalContent={
          <CountrySelectorModal
            initialCountryCode={editingData.country}
            onCountryChange={(country) => {
              setEditingData({
                ...editingData,
                country,
              });
            }}
          />
        }
      >
        <span className="absolute z-0 top-0 bottom-0 right-2 flex items-center justify-center text-6xl opacity-25 pointer-events-none select-none">
          {isEditing ? editingCountryData?.emoji : countryData?.emoji}
        </span>
      </SubHeroChip>

      <SubHeroChip
        PropertyIcon={Globe}
        propertyName="Website"
        propertyValue={
          formatWebsite(data.website) ?
            <>
              {formatWebsite(data.website)}
              {data.website && (
                <Link href={data.website} target="_blank" className="ml-1">
                  <Button variant={"outline"} size={"icon-sm"}>
                    <ArrowUpRightFromSquare />
                  </Button>
                </Link>
              )}
            </>
          : "NOT_DEFINED"
        }
        editingPropertyValue={
          formatWebsite(editingData.website) ?
            <>{formatWebsite(editingData.website)}</>
          : "NOT_DEFINED"
        }
        modalId={WebsiteEditorModalId}
        modalContent={
          <WebsiteEditorModal
            initialWebsite={editingData.website}
            onWebsiteChange={(website) => {
              setEditingData({
                ...editingData,
                website,
              });
            }}
          />
        }
      />

      <SubHeroChip
        PropertyIcon={Calendar}
        propertyName="Date started"
        propertyValue={
          formatDate(getDateFromString(data.startDate ?? undefined)) ??
          "NOT_DEFINED"
        }
        editingPropertyValue={
          formatDate(getDateFromString(editingData.startDate ?? undefined)) ??
          "NOT_DEFINED"
        }
        modalId={StartDateSelectorModalId}
        modalContent={
          <StartDateSelectorModal
            initialStartDate={
              getDateFromString(editingData.startDate ?? undefined) ??
              new Date()
            }
            onStartDateChange={(startDate) => {
              setEditingData({
                ...editingData,
                startDate: startDate.toISOString(),
              });
            }}
          />
        }
      />

      <SubHeroChip
        PropertyIcon={Eye}
        propertyName="Visibility"
        propertyValue={data.visibility}
        editingPropertyValue={editingData.visibility}
        modalId={VisibilitySelectorModalId}
        modalContent={
          <VisibilitySelectorModal
            initialVisibility={editingData.visibility}
            onVisibilityChange={(visibility) => {
              setEditingData({
                ...editingData,
                visibility: visibility,
              });
            }}
          />
        }
      />
    </div>
  );
};

export const SubHeroChip = <T extends React.ReactNode>({
  PropertyIcon,
  propertyName,
  propertyValue,
  editingPropertyValue,
  children,
  modalId,
  modalContent,
}: {
  PropertyIcon: LucideIcon;
  propertyName: string;
  propertyValue: T | "NOT_DEFINED";
  editingPropertyValue: T | "NOT_DEFINED";
  children?: React.ReactNode;
  modalId: string;
  modalContent: React.ReactNode;
}) => {
  const isEditing = useOrganizationPageStore((state) => state.isEditing);
  const { pushModal, show } = useModal();
  return (
    <div className="flex-1 bg-foreground/5 rounded-lg p-2 flex items-center justify-between relative">
      <div className="flex flex-col items-start justify-between">
        <span className="w-full flex items-center gap-1 text-muted-foreground">
          <PropertyIcon className="size-4" />
          {propertyName}
        </span>
        <span className="text-lg font-medium">
          {isEditing ?
            editingPropertyValue === "NOT_DEFINED" ?
              <span className="text-muted-foreground">Not defined</span>
            : editingPropertyValue
          : propertyValue === "NOT_DEFINED" ?
            <span className="text-muted-foreground">Not defined</span>
          : propertyValue}
        </span>
      </div>
      {children}
      {isEditing && (
        <Button
          variant={"outline"}
          size={"icon-sm"}
          className="rounded-full z-10"
          onClick={() => {
            pushModal(
              {
                id: modalId,
                content: modalContent,
              },
              true
            );
            show();
          }}
        >
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );
};

export default SubHero;

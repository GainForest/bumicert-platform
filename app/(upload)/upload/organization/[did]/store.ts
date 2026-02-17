import { create } from "zustand";
import { AppGainforestOrganizationInfo, PubLeafletPagesLinearDocument as LinearDocument } from "gainforest-sdk/lex-api";
import { allowedPDSDomains, trpcClient } from "@/config/gainforest-sdk";
import {
  BlobRefGenerator,
  toBlobRefGenerator,
  toFileGenerator,
} from "gainforest-sdk/zod";
import { BlobRef } from "gainforest-sdk/zod";
import { PutRecordResponse } from "gainforest-sdk/types";
import type { RichTextRecord } from "bsky-richtext-react";

const EMPTY_LINEAR_DOCUMENT: LinearDocument.Main = { blocks: [] };

export type HeroEditingData = {
  displayName: string;
  // shortDescription uses RichTextRecord from bsky-richtext-react (text + facets).
  // Note: RichTextRecord.facets uses bsky-richtext-react's Facet type, which is structurally
  // compatible with AppBskyRichtextFacet.Main at runtime but differs in TypeScript types
  // (the SDK type includes an extra `{ $type: string }` union member in features).
  // We use RichTextRecord here because it is what the RichTextEditor onChange produces,
  // and the shapes are wire-compatible with the API's Richtext type.
  shortDescription: RichTextRecord;
  coverImage: File | BlobRef | undefined;
  logoImage: File | BlobRef | undefined;
};

export type SubHeroEditingData = {
  country: string;
  website?: string;
  startDate: string | null;
  visibility: AppGainforestOrganizationInfo.Record["visibility"];
  objectives: AppGainforestOrganizationInfo.Record["objectives"];
};

export type AboutEditingData = {
  longDescription: LinearDocument.Main;
};

export type OrganizationPageStoreState = {
  data: AppGainforestOrganizationInfo.Record | null;
  isEditing: boolean;
  did: string;
  heroEditingData: HeroEditingData;
  subHeroEditingData: SubHeroEditingData;
  aboutEditingData: AboutEditingData;
};

export type OrganizationPageStoreActions = {
  setData: (data: AppGainforestOrganizationInfo.Record) => void;
  setDid: (did: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  setHeroEditingData: (heroEditingData: HeroEditingData) => void;
  setSubHeroEditingData: (subHeroEditingData: SubHeroEditingData) => void;
  setAboutEditingData: (aboutEditingData: AboutEditingData) => void;
  saveAllEditingData: () => Promise<
    PutRecordResponse<AppGainforestOrganizationInfo.Record>
  >;
};

export const useOrganizationPageStore = create<
  OrganizationPageStoreState & OrganizationPageStoreActions
>((set, get) => ({
  data: null,
  isEditing: false,
  did: "",
  heroEditingData: {
    displayName: "",
    shortDescription: { text: "" },
    coverImage: undefined,
    logoImage: undefined,
  },
  subHeroEditingData: {
    country: "",
    website: "",
    startDate: null,
    visibility: "Public",
    objectives: [],
  },
  aboutEditingData: {
    longDescription: EMPTY_LINEAR_DOCUMENT,
  },
  setData: (data) => set({ data }),
  setDid: (did) => set({ did }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setHeroEditingData: (heroEditingData) => set({ heroEditingData }),
  setSubHeroEditingData: (subHeroEditingData) => set({ subHeroEditingData }),
  setAboutEditingData: (aboutEditingData) => set({ aboutEditingData }),
  saveAllEditingData: async () => {
    const { did, heroEditingData, subHeroEditingData, aboutEditingData } =
      get();

    const logoImage = heroEditingData.logoImage;
    const logoImageBlobRef =
      logoImage instanceof BlobRef ? toBlobRefGenerator(logoImage) : undefined;
    const logoImageFileGenerator =
      logoImage instanceof File ? await toFileGenerator(logoImage) : undefined;

    const coverImage = heroEditingData.coverImage;
    const coverImageBlobRef =
      coverImage instanceof BlobRef
        ? toBlobRefGenerator(coverImage)
        : undefined;
    const coverImageFileGenerator =
      coverImage instanceof File
        ? await toFileGenerator(coverImage)
        : undefined;

    const organizationInfo: Parameters<
      typeof trpcClient.gainforest.organization.info.createOrUpdate.mutate
    >[0] = {
      did,
      info: {
        displayName: heroEditingData.displayName,
        logo: logoImageBlobRef,
        coverImage: coverImageBlobRef,
        // The TRPC mutation input accepts shortDescription as a plain string.
        // We pass only the text here; facets are preserved in the editing state
        // but the current API does not have a shortDescriptionFacets input field.
        shortDescription: heroEditingData.shortDescription.text,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        longDescription: aboutEditingData.longDescription as any,
        objectives: subHeroEditingData.objectives.length > 0 ? subHeroEditingData.objectives : ["Other"],
        startDate: subHeroEditingData.startDate && subHeroEditingData.startDate.trim() !== "" ? subHeroEditingData.startDate : undefined,
        country: subHeroEditingData.country,
        visibility: subHeroEditingData.visibility,
        website: subHeroEditingData.website ?? undefined,
      },
      uploads:
        logoImageFileGenerator || coverImageFileGenerator
          ? {
              logo: logoImageFileGenerator,
              coverImage: coverImageFileGenerator,
            }
          : undefined,
      pdsDomain: allowedPDSDomains[0],
    };

    const response =
      await trpcClient.gainforest.organization.info.createOrUpdate.mutate(
        organizationInfo
      );
    set({ data: response.value });

    return response;
  },
}));

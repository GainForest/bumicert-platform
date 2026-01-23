import { create } from "zustand";
import { AppGainforestOrganizationInfo } from "climateai-sdk/lex-api";
import { allowedPDSDomains, trpcClient } from "@/config/climateai-sdk";
import {
  BlobRefGenerator,
  toBlobRefGenerator,
  toFileGenerator,
} from "climateai-sdk/zod";
import { BlobRef } from "climateai-sdk/zod";
import { PutRecordResponse } from "climateai-sdk/types";

export type HeroEditingData = {
  displayName: string;
  shortDescription: string;
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
  longDescription: string;
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
    shortDescription: "",
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
    longDescription: "",
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
        shortDescription: heroEditingData.shortDescription,
        longDescription: aboutEditingData.longDescription,
        objectives: subHeroEditingData.objectives,
        startDate: subHeroEditingData.startDate ?? undefined,
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

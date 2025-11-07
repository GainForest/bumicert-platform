import { create } from "zustand";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";
import { BlobRef } from "@atproto/api";
import { trpcClient } from "@/lib/trpc/client";

export type HeroEditingData = {
  displayName: string;
  shortDescription: string;
  coverImage: File | BlobRef | undefined;
  logoImage: File | BlobRef | undefined;
};

export type SubHeroEditingData = {
  country: string;
  website?: string;
  startDate: string;
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
  saveAllEditingData: () => Promise<{
    success: true;
    data: AppGainforestOrganizationInfo.Record;
  }>;
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
    startDate: "",
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
    let logoImageBlobRef: BlobRef | undefined;
    if (logoImage instanceof File) {
      const response = await trpcClient.common.uploadFileAsBlob.mutate({
        file: logoImage,
      });
      if (response.success !== true) {
        throw new Error("Failed to upload logo image");
      }
      logoImageBlobRef = response.data.blob;
    } else if (logoImage === undefined) {
      logoImageBlobRef = undefined;
    } else {
      logoImageBlobRef = logoImage;
    }

    const coverImage = heroEditingData.coverImage;
    let coverImageBlobRef: BlobRef | undefined;
    if (coverImage instanceof File) {
      const response = await trpcClient.common.uploadFileAsBlob.mutate({
        file: coverImage,
      });
      if (response.success !== true) {
        throw new Error("Failed to upload cover image");
      }
      coverImageBlobRef = response.data.blob;
    } else if (coverImage === undefined) {
      coverImageBlobRef = undefined;
    } else {
      coverImageBlobRef = coverImage;
    }

    const organizationInfo: AppGainforestOrganizationInfo.Record = {
      $type: "app.gainforest.organization.info",
      displayName: heroEditingData.displayName,
      logo: logoImageBlobRef,
      coverImage: coverImageBlobRef,
      shortDescription: heroEditingData.shortDescription,
      longDescription: aboutEditingData.longDescription,
      objectives: subHeroEditingData.objectives,
      startDate: subHeroEditingData.startDate,
      country: subHeroEditingData.country,
      visibility: subHeroEditingData.visibility,
    };

    const response = await trpcClient.organizationInfo.put.mutate({
      did,
      info: organizationInfo,
    });

    if (response.success !== true) {
      throw new Error("Failed to save all editing data");
    }

    set({
      data: organizationInfo,
    });

    return {
      success: true,
      data: organizationInfo,
    };
  },
}));

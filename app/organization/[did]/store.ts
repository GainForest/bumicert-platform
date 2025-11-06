import { create } from "zustand";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";
import { BlobRef } from "@atproto/api";
import { trpcClient } from "@/lib/trpc/client";
import { PutRecordResponse } from "@/server/utils";

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
  isEditing: boolean;
  did: string;
  heroEditingData: HeroEditingData;
  subHeroEditingData: SubHeroEditingData;
  aboutEditingData: AboutEditingData;
};

export type OrganizationPageStoreActions = {
  setDid: (did: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  setHeroEditingData: (heroEditingData: HeroEditingData) => void;
  setSubHeroEditingData: (subHeroEditingData: SubHeroEditingData) => void;
  setAboutEditingData: (aboutEditingData: AboutEditingData) => void;
  saveAllEditingData: () => Promise<PutRecordResponse>;
};

export const useOrganizationPageStore = create<
  OrganizationPageStoreState & OrganizationPageStoreActions
>((set, get) => ({
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

    const response = await trpcClient.organizationInfo.put.mutate({
      did,
      info: {
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
      },
    });

    return response;
  },
}));

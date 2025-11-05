import { create } from "zustand";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";
import { BlobRef } from "@atproto/api";

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
};

export const useOrganizationPageStore = create<
  OrganizationPageStoreState & OrganizationPageStoreActions
>((set) => ({
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
}));

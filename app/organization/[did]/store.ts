import { create } from "zustand";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";
import { trpcClient } from "@/lib/trpc/client";
import { BlobRefJSON } from "@/server/routers/atproto/utils";

export type HeroEditingData = {
  displayName: string;
  shortDescription: string;
  coverImage: File | BlobRefJSON | undefined;
  logoImage: File | BlobRefJSON | undefined;
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
    let logoImageBlobRef: BlobRefJSON | undefined;
    if (logoImage instanceof File) {
      const response = await trpcClient.common.uploadFileAsBlob.mutate({
        name: logoImage.name,
        type: logoImage.type,
        dataBase64: await logoImage
          .arrayBuffer()
          .then((buffer) => Buffer.from(buffer).toString("base64")),
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
    let coverImageBlobRef: BlobRefJSON | undefined;
    if (coverImage instanceof File) {
      const response = await trpcClient.common.uploadFileAsBlob.mutate({
        name: coverImage.name,
        type: coverImage.type,
        dataBase64: await coverImage
          .arrayBuffer()
          .then((buffer) => Buffer.from(buffer).toString("base64")),
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

    const organizationInfo: Parameters<
      typeof trpcClient.organizationInfo.createOrUpdate.mutate
    >[0]["info"] = {
      displayName: heroEditingData.displayName,
      logo: logoImageBlobRef,
      coverImage: coverImageBlobRef,
      shortDescription: heroEditingData.shortDescription,
      longDescription: aboutEditingData.longDescription,
      objectives: subHeroEditingData.objectives,
      startDate: subHeroEditingData.startDate ?? undefined,
      country: subHeroEditingData.country,
      visibility: subHeroEditingData.visibility,
    };

    const response = await trpcClient.organizationInfo.createOrUpdate.mutate({
      did,
      info: organizationInfo,
    });

    set({
      data: response.value,
    });

    return {
      success: true,
      data: response.value,
    };
  },
}));

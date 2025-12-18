import { create } from "zustand";
import { BlobRefGenerator } from "climateai-sdk/zod";

export type SiteData = {
  name: string;
  lat: string;
  lon: string;
  area: string;
  shapefile: BlobRefGenerator | File | string | null;
  rkey: string;
  atUri: string;
};
export type SitesData = {
  allSites: SiteData[];
  defaultSite: string | null;
};

export type SitesStoreState = {
  data: SitesData | null;
  did: string;
  isEditing: boolean;
  editingData: SitesData;
};

export type SitesStoreActions = {
  setData: (data: SitesData) => void;
  setDid: (did: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  setEditingData: (editingData: SitesData) => void;
  setDefaultSite: (defaultSite: string | null) => void;
  saveEditingData: () => Promise<{
    success: true;
    data: SitesData;
  }>;
};

export const useSitesStore = create<SitesStoreState & SitesStoreActions>(
  (set, get) => ({
    data: null,
    isEditing: false,
    did: "",
    editingData: {
      allSites: [],
      defaultSite: null,
    },
    setEditingData: (editingData) => set({ editingData }),
    setDid: (did) => set({ did }),
    setIsEditing: (isEditing) => set({ isEditing }),
    setData: (data) => set({ data }),
    setDefaultSite: (defaultSite) =>
      set({ editingData: { ...get().editingData, defaultSite } }),
    saveEditingData: async () => {
      return {
        success: true,
        data: get().editingData,
      };
    },
  })
);

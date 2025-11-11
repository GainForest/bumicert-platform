import { create } from "zustand";

type Step4StoreState = {
  completionPercentage: number;
  ecocertArtImage: File | null;
};

type Step4StoreActions = {
  setCompletionPercentage: (percentage: number) => void;
  setEcocertArtImage: (image: File | null) => void;
  reset: () => void;
};

export const useStep4Store = create<Step4StoreState & Step4StoreActions>(
  (set) => ({
    completionPercentage: 0,
    ecocertArtImage: null,
    setCompletionPercentage: (percentage) =>
      set({ completionPercentage: percentage }),

    setEcocertArtImage: (image) => set({ ecocertArtImage: image }),

    reset: () =>
      set({
        completionPercentage: 0,
        ecocertArtImage: null,
      }),
  })
);

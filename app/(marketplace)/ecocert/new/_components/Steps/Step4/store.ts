import { create } from "zustand";

type Step4StoreState = {
  completionPercentage: number;
};

type Step4StoreActions = {
  setCompletionPercentage: (percentage: number) => void;
  reset: () => void;
};

export const useStep4Store = create<Step4StoreState & Step4StoreActions>(
  (set) => ({
    completionPercentage: 0,
    setCompletionPercentage: (percentage) =>
      set({ completionPercentage: percentage }),

    reset: () =>
      set({
        completionPercentage: 0,
      }),
  })
);

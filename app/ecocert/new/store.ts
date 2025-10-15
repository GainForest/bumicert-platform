import { create } from "zustand";

export type NewEcocertFormState = {
  currentStep: number;
};

export type NewEcocertFormActions = {
  setCurrentStep: (step: number) => void;
};

const useNewEcocertStore = create<NewEcocertFormState & NewEcocertFormActions>(
  (set) => ({
    currentStep: 0,
    setCurrentStep: (step) => set({ currentStep: step }),
  })
);

export default useNewEcocertStore;

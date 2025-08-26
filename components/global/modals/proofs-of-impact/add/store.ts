import { create } from "zustand";

type AddPoiStore = {
  step1State: {
    ecocertId: string;
    title: string;
    description: string;
  } | null;
  step2State: {
    sources: {
      url: string;
      description: string;
    }[];
  } | null;
};

type AddPoiActions = {
  setStep1State: (step1State: AddPoiStore["step1State"]) => void;
  setStep2State: (step2State: AddPoiStore["step2State"]) => void;
};

const useAddPoiStore = create<AddPoiStore & AddPoiActions>((set) => ({
  step1State: null,
  step2State: null,
  setStep1State: (step1State) => set({ step1State }),
  setStep2State: (step2State) => set({ step2State }),
}));

export default useAddPoiStore;

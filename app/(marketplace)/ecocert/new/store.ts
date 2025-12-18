import { create } from "zustand";

export type NewEcocertFormState = {
  currentStepIndex: number;

  // Form index that is the last step index reached by the user
  maxStepIndexReached: number;
};

export type NewEcocertFormActions = {
  setCurrentStepIndex: (step: number) => void;
};

const useNewEcocertStore = create<NewEcocertFormState & NewEcocertFormActions>(
  (set) => ({
    currentStepIndex: 0,
    maxStepIndexReached: 0,
    setCurrentStepIndex: (step) =>
      set((state) => ({
        currentStepIndex: step,
        maxStepIndexReached: Math.max(state.maxStepIndexReached, step),
      })),
  })
);

export default useNewEcocertStore;

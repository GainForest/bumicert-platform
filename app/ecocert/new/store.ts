import { create } from "zustand";

export type NewEcocertFormState = {
  currentStepIndex: number;

  // Form indexes that should show validation errors in the form
  showValidationErrorsInForm: Set<number>;
};

export type NewEcocertFormActions = {
  setCurrentStepIndex: (step: number) => void;
};

const useNewEcocertStore = create<NewEcocertFormState & NewEcocertFormActions>(
  (set) => ({
    currentStepIndex: 0,
    showValidationErrorsInForm: new Set(),
    setCurrentStepIndex: (step) =>
      set((state) => {
        // If the step changes, start showing validation errors in the previous step
        if (step !== state.currentStepIndex) {
          state.showValidationErrorsInForm.add(state.currentStepIndex);
        }
        return {
          currentStepIndex: step,
        };
      }),
  })
);

export default useNewEcocertStore;

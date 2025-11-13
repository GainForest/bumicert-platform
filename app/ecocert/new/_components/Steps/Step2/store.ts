import z from "zod";
import { create } from "zustand";

export const step2Schema = z.object({
  impactStory: z
    .string()
    .min(50, "At least 50 characters required")
    .max(30000, "No more than 8000 characters allowed")
    .describe("Your Impact Story"),
  shortDescription: z
    .string()
    .min(1, "Required")
    .max(3000, "No more than 3000 characters allowed")
    .describe("Short Description"),
});

type Step2FormValues = z.infer<typeof step2Schema>;

type Step2StoreState = {
  formValues: Step2FormValues;
  errors: Partial<Record<keyof Step2FormValues, string>>;
  isValid: boolean;
  completionPercentage: number;
};

type Step2StoreActions = {
  setImpactStory: (text: string) => void;
  setShortDescription: (text: string) => void;
  updateValidationsAndCompletionPercentage: () => void;
  reset: () => void;
};

export const useStep2Store = create<Step2StoreState & Step2StoreActions>(
  (set, get) => ({
    formValues: {
      impactStory: "",
      shortDescription: "",
    },
    errors: {},
    isValid: false,
    completionPercentage: 0,

    setImpactStory: (text) => {
      set((state) => ({
        formValues: { ...state.formValues, impactStory: text },
      }));
      get().updateValidationsAndCompletionPercentage();
    },

    setShortDescription: (text) => {
      set((state) => ({
        formValues: { ...state.formValues, shortDescription: text },
      }));
      get().updateValidationsAndCompletionPercentage();
    },

    updateValidationsAndCompletionPercentage: () => {
      const formValues = get().formValues;
      try {
        step2Schema.parse(formValues);
        const result = {
          errors: {},
          isValid: true,
          completionPercentage: 100,
        };
        set(result);
        return result;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors: Partial<Record<keyof Step2FormValues, string>> =
            {};
          error.issues.forEach((issue) => {
            if (issue.path[0]) {
              fieldErrors[issue.path[0] as keyof Step2FormValues] =
                issue.message;
            }
          });
          const totalFields = Object.keys(formValues).length;
          const errorCount = Object.keys(fieldErrors).length;
          const percentage = Math.round(
            ((totalFields - errorCount) / totalFields) * 100
          );
          const result = {
            errors: fieldErrors,
            isValid: false,
            completionPercentage: percentage,
          };
          set(result);
          return result;
        }
      }
    },

    reset: () =>
      set({
        formValues: {
          impactStory: "",
          shortDescription: "",
        },
        errors: {},
        isValid: false,
        completionPercentage: 0,
      }),
  })
);

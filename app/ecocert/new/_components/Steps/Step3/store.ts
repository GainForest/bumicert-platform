import z from "zod";
import { create } from "zustand";

export const step3Schema = z.object({
  contributors: z
    .array(z.string().min(1, "All contributors must have a name"))
    .min(1, "Required")
    .describe("List of Contributors"),
  siteBoundaries: z.url("Required").describe("Site Boundaries"),
  confirmPermissions: z
    .boolean()
    .refine((v) => v === true, {
      message: "Required",
    })
    .describe("Permissions"),
  agreeTnc: z
    .boolean()
    .refine((v) => v === true, {
      message: "Required",
    })
    .describe("Terms and Conditions"),
});

type Step3FormValues = z.infer<typeof step3Schema>;

type Step3StoreState = {
  formValues: Step3FormValues;
  errors: Partial<Record<keyof Step3FormValues, string>>;
  isValid: boolean;
  completionPercentage: number;
};

type Step3StoreActions = {
  addContributor: (name: string) => void;
  updateContributor: (index: number, name: string) => void;
  removeContributor: (index: number) => void;
  setSiteBoundaries: (url: string) => void;
  setConfirmPermissions: (v: boolean) => void;
  setAgreeTnc: (v: boolean) => void;
  updateValidationsAndCompletionPercentage: () => void;
  reset: () => void;
};

export const useStep3Store = create<Step3StoreState & Step3StoreActions>(
  (set, get) => ({
    formValues: {
      contributors: [],
      siteBoundaries: "",
      confirmPermissions: false,
      agreeTnc: false,
    },
    errors: {},
    isValid: false,
    completionPercentage: 0,

    addContributor: (name) => {
      set((state) => ({
        formValues: {
          ...state.formValues,
          contributors: [...state.formValues.contributors, name],
        },
      }));
      get().updateValidationsAndCompletionPercentage();
    },
    updateContributor: (index, name) => {
      set((state) => ({
        formValues: {
          ...state.formValues,
          contributors: state.formValues.contributors.map((item, i) =>
            i === index ? name : (item as string)
          ),
        },
      }));
      get().updateValidationsAndCompletionPercentage();
    },
    removeContributor: (index) => {
      set((state) => ({
        formValues: {
          ...state.formValues,
          contributors: state.formValues.contributors.filter(
            (_, i) => i !== index
          ),
        },
      }));
      get().updateValidationsAndCompletionPercentage();
    },
    setSiteBoundaries: (url: string) => {
      set((state) => ({
        formValues: { ...state.formValues, siteBoundaries: url },
      }));
      get().updateValidationsAndCompletionPercentage();
    },
    setConfirmPermissions: (v) => {
      set((state) => ({
        formValues: { ...state.formValues, confirmPermissions: v },
      }));
      get().updateValidationsAndCompletionPercentage();
    },
    setAgreeTnc: (v) => {
      set((state) => ({
        formValues: { ...state.formValues, agreeTnc: v },
      }));
      get().updateValidationsAndCompletionPercentage();
    },
    updateValidationsAndCompletionPercentage: () => {
      const formValues = get().formValues;
      try {
        step3Schema.parse(formValues);
        const result = {
          errors: {},
          isValid: true,
          completionPercentage: 100,
        };
        set(result);
        return result;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors: Partial<Record<keyof Step3FormValues, string>> =
            {};
          error.issues.forEach((issue) => {
            if (issue.path[0]) {
              fieldErrors[issue.path[0] as keyof Step3FormValues] =
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
          contributors: [],
          siteBoundaries: "",
          confirmPermissions: false,
          agreeTnc: false,
        },
        errors: {},
        isValid: false,
        completionPercentage: 0,
      }),
  })
);

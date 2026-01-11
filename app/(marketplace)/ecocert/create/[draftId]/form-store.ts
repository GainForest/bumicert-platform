import z from "zod";
import { create } from "zustand";

export const step1Schema = z.object({
  projectName: z
    .string()
    .min(1, "Required")
    .max(50, "No more than 50 characters allowed")
    .describe("Project Name"),
  coverImage: z.union([z.instanceof(File), z.null()]).describe("Cover Image"),
  workType: z.array(z.string()).min(1, "Required").describe("Work Type"),
  projectDateRange: z
    .tuple([z.date(), z.date()])
    .describe("Project Date Range"),
});
export type Step1FormValues = z.infer<typeof step1Schema>;
const thisYear = new Date().getFullYear();
export const step1InitialValues: Step1FormValues = {
  projectName: "",
  coverImage: null,
  workType: [],
  projectDateRange: [new Date(`${thisYear}-01-01`), new Date()],
};

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
export type Step2FormValues = z.infer<typeof step2Schema>;
export const step2InitialValues: Step2FormValues = {
  impactStory: "",
  shortDescription: "",
};

export const step3Schema = z.object({
  contributors: z
    .array(z.string().min(1, "All contributors must have a name"))
    .min(1, "Required")
    .describe("List of Contributors"),
  siteBoundaries: z
    .array(
      z.object({
        cid: z.string(),
        uri: z.string(),
      })
    )
    .min(1, "Required")
    .describe("Site Boundaries"),
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
export type Step3FormValues = z.infer<typeof step3Schema>;
export const step3InitialValues: Step3FormValues = {
  contributors: [],
  siteBoundaries: [],
  confirmPermissions: false,
  agreeTnc: false,
};

const schemas = [step1Schema, step2Schema, step3Schema];

type FormStoreState = {
  isHydrated: boolean;
  formValues: [Step1FormValues, Step2FormValues, Step3FormValues];
  formErrors: [
    Partial<Record<keyof Step1FormValues, string>>,
    Partial<Record<keyof Step2FormValues, string>>,
    Partial<Record<keyof Step3FormValues, string>>
  ];
  formCompletionPercentages: [number, number, number];
};

type FormStoreActions = {
  hydrate: (
    formValues: [Step1FormValues, Step2FormValues, Step3FormValues] | null
  ) => void;
  setFormValue: [
    (
      key: keyof Step1FormValues,
      value: Step1FormValues[keyof Step1FormValues]
    ) => void,
    (
      key: keyof Step2FormValues,
      value: Step2FormValues[keyof Step2FormValues]
    ) => void,
    (
      key: keyof Step3FormValues,
      value: Step3FormValues[keyof Step3FormValues]
    ) => void
  ];
  updateErrorsAndCompletion: (formIndex?: number) => void;
  reset: (isHydrated?: boolean) => void;
};

const initialState: FormStoreState = {
  isHydrated: false,
  formValues: [step1InitialValues, step2InitialValues, step3InitialValues],
  formErrors: [{}, {}, {}],
  formCompletionPercentages: [0, 0, 0],
};

export const useFormStore = create<FormStoreState & FormStoreActions>(
  (set, get) => {
    const setForm1Value: FormStoreActions["setFormValue"][0] = (key, value) => {
      set((state) => ({
        formValues: {
          ...state.formValues,
          0: { ...state.formValues[0], [key]: value },
        },
      }));
      get().updateErrorsAndCompletion();
    };
    const setForm2Value: FormStoreActions["setFormValue"][1] = (key, value) => {
      set((state) => ({
        formValues: {
          ...state.formValues,
          1: { ...state.formValues[1], [key]: value },
        },
      }));
      get().updateErrorsAndCompletion();
    };
    const setForm3Value: FormStoreActions["setFormValue"][2] = (key, value) => {
      set((state) => ({
        formValues: {
          ...state.formValues,
          2: { ...state.formValues[2], [key]: value },
        },
      }));
      get().updateErrorsAndCompletion();
    };

    const getFormErrorsAndCompletion = (formIndex: number) => {
      const schema = schemas[formIndex];
      const formValues = get().formValues[formIndex];
      try {
        schema.parse(formValues);
        const result = {
          errors: {},
          completionPercentage: 100,
        };
        return result;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors: Partial<Record<keyof Step1FormValues, string>> =
            {};
          error.issues.forEach((err: z.ZodIssue) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as keyof Step1FormValues] = err.message;
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
          return result;
        }
      }
    };

    return {
      ...initialState,
      hydrate: (formValues) => {
        if (!formValues) {
          set({ ...initialState, isHydrated: true });
          return;
        }
        set({ ...initialState, isHydrated: true, formValues });
      },
      setFormValue: [setForm1Value, setForm2Value, setForm3Value],
      updateErrorsAndCompletion: (formIndex) => {
        if (formIndex) {
          const errorsAndCompletion = getFormErrorsAndCompletion(formIndex);
          if (!errorsAndCompletion) return;
          set((state) => ({
            formErrors: {
              ...state.formErrors,
              [formIndex]: errorsAndCompletion.errors,
            },
            formCompletionPercentages: {
              ...state.formCompletionPercentages,
              [formIndex]: errorsAndCompletion.completionPercentage,
            },
          }));
        } else {
          const step1ErrorsAndCompletion = getFormErrorsAndCompletion(0);
          const step2ErrorsAndCompletion = getFormErrorsAndCompletion(1);
          const step3ErrorsAndCompletion = getFormErrorsAndCompletion(2);

          const step1Errors = step1ErrorsAndCompletion
            ? step1ErrorsAndCompletion.errors
            : get().formErrors[0];
          const step2Errors = step2ErrorsAndCompletion
            ? step2ErrorsAndCompletion.errors
            : get().formErrors[1];
          const step3Errors = step3ErrorsAndCompletion
            ? step3ErrorsAndCompletion.errors
            : get().formErrors[2];

          const step1CompletionPercentage = step1ErrorsAndCompletion
            ? step1ErrorsAndCompletion.completionPercentage
            : get().formCompletionPercentages[0];
          const step2CompletionPercentage = step2ErrorsAndCompletion
            ? step2ErrorsAndCompletion.completionPercentage
            : get().formCompletionPercentages[1];
          const step3CompletionPercentage = step3ErrorsAndCompletion
            ? step3ErrorsAndCompletion.completionPercentage
            : get().formCompletionPercentages[2];

          set({
            formErrors: [step1Errors, step2Errors, step3Errors],
            formCompletionPercentages: [
              step1CompletionPercentage,
              step2CompletionPercentage,
              step3CompletionPercentage,
            ],
          });
        }
      },
      reset: (isHydrated) => {
        set({
          ...initialState,
          isHydrated: isHydrated === undefined ? get().isHydrated : isHydrated,
        });
      },
    };
  }
);

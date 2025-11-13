import z from "zod";
import { create } from "zustand";

export const step1Schema = z.object({
  projectName: z
    .string()
    .min(1, "Required")
    .max(50, "No more than 50 characters allowed")
    .describe("Project Name"),
  websiteOrSocialLink: z
    .string()
    .min(1, "Required")
    .max(2048, "No more than 2048 characters allowed")
    .describe("Website or Social Link"),
  coverImage: z
    .instanceof(File)
    .nullable()
    .refine((v) => v !== null, { message: "Required" })
    .describe("Cover Image"),
  workType: z.array(z.string()).min(1, "Required").describe("Work Type"),
  projectDateRange: z
    .tuple([z.date(), z.date().nullable()])
    .describe("Project Date Range"),
  isProjectOngoing: z.boolean().describe("Is Project Ongoing"),
});

type Step1FormValues = z.infer<typeof step1Schema>;

type Step1StoreState = {
  formValues: Step1FormValues;
  errors: Partial<Record<keyof Step1FormValues, string>>;
  isValid: boolean;
  completionPercentage: number;
};

type Step1StoreActions = {
  setProjectName: (name: string) => void;
  setWebsiteOrSocialLink: (link: string) => void;
  setCoverImage: (image: File | null) => void;
  setWorkType: (types: Step1FormValues["workType"]) => void;
  setProjectDateRange: (range: [Date, Date | null]) => void;
  setIsProjectOngoing: (ongoing: boolean) => void;
  updateValidationsAndCompletionPercentage: () => void;
  reset: () => void;
};

export const useStep1Store = create<Step1StoreState & Step1StoreActions>(
  (set, get) => ({
    // Initial state
    formValues: {
      projectName: "",
      websiteOrSocialLink: "",
      coverImage: null,
      workType: [],
      projectDateRange: [new Date(`${new Date().getFullYear()}-01-01`), null],
      isProjectOngoing: true,
    },
    errors: {},
    isValid: false,
    completionPercentage: 0,

    // Actions
    setProjectName: (name) => {
      set((state) => ({
        formValues: { ...state.formValues, projectName: name },
      }));
      get().updateValidationsAndCompletionPercentage();
    },
    setWebsiteOrSocialLink: (link) => {
      set((state) => ({
        formValues: { ...state.formValues, websiteOrSocialLink: link },
      }));
      get().updateValidationsAndCompletionPercentage();
    },
    setCoverImage: (image) => {
      set((state) => ({
        formValues: { ...state.formValues, coverImage: image },
      }));
      get().updateValidationsAndCompletionPercentage();
    },
    setWorkType: (types) => {
      set((state) => ({
        formValues: { ...state.formValues, workType: types },
      }));
      get().updateValidationsAndCompletionPercentage();
    },
    setProjectDateRange: (range) => {
      set((state) => {
        return {
          formValues: { ...state.formValues, projectDateRange: range },
        };
      });
      get().updateValidationsAndCompletionPercentage();
    },
    setIsProjectOngoing: (ongoing) => {
      set((state) => ({
        formValues: { ...state.formValues, isProjectOngoing: ongoing },
      }));
      get().updateValidationsAndCompletionPercentage();
    },

    updateValidationsAndCompletionPercentage: () => {
      const formValues = get().formValues;
      try {
        step1Schema.parse(formValues);
        const result = {
          errors: {},
          isValid: true,
          completionPercentage: 100,
        };
        set(result);
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
          set(result);
          return result;
        }
      }
    },

    reset: () =>
      set({
        formValues: {
          projectName: "",
          websiteOrSocialLink: "",
          coverImage: null,
          workType: [],
          projectDateRange: [
            new Date(`${new Date().getFullYear()}-01-01`),
            null,
          ],
          isProjectOngoing: true,
        },
        errors: {},
        isValid: false,
        completionPercentage: 0,
      }),
  })
);

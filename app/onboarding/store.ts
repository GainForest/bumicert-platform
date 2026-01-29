import { create } from "zustand";

export type OnboardingStep =
  | "intro"
  | "email"
  | "org-details"
  | "credentials"
  | "complete";

export const ONBOARDING_STEPS: OnboardingStep[] = [
  "intro",
  "email",
  "org-details",
  "credentials",
  "complete",
];

export type OnboardingData = {
  // Step 1: Intro
  organizationName: string;
  acceptedCodeOfConduct: boolean;

  // Step 2: Email
  email: string;
  inviteCode: string;

  // Step 3: Org Details
  country: string;
  startDate: string | null;
  longDescription: string;
  shortDescription: string;
  website: string;

  // Step 4: Credentials
  handle: string;
  password: string;
  confirmPassword: string;

  // Step 5: Complete
  did: string;
  accountCreated: boolean;
  organizationInitialized: boolean;
};

export type OnboardingState = {
  currentStep: OnboardingStep;
  data: OnboardingData;
  isLoading: boolean;
  error: string | null;
};

export type OnboardingActions = {
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

const initialData: OnboardingData = {
  organizationName: "",
  acceptedCodeOfConduct: false,
  email: "",
  inviteCode: "",
  country: "",
  startDate: null,
  longDescription: "",
  shortDescription: "",
  website: "",
  handle: "",
  password: "",
  confirmPassword: "",
  did: "",
  accountCreated: false,
  organizationInitialized: false,
};

const initialState: OnboardingState = {
  currentStep: "intro",
  data: initialData,
  isLoading: false,
  error: null,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>(
  (set, get) => ({
    ...initialState,

    setStep: (step) => set({ currentStep: step }),

    nextStep: () => {
      const { currentStep } = get();
      const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
      if (currentIndex < ONBOARDING_STEPS.length - 1) {
        set({ currentStep: ONBOARDING_STEPS[currentIndex + 1], error: null });
      }
    },

    prevStep: () => {
      const { currentStep } = get();
      const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
      if (currentIndex > 0) {
        set({ currentStep: ONBOARDING_STEPS[currentIndex - 1], error: null });
      }
    },

    updateData: (data) =>
      set((state) => ({
        data: { ...state.data, ...data },
      })),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    reset: () => set(initialState),
  })
);

// Helper function to generate a handle from org name, country, and date
export function generateHandle(
  orgName: string,
  countryCode: string,
  startDate: string | null
): string {
  // Normalize the organization name
  let handle = orgName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

  // Add country code if available
  if (countryCode) {
    handle = `${handle}-${countryCode.toLowerCase()}`;
  }

  // Add year if start date is available
  if (startDate) {
    const year = new Date(startDate).getFullYear();
    if (!isNaN(year)) {
      handle = `${handle}-${year}`;
    }
  }

  // Ensure handle is not too long (max 30 chars before domain)
  if (handle.length > 30) {
    handle = handle.substring(0, 30).replace(/-$/, "");
  }

  return handle;
}

// Helper function to calculate password strength
export type PasswordStrength = "weak" | "fair" | "good" | "strong";

export function calculatePasswordStrength(password: string): {
  strength: PasswordStrength;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length === 0) {
    return { strength: "weak", score: 0, feedback: ["Enter a password"] };
  }

  // Length checks
  if (password.length >= 8) score += 1;
  else feedback.push("At least 8 characters");

  if (password.length >= 12) score += 1;

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Add lowercase letters");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Add uppercase letters");

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("Add numbers");

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push("Add special characters");

  // Common patterns to avoid
  if (
    /^[a-zA-Z]+$/.test(password) ||
    /^[0-9]+$/.test(password) ||
    /(.)\1{2,}/.test(password)
  ) {
    score = Math.max(0, score - 1);
    feedback.push("Avoid common patterns");
  }

  let strength: PasswordStrength;
  if (score <= 2) strength = "weak";
  else if (score <= 3) strength = "fair";
  else if (score <= 5) strength = "good";
  else strength = "strong";

  return { strength, score, feedback };
}

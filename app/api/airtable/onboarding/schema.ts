import z from "zod";

export const onboardingDataSchema = z.object({
  email: z.email("Please enter a valid email address").optional(),
  organizationName: z.string().optional(),
  about: z.string().optional(),
});

export type OnboardingData = z.infer<typeof onboardingDataSchema>;

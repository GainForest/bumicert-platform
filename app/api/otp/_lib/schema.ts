import z from "zod";

export const OTP_PURPOSES = [
  "email_verification",
  "login",
  "action_confirmation",
] as const;

export type OtpPurpose = (typeof OTP_PURPOSES)[number];

export const requestOtpSchema = z.object({
  email: z
    .string("Email must be a string")
    .email("Invalid email format")
    .transform((e) => e.toLowerCase().trim()),
  purpose: z.enum(OTP_PURPOSES, {
    error: "Invalid purpose",
  }),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const verifyOtpSchema = z.object({
  email: z
    .string("Email must be a string")
    .email("Invalid email format")
    .transform((e) => e.toLowerCase().trim()),
  code: z
    .string("Code must be a string")
    .length(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must be numeric"),
  purpose: z.enum(OTP_PURPOSES, {
    error: "Invalid purpose",
  }),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "noreply@bumicert.com";
const FROM_NAME = "bumicert";

interface SendOtpEmailParams {
  to: string;
  code: string;
  purpose: "email_verification" | "login" | "action_confirmation";
  expiryMinutes: number;
}

const PURPOSE_SUBJECTS: Record<string, string> = {
  email_verification: "Verify your email address",
  login: "Your login code",
  action_confirmation: "Confirm your action",
};

const PURPOSE_INTROS: Record<string, string> = {
  email_verification: "Use this code to verify your email address:",
  login: "Use this code to log in to your account:",
  action_confirmation: "Use this code to confirm your action:",
};

export async function sendOtpEmail({
  to,
  code,
  purpose,
  expiryMinutes,
}: SendOtpEmailParams): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.error("[OTP Email] RESEND_API_KEY not configured");
    return { success: false, error: "Email service not configured" };
  }

  const subject = PURPOSE_SUBJECTS[purpose] || "Your verification code";
  const intro = PURPOSE_INTROS[purpose] || "Your verification code is:";

  const textContent = `${intro}

${code}

This code expires in ${expiryMinutes} minutes.

If you didn't request this code, please ignore this email.

- The bumicert Team`;

  try {
    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject: `[bumicert] ${subject}`,
      text: textContent,
    });

    if (error) {
      console.error("[OTP Email] Failed to send:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[OTP Email] Unexpected error:", err);
    return { success: false, error: "Failed to send email" };
  }
}

import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY env var");
}

export const resend = new Resend(resendApiKey);

export const getInviteEmailConfig = () => {
  const from = process.env.RESEND_INVITE_FROM;
  const subject = "Welcome to GainForest - Your Invite Code";

  if (!from) {
    throw new Error("Missing RESEND_INVITE_FROM env var");
  }

  return { from, subject };
};

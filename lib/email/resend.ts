import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY env var");
}

export const resend = new Resend(resendApiKey);

export const getInviteEmailConfig = () => {
  const from = process.env.RESEND_INVITE_FROM;
  const subject = process.env.RESEND_INVITE_SUBJECT;

  if (!from || !subject) {
    throw new Error("Missing RESEND_INVITE_FROM / RESEND_INVITE_SUBJECT env vars");
  }

  return { from, subject };
};

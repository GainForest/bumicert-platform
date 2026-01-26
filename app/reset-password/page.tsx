import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

export const metadata = {
  title: "Reset Password | bumicert",
  description: "Set a new password for your account",
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      }
    >
      <ResetPasswordPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ResetPasswordPageContent({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token;

  // Allow manual code entry even without a token in URL
  return <ResetPasswordForm initialToken={token} />;
}

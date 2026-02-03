import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started - Create Your Organization",
  description:
    "Join Bumicerts and create your organization profile. Start funding impactful regenerative projects and contribute to climate action.",
  openGraph: {
    title: "Get Started with Bumicerts",
    description:
      "Create your organization profile and start funding impactful regenerative projects.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen w-full bg-background"
      role="main"
      aria-label="Onboarding"
    >
      {children}
    </main>
  );
}

import React from "react";
import AuthWrapper from "./[draftId]/_components/AuthWrapper";
import {
  ArrowRight,
  CircleCheck,
  Clock,
  HelpCircle,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BumicertArt } from "./[draftId]/_components/Steps/Step4/BumicertPreviewCard";
import { getStripedBackground } from "@/lib/getStripedBackground";
import Link from "next/link";
import { links } from "@/lib/links";
import HeaderContent from "./_components/HeaderContent";

// Mock drafts data - replace with actual data fetching
const mockDrafts: {
  id: string;
  title: string;
  updatedAt: string;
  progress: number;
}[] = [];

const CreateBumicertPage = () => {
  return (
    <AuthWrapper>
      <HeaderContent />
      <div className="w-full flex items-start gap-6">
        <div className="flex-1 flex flex-col gap-4">
          {/* Create New Section */}
          <section className="flex flex-col p-4 rounded-xl gap-1 bg-background border border-border shadow-xl">
            <h1 className="text-2xl font-bold font-serif text-muted-foreground">
              Start a new application
            </h1>
            <p>
              Start a new application to create a bumicert for the organization,
              and showcase your commitment to sustainability.
            </p>
            <div className="flex items-center justify-end mt-3">
              <Link href={links.bumicert.createWithDraftId("0")}>
                <Button>
                  Get Started
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          </section>

          {/* Drafts Section */}
          <section className="flex flex-col rounded-xl gap-2">
            <h1 className="text-2xl font-bold font-serif text-muted-foreground">
              Pick up where you left off
            </h1>

            {mockDrafts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {mockDrafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <h3 className="font-medium">{draft.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      Last edited {draft.updatedAt}
                    </p>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{draft.progress}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${draft.progress}%` }}
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 gap-2">
                      Continue
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-border/50"
                style={{
                  background: getStripedBackground(
                    {
                      variable: "--muted",
                      opacity: 0,
                    },
                    {
                      variable: "--muted",
                      opacity: 50,
                    }
                  ),
                }}
              >
                <Inbox className="size-10 text-muted-foreground opacity-50" />
                <span className="mt-3 text-xl font-serif font-bold text-muted-foreground">
                  No incomplete applications found.
                </span>
              </div>
            )}
          </section>
        </div>
        <div className="w-68 rounded-xl border border-border overflow-hidden">
          <div
            style={{
              background: getStripedBackground(
                {
                  variable: "--primary",
                  opacity: 0,
                },
                {
                  variable: "--primary",
                  opacity: 10,
                }
              ),
            }}
            className="flex items-center justify-center h-32 rounded-lg"
          >
            <HelpCircle className="text-primary size-16 opacity-80" />
          </div>
          <div className="px-4 py-3">
            <h1 className="text-2xl font-bold font-serif">
              What is a Bumicert?
            </h1>
            <p className="mt-2 text-muted-foreground">
              A Bumicert is a certificate that records the creation of a
              specific environmental action by a community, giving it a
              permanent digital identity.
            </p>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default CreateBumicertPage;

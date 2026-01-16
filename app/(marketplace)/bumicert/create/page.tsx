import React from "react";
import AuthWrapper from "./[draftId]/_components/AuthWrapper";
import {
  ArrowRight,
  ChartPieIcon,
  CircleCheck,
  Clock,
  HelpCircle,
  Inbox,
  Leaf,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BumicertArt } from "./[draftId]/_components/Steps/Step4/BumicertPreviewCard";
import { getStripedBackground } from "@/lib/getStripedBackground";
import Link from "next/link";
import { links } from "@/lib/links";
import HeaderContent from "./_components/HeaderContent";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CircularProgressBar from "@/components/circular-progressbar";
import TimeText from "@/components/time-text";
import MyBumicerts from "./_components/MyBumicerts";

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
      <div className="w-full flex items-start gap-6 mt-4">
        <div className="flex-1 flex flex-col gap-4">
          {/* Create New Section */}
          <section className="rounded-xl gap-1 border border-border shadow-xl relative overflow-hidden">
            <Image
              src="/assets/media/images/jeremy-bishop-vGjGvtSfys4-unsplash.jpg"
              alt="Create Bumicert"
              fill
              className="object-cover object-[50%_40%]"
            />
            <div className="relative inset-0 flex flex-col p-4 gap-2 bg-linear-to-b from-black/60 via-black/20 to-black/0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Leaf className="size-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold font-serif text-white">
                  Start a new application
                </h1>
              </div>
              <p className="text-gray-200">
                Start a new application to create a bumicert for the
                organization, and showcase your commitment to sustainability.
              </p>
              <div className="flex items-center justify-end mt-20">
                <Link href={links.bumicert.createWithDraftId("0")}>
                  <Button>
                    Get Started
                    <ArrowRight />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* My Bumicerts Section */}
          <MyBumicerts />
        </div>
        <div className="w-68">
          <Accordion type="multiple" defaultValue={["item-2"]}>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <HelpCircle className="size-4 opacity-50" />
                  What is a Bumicert?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                A Bumicert is a certificate that records the creation of a
                specific environmental action by a community, giving it a
                permanent digital identity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <ChartPieIcon className="size-4 opacity-50" />
                  Pending Applications
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {mockDrafts.length <= 0 ? (
                  <div className="bg-muted/50 rounded-xl p-4 text-muted-foreground flex flex-col items-center justify-center text-center">
                    <PartyPopper className="size-8 opacity-50" />
                    <span className="text-center text-pretty mt-2">
                      You do not have any pending applications.
                    </span>
                  </div>
                ) : (
                  <div className="w-full flex flex-col gap-1">
                    {mockDrafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="w-full flex items-center p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <CircularProgressBar value={draft.progress} size={34} />
                        <div className="flex flex-col flex-1 ml-2">
                          <h3 className="font-medium">{draft.title}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <TimeText date={new Date(draft.updatedAt)} />
                          </p>
                        </div>
                        <Link href={links.bumicert.createWithDraftId(draft.id)}>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            className="gap-2 rounded-full"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default CreateBumicertPage;

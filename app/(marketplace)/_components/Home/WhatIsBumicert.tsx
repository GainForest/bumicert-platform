import { BumicertArt } from "@/app/(marketplace)/bumicert/create/[draftId]/_components/Steps/Step4/BumicertPreviewCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

const WhatIsBumicert = () => {
  return (
    <div className="mt-10">
      <h2 className="text-muted-foreground text-center text-pretty font-serif font-bold text-3xl mb-4">
        What is a Bumicert?
      </h2>
      <div className="grid grid-cols-1 min-[60rem]:grid-cols-2 gap-4 rounded-3xl bg-foreground/2">
        <div className="h-full w-full flex items-center justify-center bg-foreground/2 p-4 rounded-3xl">
          <BumicertArt
            logoUrl={"/assets/media/images/logo.svg"}
            coverImage={"/assets/media/images/hero-bumicert-card/image0.png"}
            title={"An Awesome Bumicert"}
            objectives={[
              "Community Resilience",
              "Biodiversity Monitoring",
              "Environmental Education",
            ]}
            startDate={new Date("2025-01-01")}
            endDate={new Date("2025-12-31")}
          />
        </div>
        <div className="p-4 rounded-3xl">
          <Accordion type="single" defaultValue="item-1" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-serif font-bold text-lg">
                A digital certificate
              </AccordionTrigger>
              <AccordionContent>
                A bumicert is a certificate that records the creation of a
                specific environmental action by a community, giving it a
                permanent digital identity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-serif font-bold text-lg">
                Verified Evidence of Environmental Impact
              </AccordionTrigger>
              <AccordionContent>
                It serves as a provable record backed by photos, videos,
                geolocation data, and monitoring tools, allowing anyone to
                verify that the environmental work truly happened.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="font-serif font-bold text-lg">
                A Funding Bridge Between Donors and Stewards
              </AccordionTrigger>
              <AccordionContent>
                A bumicert creates a direct pathway for supporters to fund
                on-ground work, ensuring contributions reach the exact people
                and locations responsible for the impact.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="font-serif font-bold text-lg">
                A Time-Stamped Contribution to Global Restoration
              </AccordionTrigger>
              <AccordionContent>
                Each Bumicert stores when a restoration activity
                occurred—capturing the moment in time when land was protected,
                trees were planted, or ecosystems were revived.{" "}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="font-serif font-bold text-lg">
                A Unique Claim to Environmental Stewardship
              </AccordionTrigger>
              <AccordionContent>
                Buyers can claim ownership of the ecological impact represented
                by the Bumicert, allowing them to show their personal or
                organizational commitment to regeneration.{" "}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default WhatIsBumicert;

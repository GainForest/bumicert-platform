"use client";
import React from "react";
import { useStep1Store } from "../Step1/store";

import Image from "next/image";
import EcocertImage from "./image.png";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const Ecocert = () => {
  const name = useStep1Store((state) => state.formValues.projectName);

  return (
    <div className="p-2 rounded-3xl shadow-2xl bg-white border border-black/10">
      <div className="w-[256px] h-[360px] relative overflow-hidden rounded-2xl">
        <Image src={EcocertImage} alt="Ecocert" fill className="rounded-2xl" />
        <ProgressiveBlur
          position="bottom"
          height="35%"
          className="z-0"
          borderRadiusClassName="rounded-2xl"
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-transparent to-white/50"></div>
        <div className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white border-2 border-black/10 shadow-lg">
          <Image
            src={"/assets/media/images/logo.svg"}
            alt="Logo"
            fill
            className="rounded-full"
          />
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex flex-col">
          <span className="text-xs border border-white/15 bg-black/15 text-white backdrop-blur-lg rounded-full px-2 py-1 w-fit">
            Aug 9, 2024 → Oct 9, 2024
          </span>
          <span className="font-serif text-white text-shadow-lg text-3xl mt-2">
            {name ?? "Hypercert Title"}
          </span>
          <div className="flex items-center gap-1 flex-wrap mt-2">
            {["Tree Planting", "Education", "Biodiversity Conservation"].map(
              (objective) => (
                <span
                  key={objective}
                  className="text-xs bg-white/40 text-black backdrop-blur-lg rounded-md px-3 py-1.5 w-fit font-medium text-shadow-lg shadow-lg"
                >
                  {objective}
                </span>
              )
            )}
            <span className="text-xs bg-black/40 text-white backdrop-blur-lg rounded-md px-2 py-1.5 w-fit font-medium text-shadow-lg shadow-lg">
              +3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EcocertPreviewCard = () => {
  return (
    <div className="rounded-xl border border-primary/10 shadow-lg overflow-hidden bg-primary/10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center text-center text-primary px-2 py-1">
        <span className="font-medium">Preview your ecocert</span>
      </div>
      <div className="bg-background p-2 rounded-xl flex-1 flex flex-col items-center justify-center">
        <Ecocert />
      </div>
    </div>
  );
};

export default EcocertPreviewCard;

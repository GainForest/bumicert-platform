"use client";
import Image from "next/image";
import React from "react";
import BiokoNeutralImage from "@/app/(marketplace)/ecocert/new/_assets/bioko-neutral.png";
import BiokoHoldingLoudspeakerImage from "@/app/(marketplace)/ecocert/new/_assets/bioko-holding-loudspeaker.png";
import BiokoHoldingEarthImage from "@/app/(marketplace)/ecocert/new/_assets/bioko-holding-earth.png";
import BiokoHoldingMagnifierImage from "@/app/(marketplace)/ecocert/new/_assets/bioko-holding-magnifier.png";
import BiokoHoldingConfettiImage from "@/app/(marketplace)/ecocert/new/_assets/bioko-holding-confetti.png";
import { getStripedBackground } from "@/lib/getStripedBackground";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import useNewEcocertStore from "../store";

const stepImages = [
  {
    image: BiokoNeutralImage,
    alt: "Bioko Neutral",
    tips: [
      "Use a short and descriptive name for your project.",
      "Include a website or social link to your project for easy access.",
    ],
  },
  {
    image: BiokoHoldingLoudspeakerImage,
    alt: "Bioko Holding Loudspeaker",
    tips: [
      "Tell your story in your own words. Explain what the problem was and what you did to solve it.",
      "Share who was involved, such as your group, partners, or local community.",
      "Describe how your work is helping and what has changed because of it.",
      "Write freely. Longer stories are welcome.",
    ],
  },
  {
    image: BiokoHoldingEarthImage,
    alt: "Bioko Holding Earth",
    tips: [
      "Add your own community or organization first, then other people or groups who joined.",
      "Make sure everyone agrees to be included.",
      "Upload your site boundary in GeoJSON format so it shows on the map.",
    ],
  },
  {
    image: BiokoHoldingMagnifierImage,
    alt: "Bioko Holding Magnifier",
    tips: [
      "Make sure you have completed all the previous steps.",
      "Review the look of your ecocert before submitting.",
    ],
  },
  {
    image: BiokoHoldingConfettiImage,
    alt: "Bioko Holding Confetti",
    tips: ["You have completed all the steps! No more tips for this section."],
  },
];

const StepCard = () => {
  const { currentStepIndex: currentStep } = useNewEcocertStore();
  return (
    <div className="w-full rounded-xl border border-border shadow-lg mt-24">
      <div
        className="w-full h-32 relative z-10"
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
      >
        <AnimatePresence>
          <motion.div
            className="absolute w-full bottom-1 flex items-center justify-center"
            initial={{ opacity: 0, y: 100, filter: "blur(10px)", scale: 0.5 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, y: 100, filter: "blur(10px)", scale: 0.5 }}
            transition={{
              duration: 0.3,
            }}
            key={currentStep}
          >
            <Image
              className="h-56 w-auto drop-shadow-lg"
              src={stepImages[currentStep].image}
              alt={stepImages[currentStep].alt}
            />
          </motion.div>
        </AnimatePresence>

        {/* <div className="absolute bottom-0 left-0 right-0 h-8 bg-white"></div> */}
      </div>
      <div
        className="rounded-md"
        style={{
          boxShadow: "0 -10px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="p-4 pb-0 -mt-6 bg-background z-15 relative rounded-md font-medium">
          {currentStep === 0 && (
            <>
              <p className="text-muted-foreground">
                Hello! I am Bioko. I&apos;ll guide you through the creation of
                your ecocert.
              </p>
              <hr className="my-2" />
            </>
          )}

          <span className="flex items-center gap-1">
            <Lightbulb className="size-4" />
            Tips for this section
          </span>
          <ul className="list-disc list-inside text-sm -indent-5 pl-5 mt-2">
            {stepImages[currentStep].tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default StepCard;

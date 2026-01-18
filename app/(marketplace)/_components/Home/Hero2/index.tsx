"use client";
import Image from "next/image";
import BackgroundImage from "./assets/background.png";
import PlantersImage from "./assets/planters.png";
import ApproachersImage from "./assets/approachers.png";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, InfoIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useNavbarContext } from "@/components/global/Navbar/context";

const Hero2 = () => {
  const [shouldDisplayLearnMoreContent, setShouldDisplayLearnMoreContent] =
    useState(false);
  const [bumicertainBrandingDelayOffset, setBumicertBrandingDelayOffset] =
    useState(1.6);

  return (
    <div className="w-full rounded-3xl mt-4">
      <div className="w-full h-80 rounded-3xl overflow-hidden relative">
        <motion.img
          initial={{ filter: "brightness(0.5)" }}
          animate={{ filter: "brightness(1)" }}
          src={BackgroundImage.src}
          alt="Background"
          className="absolute inset-0 object-cover object-bottom h-full w-full"
        />
        <motion.img
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          src={ApproachersImage.src}
          alt="Approachers"
          className="absolute bottom-2 left-4 h-28 xs:h-32 sm:h-40 md:h-56 origin-bottom"
        />
        <motion.img
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          src={PlantersImage.src}
          alt="Planters"
          className="absolute bottom-4 right-4 h-28 xs:h-32 sm:h-40 md:h-56 origin-bottom"
        />
        <motion.div
          className="absolute inset-0  flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            className={cn(
              "absolute inset-0 bg-black/70 blur-3xl z-0 transition-colors",
              shouldDisplayLearnMoreContent && "bg-black/80"
            )}
          ></motion.div>

          <AnimatePresence mode="wait">
            {!shouldDisplayLearnMoreContent && (
              <AnimatedBumicertainBranding
                key={"animated-bumicertain-branding"}
                delayOffset={bumicertainBrandingDelayOffset}
              />
            )}
            {shouldDisplayLearnMoreContent && (
              <motion.div
                key={"learn-more-content"}
                initial={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  filter: "blur(10px)",
                }}
                className="px-6 z-5 font-serif text-white text-center text-pretty max-w-xl text-xl"
              >
                Bumicertain is a marketplace that connects nature stewards with
                funders. It allows local communities and organizations to
                showcase verified conservation efforts through digital
                certificates, enabling them to receive continuous support for
                their regenerative projects.
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 2 }}
            className="absolute bottom-2 flex items-center gap-2 px-2 py-1 bg-transparent backdrop-blur-md hover:bg-white/10 border border-white/20 rounded-full p-2"
            onClick={() => {
              // Set the bumicert branding delay to 0 when the user clicks Learn More for first time (or in fact, any time).
              setBumicertBrandingDelayOffset(0);
              setShouldDisplayLearnMoreContent((prev) => !prev);
            }}
          >
            {shouldDisplayLearnMoreContent ? (
              <ChevronLeftIcon className="size-3 text-white/80" />
            ) : (
              <InfoIcon className="size-3 text-white/80" />
            )}
            <span className="text-white/80 text-sm">
              {shouldDisplayLearnMoreContent ? "Back" : "Learn more"}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

const AnimatedBumicertainBranding = ({
  delayOffset,
}: {
  delayOffset: number;
}) => {
  const { viewport, openState } = useNavbarContext();

  return (
    <motion.div
      className="z-5 flex flex-col items-center justify-center relative"
      initial={{
        opacity: 0,
        scale: 0,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        scale: 0,
        filter: "blur(10px)",
      }}
    >
      <motion.img
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: delayOffset, duration: 0.5 }}
        src={"/assets/media/images/logo.svg"}
        className="h-20 w-20"
      />
      <motion.h1
        className="font-serif text-4xl font-bold text-white"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ delay: delayOffset + 0.2 }}
      >
        Bumicertain
      </motion.h1>
      <motion.span
        className="font-serif text-xl text-center text-pretty italic text-white/60"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ delay: delayOffset + 0.3 }}
      >
        Fund impactful regenerative projects.
      </motion.span>
      {viewport === "desktop" && (
        <motion.div
          initial={{
            scale: 0,
            filter: "blur(10px)",
            y: 0,
            x: 0,
          }}
          animate={{
            scale: 1,
            filter: "blur(0px)",
            y: -10,
            x: -200,
          }}
          transition={{
            delay: delayOffset + 0.6,
            duration: 0.5,
            type: "spring",
          }}
          className="hidden lg:block absolute top-0 left-0 text-nowrap text-white/80 text-shadow-sm bg-black/20 backdrop-blur-lg border border-white/20 shadow-sm px-4 py-1 rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl rounded-br-xs origin-bottom-right"
        >
          Supporters unite.
        </motion.div>
      )}
      {viewport === "desktop" && (
        <motion.div
          initial={{
            scale: 0,
            filter: "blur(10px)",
            y: 0,
            x: 0,
          }}
          animate={{
            scale: 1,
            filter: "blur(0px)",
            y: 30,
            x: 200,
          }}
          transition={{
            delay: delayOffset + 1.1,
            duration: 0.5,
            type: "spring",
          }}
          className="hidden lg:block absolute top-0 right-0 text-nowrap text-white/80 text-shadow-sm bg-black/20 backdrop-blur-lg border border-white/20 shadow-sm px-4 py-1 rounded-tl-2xl rounded-bl-xs rounded-tr-2xl rounded-br-2xl origin-bottom-left"
        >
          Communities thrive.{" "}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Hero2;

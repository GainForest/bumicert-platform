"use client";

import BackgroundImage from "./assets/background.png";
import PlantersImage from "./assets/planters.png";
import ApproachersImage from "./assets/approachers.png";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Hero2 = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleToggle = () => {
    if (!hasAnimated) setHasAnimated(true);
    setShowInfo((prev) => !prev);
  };

  return (
    <div className="w-full mt-4">
      <div className="w-full h-72 md:h-80 rounded-2xl overflow-hidden relative">
        {/* Background image */}
        <motion.img
          initial={{ filter: "brightness(0.5)", scale: 1.1 }}
          animate={{ filter: "brightness(1)", scale: 1 }}
          transition={{ duration: 1.2 }}
          src={BackgroundImage.src}
          alt="Background"
          className="absolute inset-0 object-cover object-bottom h-full w-full"
        />

        {/* Character illustrations */}
        <motion.img
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          src={ApproachersImage.src}
          alt="Approachers"
          className="absolute bottom-0 left-2 md:left-4 h-24 sm:h-32 md:h-44 lg:h-52 origin-bottom"
        />
        <motion.img
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          src={PlantersImage.src}
          alt="Planters"
          className="absolute bottom-0 right-2 md:right-4 h-24 sm:h-32 md:h-44 lg:h-52 origin-bottom"
        />

        {/* Central content overlay */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {/* Blurred background for text readability */}
          <div
            className={cn(
              "absolute inset-x-0 top-1/2 -translate-y-1/2 h-48 bg-black/50 blur-3xl transition-all duration-500",
              showInfo && "bg-black/70 h-56"
            )}
          />

          {/* Content */}
          <AnimatePresence mode="wait">
            {!showInfo ? (
              <motion.div
                key="branding"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex flex-col items-center text-center px-4"
              >
                <motion.img
                  initial={hasAnimated ? {} : { y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: hasAnimated ? 0 : 1, duration: 0.5 }}
                  src="/assets/media/images/logo.svg"
                  alt="Bumicerts Logo"
                  className="h-16 w-16 md:h-20 md:w-20 mb-3"
                />
                <motion.h1
                  initial={hasAnimated ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: hasAnimated ? 0 : 1.2, duration: 0.4 }}
                  className="font-serif text-3xl md:text-4xl font-bold text-white"
                >
                  Bumicerts
                </motion.h1>
                <motion.p
                  initial={hasAnimated ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: hasAnimated ? 0 : 1.4, duration: 0.4 }}
                  className="font-serif text-lg md:text-xl text-white/70 italic mt-1"
                >
                  Fund impactful regenerative projects.
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="info"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 px-6 max-w-xl text-center"
              >
                <p className="font-serif text-white text-lg md:text-xl leading-relaxed">
                  Bumicerts is a marketplace that connects nature stewards with
                  funders. It allows local communities and organizations to
                  showcase verified conservation efforts through digital
                  certificates, enabling them to receive continuous support for
                  their regenerative projects.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            onClick={handleToggle}
            className="absolute bottom-4 z-10 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-full transition-colors"
          >
            {showInfo ? (
              <ChevronLeft className="size-4 text-white/90" strokeWidth={1.5} />
            ) : (
              <Info className="size-4 text-white/90" strokeWidth={1.5} />
            )}
            <span className="text-white/90 text-sm font-medium">
              {showInfo ? "Back" : "Learn more"}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero2;

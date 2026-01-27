"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const HERO_IMAGE = "/humming.png";

const Hero2 = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleToggle = () => {
    if (!hasAnimated) setHasAnimated(true);
    setShowInfo((prev) => !prev);
  };

  return (
    <div className="w-full mt-4">
      <div className="w-full h-72 md:h-[380px] rounded-2xl overflow-hidden relative">
        {/* Background image */}
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          src={HERO_IMAGE}
          alt="Regenerative project"
          className="absolute inset-0 object-cover h-full w-full"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        {/* Content overlay */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {/* Content */}
          <AnimatePresence mode="wait">
            {!showInfo ? (
              <motion.div
                key="branding"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 flex flex-col items-center text-center px-4"
              >
                <motion.h1
                  initial={hasAnimated ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: hasAnimated ? 0 : 0.8, duration: 0.4 }}
                  className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg"
                >
                  Bumicerts
                </motion.h1>
                <motion.p
                  initial={hasAnimated ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: hasAnimated ? 0 : 1, duration: 0.4 }}
                  className="text-base md:text-lg text-white/90 mt-2 max-w-sm drop-shadow-md"
                >
                  Fund impactful regenerative projects
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 px-6 max-w-lg text-center"
              >
                <p className="text-white text-base md:text-lg leading-relaxed drop-shadow-md">
                  Bumicerts connects nature stewards with funders. Local communities 
                  and organizations can showcase verified conservation efforts through 
                  digital certificates, receiving continuous support for their 
                  regenerative projects.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            onClick={handleToggle}
            className="absolute bottom-5 z-10 flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md hover:bg-white/25 border border-white/20 rounded-full transition-colors"
          >
            {showInfo ? (
              <ChevronLeft className="size-4 text-white" strokeWidth={1.5} />
            ) : (
              <Info className="size-4 text-white" strokeWidth={1.5} />
            )}
            <span className="text-white text-sm font-medium">
              {showInfo ? "Back" : "Learn more"}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero2;

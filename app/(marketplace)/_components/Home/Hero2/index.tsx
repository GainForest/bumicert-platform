"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BumicertArt } from "@/app/(marketplace)/bumicert/create/[draftId]/_components/Steps/Step4/BumicertPreviewCard";
import { ArrowRight, ChevronLeft, Info, Leaf, Globe, Shield } from "lucide-react";
import Link from "next/link";
import { links } from "@/lib/links";
import { useState } from "react";

// Key highlights to display
const HIGHLIGHTS = [
  { icon: Leaf, text: "Verified impact" },
  { icon: Globe, text: "Global reach" },
  { icon: Shield, text: "Direct funding" },
];

const LEARN_MORE_TEXT = "Bumicerts is a marketplace that connects nature stewards with funders. It allows local communities and organizations to showcase verified conservation efforts through digital certificates, enabling them to receive continuous support for their regenerative projects.";

// Sample bumicerts to display as floating cards
const FLOATING_CARDS = [
  {
    id: 1,
    image: "/assets/media/images/hero-bumicert-card/image0.png",
    title: "Amazon Rainforest Conservation",
    objectives: ["Biodiversity", "Carbon Capture"],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    position: "left-[3%] top-[8%]",
    rotation: -8,
    delay: 0.2,
    size: "w-[140px] lg:w-[170px]",
    mobileRotation: -8,
  },
  {
    id: 2,
    image: "/assets/media/images/hero-bumicert-card/image1.png",
    title: "Parrot Conservation Program",
    objectives: ["Wildlife Protection", "Biodiversity"],
    startDate: new Date("2024-03-01"),
    endDate: new Date("2025-03-01"),
    position: "right-[3%] top-[5%]",
    rotation: 6,
    delay: 0.4,
    size: "w-[130px] lg:w-[155px]",
    mobileRotation: 0,
  },
  {
    id: 3,
    image: "/assets/media/images/hero-bumicert-card/image3.png",
    title: "Indigenous-Led Monitoring",
    objectives: ["Community Science"],
    startDate: new Date("2024-06-01"),
    endDate: new Date("2025-06-01"),
    position: "left-[6%] bottom-[5%]",
    rotation: 5,
    delay: 0.6,
    size: "w-[125px] lg:w-[150px]",
    mobileRotation: 8,
  },
  {
    id: 4,
    image: "/assets/media/images/hero-bumicert-card/image4.png",
    title: "Wildlife Corridor Project",
    objectives: ["Wildlife", "Connectivity"],
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-31"),
    position: "right-[6%] bottom-[8%]",
    rotation: -5,
    delay: 0.8,
    size: "w-[130px] lg:w-[155px]",
    mobileRotation: -6,
  },
];

const Hero2 = () => {
  const [showLearnMore, setShowLearnMore] = useState(false);

  return (
    <div className="w-full mt-4">
      {/* Desktop version */}
      <div className="hidden sm:block w-full min-h-[380px] rounded-2xl overflow-hidden relative bg-gradient-to-br from-muted/20 via-muted/30 to-primary/5">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/3 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/3 rounded-full blur-[60px]" />
        </div>

        {/* Floating BumicertArt cards */}
        {FLOATING_CARDS.map((card) => (
          <motion.div
            key={card.id}
            className={`absolute ${card.position} ${card.size} z-10`}
            initial={{ opacity: 0, y: 40, rotate: card.rotation }}
            animate={{ opacity: 1, y: 0, rotate: card.rotation }}
            transition={{ delay: card.delay, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ 
              scale: 1.05, 
              rotate: 0,
              zIndex: 30,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4 + card.id * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="drop-shadow-xl"
            >
              <BumicertArt
                logoUrl={null}
                coverImage={card.image}
                title={card.title}
                objectives={card.objectives}
                startDate={card.startDate}
                endDate={card.endDate}
                className="w-full"
              />
            </motion.div>
          </motion.div>
        ))}

        {/* Central content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <AnimatePresence mode="wait">
            {!showLearnMore ? (
              <motion.div
                key="branding"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center px-4 max-w-lg"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="font-serif text-5xl lg:text-6xl font-semibold text-foreground"
                >
                  Bumicerts
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-muted-foreground mt-2 text-lg"
                >
                  Fund impactful regenerative projects
                </motion.p>

                {/* Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex items-center gap-6 mt-5"
                >
                  {HIGHLIGHTS.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <item.icon className="size-4 text-primary" strokeWidth={1.5} />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="mt-6"
                >
                  <Link
                    href={links.explore}
                    className="group inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-primary/90 transition-all hover:gap-3 shadow-lg shadow-primary/20"
                  >
                    <span>Explore projects</span>
                    <ArrowRight className="size-4" strokeWidth={2} />
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="learn-more"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center px-8 max-w-xl"
              >
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="font-serif text-xl lg:text-2xl text-foreground leading-relaxed"
                >
                  {LEARN_MORE_TEXT}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Learn More Toggle Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            onClick={() => setShowLearnMore(!showLearnMore)}
            className="absolute bottom-4 flex items-center gap-1.5 px-4 py-1.5 bg-background/60 backdrop-blur-sm border border-border/50 rounded-full text-sm text-muted-foreground hover:bg-background/80 hover:text-foreground transition-colors"
          >
            {showLearnMore ? (
              <>
                <ChevronLeft className="size-3.5" strokeWidth={2} />
                <span>Back</span>
              </>
            ) : (
              <>
                <Info className="size-3.5" strokeWidth={2} />
                <span>Learn more</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile version */}
      <div className="sm:hidden w-full rounded-2xl overflow-hidden relative bg-gradient-to-br from-muted/20 via-muted/30 to-primary/5 py-6 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
        </div>

        {/* Content with AnimatePresence */}
        <AnimatePresence mode="wait">
          {!showLearnMore ? (
            <motion.div
              key="mobile-branding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Title */}
              <div className="relative z-20 text-center mb-4">
                <h1 className="font-serif text-3xl font-semibold text-foreground">
                  Bumicerts
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Fund impactful regenerative projects
                </p>

                {/* Highlights - mobile */}
                <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
                  {HIGHLIGHTS.map((item, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                      <item.icon className="size-3 text-primary" strokeWidth={1.5} />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fanned cards */}
              <div className="relative z-10 flex justify-center items-center h-[180px]">
                {FLOATING_CARDS.slice(0, 3).map((card, index) => {
                  const xOffset = (index - 1) * 75;
                  const zIndex = 10 + index;
                  
                  return (
                    <motion.div
                      key={card.id}
                      className="absolute w-[115px]"
                      style={{ zIndex }}
                      initial={{ opacity: 0, y: 30, x: xOffset, rotate: card.mobileRotation }}
                      animate={{ opacity: 1, y: 0, x: xOffset, rotate: card.mobileRotation }}
                      transition={{ delay: 0.1 + index * 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 3 + index * 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.3,
                        }}
                        className="drop-shadow-xl"
                      >
                        <BumicertArt
                          logoUrl={null}
                          coverImage={card.image}
                          title={card.title}
                          objectives={card.objectives.slice(0, 1)}
                          startDate={card.startDate}
                          endDate={card.endDate}
                          className="w-full"
                          compact
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Button - mobile */}
              <div className="relative z-20 mt-4 text-center">
                <Link
                  href={links.explore}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <span>Explore projects</span>
                  <ArrowRight className="size-4" strokeWidth={2} />
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="mobile-learn-more"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-20 flex flex-col items-center justify-center min-h-[280px] px-2"
            >
              <p className="font-serif text-lg text-foreground text-center leading-relaxed">
                {LEARN_MORE_TEXT}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Learn More Toggle Button - mobile */}
        <div className="relative z-20 mt-4 flex justify-center">
          <button
            onClick={() => setShowLearnMore(!showLearnMore)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-background/60 backdrop-blur-sm border border-border/50 rounded-full text-sm text-muted-foreground hover:bg-background/80 hover:text-foreground transition-colors"
          >
            {showLearnMore ? (
              <>
                <ChevronLeft className="size-3.5" strokeWidth={2} />
                <span>Back</span>
              </>
            ) : (
              <>
                <Info className="size-3.5" strokeWidth={2} />
                <span>Learn more</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero2;

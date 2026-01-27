"use client";

import { motion } from "framer-motion";
import { BumicertArt } from "@/app/(marketplace)/bumicert/create/[draftId]/_components/Steps/Step4/BumicertPreviewCard";

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
  return (
    <div className="w-full mt-4">
      {/* Desktop version */}
      <div className="hidden sm:block w-full min-h-[340px] rounded-2xl overflow-hidden relative bg-muted/30">
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

        {/* Central content - minimal */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center px-4"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-serif text-5xl lg:text-6xl font-semibold text-foreground"
            >
              Bumicerts
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-muted-foreground mt-2"
            >
              Fund impactful regenerative projects
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="sm:hidden w-full rounded-2xl overflow-hidden relative bg-muted/30 py-6 px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-20 text-center mb-4"
        >
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Bumicerts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fund impactful regenerative projects
          </p>
        </motion.div>

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
                transition={{ delay: 0.3 + index * 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
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
      </div>
    </div>
  );
};

export default Hero2;

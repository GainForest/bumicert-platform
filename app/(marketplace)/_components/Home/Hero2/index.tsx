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
    // Desktop position
    position: "left-[5%] top-[15%]",
    rotation: -12,
    delay: 0.2,
    size: "w-[140px] md:w-[180px]",
    // Mobile card stack position
    mobileOffset: 0,
    mobileRotation: -8,
  },
  {
    id: 2,
    image: "/humming.png",
    title: "Coral Reef Restoration",
    objectives: ["Marine Life", "Ecosystem"],
    startDate: new Date("2024-03-01"),
    endDate: new Date("2025-03-01"),
    position: "right-[5%] top-[10%]",
    rotation: 8,
    delay: 0.4,
    size: "w-[130px] md:w-[160px]",
    mobileOffset: 1,
    mobileRotation: 0,
  },
  {
    id: 3,
    image: "/assets/media/images/hero-bumicert-card/image1.png",
    title: "Mangrove Reforestation",
    objectives: ["Coastal Protection"],
    startDate: new Date("2024-06-01"),
    endDate: new Date("2025-06-01"),
    position: "left-[8%] bottom-[10%]",
    rotation: 6,
    delay: 0.6,
    size: "w-[120px] md:w-[150px]",
    mobileOffset: 2,
    mobileRotation: 8,
  },
];

const Hero2 = () => {
  return (
    <div className="w-full mt-4">
      {/* Desktop version */}
      <div className="hidden sm:block w-full min-h-[400px] rounded-2xl overflow-hidden relative bg-gradient-to-br from-primary/5 via-background to-primary/10">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.08),transparent_50%)]" />
        </div>

        {/* Floating BumicertArt cards - Desktop */}
        {FLOATING_CARDS.map((card) => (
          <motion.div
            key={card.id}
            className={`absolute ${card.position} ${card.size} z-10`}
            initial={{ opacity: 0, y: 30, rotate: card.rotation }}
            animate={{ opacity: 1, y: 0, rotate: card.rotation }}
            transition={{ delay: card.delay, duration: 0.6, ease: "easeOut" }}
            whileHover={{ 
              scale: 1.05, 
              rotate: 0,
              zIndex: 20,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3 + card.id * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="drop-shadow-2xl"
            >
              <BumicertArt
                logoUrl={null}
                coverImage={card.image}
                title={card.title}
                objectives={card.objectives}
                startDate={card.startDate}
                endDate={card.endDate}
                className="w-full shadow-xl"
              />
            </motion.div>
          </motion.div>
        ))}

        {/* Additional card for desktop bottom right */}
        <motion.div
          className="absolute right-[8%] bottom-[15%] w-[155px] z-10"
          initial={{ opacity: 0, y: 30, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: -6 }}
          transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.05, rotate: 0, zIndex: 20, transition: { duration: 0.2 } }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="drop-shadow-2xl"
          >
            <BumicertArt
              logoUrl={null}
              coverImage="/assets/media/images/hero-bumicert-card/image2.png"
              title="Wildlife Corridor Project"
              objectives={["Wildlife", "Connectivity"]}
              startDate={new Date("2024-02-01")}
              endDate={new Date("2024-12-31")}
              className="w-full shadow-xl"
            />
          </motion.div>
        </motion.div>

        {/* Central content - Desktop */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center px-4"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-serif text-5xl lg:text-6xl font-bold text-foreground tracking-tight"
            >
              Bumicerts
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg text-muted-foreground mt-3 max-w-md"
            >
              Fund impactful regenerative projects
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Mobile version - Stacked cards with title */}
      <div className="sm:hidden w-full rounded-2xl overflow-hidden relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-8 px-4">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.15),transparent_60%)]" />
        </div>

        {/* Title at top */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-20 text-center mb-6"
        >
          <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight">
            Bumicerts
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Fund impactful regenerative projects
          </p>
        </motion.div>

        {/* Stacked/Fanned cards */}
        <div className="relative z-10 flex justify-center items-center h-[200px]">
          {FLOATING_CARDS.map((card, index) => {
            // Calculate position for fan effect
            const xOffset = (index - 1) * 70; // Spread cards horizontally
            const zIndex = 10 + index;
            
            return (
              <motion.div
                key={card.id}
                className="absolute w-[110px]"
                style={{ zIndex }}
                initial={{ 
                  opacity: 0, 
                  y: 30, 
                  x: xOffset,
                  rotate: card.mobileRotation 
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  x: xOffset,
                  rotate: card.mobileRotation 
                }}
                transition={{ 
                  delay: 0.3 + index * 0.15, 
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 2.5 + index * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
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
                    className="w-full shadow-lg"
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

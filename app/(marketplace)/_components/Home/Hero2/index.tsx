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
    position: "left-[5%] top-[15%]",
    rotation: -12,
    delay: 0.2,
    size: "w-[140px] md:w-[180px]",
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
  },
  {
    id: 4,
    image: "/assets/media/images/hero-bumicert-card/image2.png",
    title: "Wildlife Corridor Project",
    objectives: ["Wildlife", "Connectivity"],
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-31"),
    position: "right-[8%] bottom-[15%]",
    rotation: -6,
    delay: 0.8,
    size: "w-[125px] md:w-[155px]",
  },
];

const Hero2 = () => {
  return (
    <div className="w-full mt-4">
      <div className="w-full min-h-[320px] md:min-h-[400px] rounded-2xl overflow-hidden relative bg-gradient-to-br from-primary/5 via-background to-primary/10">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.08),transparent_50%)]" />
        </div>

        {/* Floating BumicertArt cards */}
        {FLOATING_CARDS.map((card) => (
          <motion.div
            key={card.id}
            className={`absolute ${card.position} ${card.size} z-10 hidden sm:block`}
            initial={{ opacity: 0, y: 30, rotate: card.rotation }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              rotate: card.rotation,
            }}
            transition={{ 
              delay: card.delay, 
              duration: 0.6,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.05, 
              rotate: 0,
              zIndex: 20,
              transition: { duration: 0.2 }
            }}
          >
            {/* Floating animation wrapper */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
              }}
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

        {/* Central content */}
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
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight"
            >
              Bumicerts
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-base md:text-lg text-muted-foreground mt-3 max-w-md"
            >
              Fund impactful regenerative projects
            </motion.p>
          </motion.div>
        </div>

        {/* Mobile: Show single card below title */}
        <motion.div 
          className="sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 w-[140px] z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <BumicertArt
              logoUrl={null}
              coverImage="/assets/media/images/hero-bumicert-card/image0.png"
              title="Amazon Conservation"
              objectives={["Biodiversity"]}
              startDate={new Date("2024-01-01")}
              endDate={new Date("2024-12-31")}
              className="w-full shadow-xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero2;

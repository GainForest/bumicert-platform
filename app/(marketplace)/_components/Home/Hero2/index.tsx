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
    position: "left-[3%] top-[12%]",
    rotation: -8,
    delay: 0.2,
    size: "w-[160px] lg:w-[190px]",
    mobileRotation: -8,
  },
  {
    id: 2,
    image: "/assets/media/images/hero-bumicert-card/image1.png",
    title: "Parrot Conservation Program",
    objectives: ["Wildlife Protection", "Biodiversity"],
    startDate: new Date("2024-03-01"),
    endDate: new Date("2025-03-01"),
    position: "right-[3%] top-[8%]",
    rotation: 6,
    delay: 0.4,
    size: "w-[150px] lg:w-[175px]",
    mobileRotation: 0,
  },
  {
    id: 3,
    image: "/assets/media/images/hero-bumicert-card/image3.png",
    title: "Indigenous-Led Monitoring",
    objectives: ["Community Science"],
    startDate: new Date("2024-06-01"),
    endDate: new Date("2025-06-01"),
    position: "left-[6%] bottom-[8%]",
    rotation: 5,
    delay: 0.6,
    size: "w-[140px] lg:w-[165px]",
    mobileRotation: 8,
  },
  {
    id: 4,
    image: "/assets/media/images/hero-bumicert-card/image4.png",
    title: "Wildlife Corridor Project",
    objectives: ["Wildlife", "Connectivity"],
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-31"),
    position: "right-[6%] bottom-[12%]",
    rotation: -5,
    delay: 0.8,
    size: "w-[145px] lg:w-[170px]",
    mobileRotation: -6,
  },
];

const Hero2 = () => {
  return (
    <div className="w-full mt-4">
      {/* Desktop version */}
      <div className="hidden sm:block w-full min-h-[440px] rounded-3xl overflow-hidden relative">
        {/* Rich layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-amber-50/50 to-stone-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900" />
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(251,191,36,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,197,94,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
        </div>

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

        {/* Floating BumicertArt cards */}
        {FLOATING_CARDS.map((card) => (
          <motion.div
            key={card.id}
            className={`absolute ${card.position} ${card.size} z-10`}
            initial={{ opacity: 0, y: 40, rotate: card.rotation }}
            animate={{ opacity: 1, y: 0, rotate: card.rotation }}
            transition={{ delay: card.delay, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ 
              scale: 1.08, 
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
              className="relative"
            >
              {/* Card glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-400/20 to-green-400/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                <BumicertArt
                  logoUrl={null}
                  coverImage={card.image}
                  title={card.title}
                  objectives={card.objectives}
                  startDate={card.startDate}
                  endDate={card.endDate}
                  className="w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Central content with glassmorphism */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            {/* Glass card background */}
            <div className="absolute -inset-8 -inset-y-6 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]" />
            
            <div className="relative flex flex-col items-center text-center px-12 py-2">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="font-serif text-5xl lg:text-6xl font-bold bg-gradient-to-br from-stone-800 via-stone-700 to-stone-600 dark:from-white dark:via-stone-200 dark:to-stone-400 bg-clip-text text-transparent"
              >
                Bumicerts
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-base lg:text-lg text-stone-600 dark:text-stone-400 mt-2 font-medium"
              >
                Fund impactful regenerative projects
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-6 left-6 w-24 h-24 border-l-2 border-t-2 border-stone-300/30 dark:border-white/10 rounded-tl-3xl" />
        <div className="absolute bottom-6 right-6 w-24 h-24 border-r-2 border-b-2 border-stone-300/30 dark:border-white/10 rounded-br-3xl" />
      </div>

      {/* Mobile version */}
      <div className="sm:hidden w-full rounded-2xl overflow-hidden relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100 via-amber-50/30 to-stone-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12),transparent_60%)]" />
        
        <div className="relative py-8 px-4">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-20 text-center mb-8"
          >
            <div className="inline-block">
              <div className="absolute -inset-4 -inset-y-2 bg-white/70 dark:bg-black/40 backdrop-blur-lg rounded-2xl border border-white/50 dark:border-white/10" />
              <div className="relative px-6">
                <h1 className="font-serif text-3xl font-bold bg-gradient-to-br from-stone-800 to-stone-600 dark:from-white dark:to-stone-400 bg-clip-text text-transparent">
                  Bumicerts
                </h1>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                  Fund impactful regenerative projects
                </p>
              </div>
            </div>
          </motion.div>

          {/* Fanned cards */}
          <div className="relative z-10 flex justify-center items-center h-[200px]">
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
                    className="drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
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
    </div>
  );
};

export default Hero2;

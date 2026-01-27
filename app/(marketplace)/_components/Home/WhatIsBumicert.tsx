"use client";

import { BumicertArt } from "@/app/(marketplace)/bumicert/create/[draftId]/_components/Steps/Step4/BumicertPreviewCard";
import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Clock, Users } from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Verified impact",
    description: "Backed by photos, videos, and geolocation data proving the work truly happened.",
  },
  {
    icon: MapPin,
    title: "Location-specific",
    description: "Tied to exact coordinates where land was protected or ecosystems restored.",
  },
  {
    icon: Clock,
    title: "Permanent record",
    description: "An immutable record of when and where positive change occurred.",
  },
  {
    icon: Users,
    title: "Direct connection",
    description: "Support reaches the people and communities responsible, with full transparency.",
  },
];

const WhatIsBumicert = () => {
  return (
    <div className="mt-28 mb-8">
      {/* Decorative divider */}
      <div className="flex items-center justify-center mb-20">
        <div className="h-px w-16 bg-border/50" />
        <div className="mx-4 w-2 h-2 rounded-full bg-primary/30" />
        <div className="h-px w-16 bg-border/50" />
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24">
        {/* Bumicert preview */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="shrink-0 order-2 lg:order-1"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/15 rounded-3xl blur-[60px] scale-110" />
            
            {/* Card */}
            <div className="relative transform hover:-rotate-1 hover:scale-[1.02] transition-all duration-500">
              <BumicertArt
                logoUrl="/assets/media/images/logo.svg"
                coverImage="/assets/media/images/hero-bumicert-card/image0.png"
                title="Bioacoustics Monitoring in the Amazon"
                objectives={[
                  "Community Resilience",
                  "Biodiversity Monitoring",
                ]}
                startDate={new Date("2025-01-01")}
                endDate={new Date("2025-12-31")}
                className="w-[260px] shadow-2xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Text content */}
        <div className="max-w-lg order-1 lg:order-2 text-center lg:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-bold text-foreground"
          >
            What is a Bumicert?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground leading-relaxed"
          >
            A digital certificate that verifies environmental conservation work, 
            connecting nature stewards directly with supporters around the world.
          </motion.p>

          {/* Features list */}
          <div className="mt-10 space-y-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + index * 0.08 }}
                className="group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="size-5 text-primary" strokeWidth={1.25} />
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIsBumicert;

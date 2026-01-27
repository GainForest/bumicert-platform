"use client";

import { BumicertArt } from "@/app/(marketplace)/bumicert/create/[draftId]/_components/Steps/Step4/BumicertPreviewCard";
import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Clock, Users } from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Verified impact",
    description: "Every bumicert is backed by photos, videos, and geolocation data that prove the environmental work truly happened.",
  },
  {
    icon: MapPin,
    title: "Location-specific",
    description: "Each certificate is tied to exact coordinates, capturing where land was protected or ecosystems were restored.",
  },
  {
    icon: Clock,
    title: "Permanent record",
    description: "A bumicert stores the exact moment when restoration occurred, creating an immutable record of positive change.",
  },
  {
    icon: Users,
    title: "Direct connection",
    description: "Support reaches the exact people and communities responsible for the impact, with full transparency.",
  },
];

const WhatIsBumicert = () => {
  return (
    <div className="mt-20 mb-16">
      {/* Section header */}
      <div className="text-center mb-16">
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
          className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          A digital certificate that verifies and records environmental conservation work, 
          connecting stewards directly with supporters.
        </motion.p>
      </div>

      {/* Main content - centered */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        {/* Bumicert preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="shrink-0"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl scale-90" />
            
            {/* Card with subtle rotation */}
            <div className="relative transform hover:rotate-1 transition-transform duration-500">
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
                className="w-[240px] shadow-2xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="size-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatIsBumicert;

"use client";

import { links } from "@/lib/links";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const UserOptionCards = () => {
  return (
    <div className="mt-16">
      {/* Section intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-10"
      >
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
          Get started
        </h2>
        <p className="text-muted-foreground mt-2">
          Whether you want to fund or create impact
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <Link href={links.explore} className="block group h-full">
            <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-background via-background to-primary/5 p-8 h-full flex flex-col hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
              {/* Background decoration */}
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
              <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-primary/3 rounded-full blur-2xl" />
              
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                <Compass className="size-7 text-primary" strokeWidth={1.25} />
              </div>
              
              {/* Content */}
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-3">
                Discover impact
              </h3>
              <p className="text-muted-foreground leading-relaxed flex-1 text-base">
                Explore verified conservation projects from communities worldwide. Find work that resonates with you and support it directly.
              </p>
              
              {/* CTA */}
              <div className="flex items-center gap-2 text-primary font-medium mt-6 group-hover:gap-3 transition-all">
                <span>Explore projects</span>
                <ArrowRight className="size-4" strokeWidth={2} />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="h-full"
        >
          <Link href={links.bumicert.create} className="block group h-full">
            <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-background via-background to-primary/5 p-8 h-full flex flex-col hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
              {/* Background decoration */}
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
              <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-primary/3 rounded-full blur-2xl" />
              
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                <Sparkles className="size-7 text-primary" strokeWidth={1.25} />
              </div>
              
              {/* Content */}
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-3">
                Certify your work
              </h3>
              <p className="text-muted-foreground leading-relaxed flex-1 text-base">
                Turn your conservation efforts into verifiable digital certificates. Connect with funders who share your mission.
              </p>
              
              {/* CTA */}
              <div className="flex items-center gap-2 text-primary font-medium mt-6 group-hover:gap-3 transition-all">
                <span>Create a bumicert</span>
                <ArrowRight className="size-4" strokeWidth={2} />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default UserOptionCards;

"use client";

import { links } from "@/lib/links";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const UserOptionCards = () => {
  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <Link href={links.explore} className="block group h-full">
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/30 p-6 h-full flex flex-col hover:border-border/80 hover:shadow-lg transition-all duration-300">
              {/* Background decoration */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Compass className="size-6 text-primary" strokeWidth={1.5} />
              </div>
              
              {/* Content */}
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Discover impact
              </h3>
              <p className="text-muted-foreground leading-relaxed flex-1">
                Find conservation projects protecting biodiversity, restoring ecosystems, and empowering local communities.
              </p>
              
              {/* CTA - pinned to bottom */}
              <div className="flex items-center gap-2 text-primary font-medium mt-4 pt-4 border-t border-border/30">
                <span>Explore projects</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
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
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/30 p-6 h-full flex flex-col hover:border-border/80 hover:shadow-lg transition-all duration-300">
              {/* Background decoration */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="size-6 text-primary" strokeWidth={1.5} />
              </div>
              
              {/* Content */}
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Certify your work
              </h3>
              <p className="text-muted-foreground leading-relaxed flex-1">
                Turn your conservation efforts into verifiable certificates and connect with funders who share your mission.
              </p>
              
              {/* CTA - pinned to bottom */}
              <div className="flex items-center gap-2 text-primary font-medium mt-4 pt-4 border-t border-border/30">
                <span>Create a bumicert</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default UserOptionCards;

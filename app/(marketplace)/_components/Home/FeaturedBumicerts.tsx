"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { links } from "@/lib/links";
import { Button } from "@/components/ui/button";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { getEcocertsFromClaimActivities as getBumicertsFromClaimActivities } from "climateai-sdk/utilities/hypercerts";
import BumicertCard, { hasValidImage } from "../../explore/_components/Bumicerts/BumicertCard";

const FeaturedBumicerts = () => {
  const { data, isLoading } =
    trpcApi.hypercerts.claim.activity.getAllAcrossOrgs.useQuery({
      pdsDomain: allowedPDSDomains[0],
    });

  const bumicerts = React.useMemo(() => {
    if (!data) return [];
    const allBumicerts = getBumicertsFromClaimActivities(data, allowedPDSDomains[0]);
    return allBumicerts
      .filter(hasValidImage)
      .slice(0, 4);
  }, [data]);

  if (isLoading) {
    return (
      <div className="mt-16">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>
    );
  }

  if (bumicerts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      {/* Section header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-2xl md:text-3xl font-bold text-foreground"
          >
            Featured projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-muted-foreground"
          >
            Discover impactful regenerative work happening right now
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link href={links.explore}>
            <Button variant="ghost" className="gap-2">
              View all
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Bumicerts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bumicerts.map((bumicert, index) => (
          <motion.div
            key={bumicert.claimActivity.cid}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            <BumicertCard bumicert={bumicert} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBumicerts;

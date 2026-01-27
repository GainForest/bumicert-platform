"use client";

import React, { useState, useRef, useEffect } from "react";
import SiteBoundaries from "./SiteBoundaries";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { OrgHypercertsClaimActivity } from "climateai-sdk/lex-api";
import {
  deserialize,
  SerializedSuperjson,
} from "climateai-sdk/utilities/transform";
import { cn } from "@/lib/utils";

const Body = ({
  serializedBumicert,
}: {
  serializedBumicert: SerializedSuperjson<OrgHypercertsClaimActivity.Record>;
}) => {
  const bumicert = deserialize(serializedBumicert);
  const hasLocations = bumicert.locations && bumicert.locations.length > 0;

  return (
    <div className="mt-12">
      <div className={cn(
        "grid gap-8",
        hasLocations ? "lg:grid-cols-[1fr_380px]" : "grid-cols-1 max-w-3xl"
      )}>
        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">About this project</h2>
          <CollapsibleDescription description={bumicert.description ?? ""} />
        </div>

        {/* Map */}
        {hasLocations && (
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SiteBoundaries locationAtUri={bumicert.locations![0].uri} />
          </div>
        )}
      </div>
    </div>
  );
};

const CollapsibleDescription = ({
  description,
  maxHeight = 400,
}: {
  description: string;
  maxHeight?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShouldShowButton(contentHeight > maxHeight);
    }
  }, [maxHeight, description]);

  if (!description) {
    return (
      <p className="text-muted-foreground italic">No description provided.</p>
    );
  }

  return (
    <div className="relative">
      <motion.div
        className="overflow-hidden"
        animate={{
          height: isExpanded || !shouldShowButton ? "auto" : maxHeight,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div ref={contentRef}>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </div>
      </motion.div>

      {shouldShowButton && (
        <div
          className={cn(
            "flex justify-center pt-4",
            !isExpanded && "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent h-24 items-end"
          )}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full bg-background"
          >
            <ChevronDown
              className={cn(
                "size-4 mr-1 transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
              strokeWidth={1.5}
            />
            {isExpanded ? "Show less" : "Read more"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Body;

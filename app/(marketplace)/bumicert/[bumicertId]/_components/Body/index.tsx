"use client";

import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import SiteBoundaries from "./SiteBoundaries";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { OrgHypercertsClaimActivity } from "gainforest-sdk/lex-api";
import {
  deserialize,
  SerializedSuperjson,
} from "gainforest-sdk/utilities/transform";
import dynamic from "next/dynamic";
import type { RichTextRecord } from "bsky-richtext-react";
import { richTextDisplayClassNames, toRichTextFacets } from "@/lib/richtext";

const DynamicRichTextDisplay = dynamic(
  () => import("bsky-richtext-react").then((mod) => mod.RichTextDisplay),
  { ssr: false }
);

// Custom hook to handle collapsible content
const useCollapsible = (maxHeight: number = 320) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShouldShowButton(contentHeight > maxHeight);

      const resizeObserver = new ResizeObserver((entries) => {
        const contentHeight = entries[0].contentRect.height;
        setShouldShowButton(contentHeight > maxHeight);
      });
      resizeObserver.observe(contentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [maxHeight]);

  return {
    isExpanded,
    setIsExpanded,
    shouldShowButton,
    contentRef,
  };
};

// Collapsible Description Component
const CollapsibleDescription = ({
  description,
  descriptionFacets,
  maxHeight = 400,
}: {
  description: string;
  descriptionFacets?: RichTextRecord["facets"];
  maxHeight?: number;
}) => {
  const { isExpanded, setIsExpanded, shouldShowButton, contentRef } =
    useCollapsible(maxHeight);

  return (
    <div className="relative">
      <motion.div
        className="overflow-hidden"
        animate={{
          height: isExpanded ? "auto" : `${maxHeight}px`,
        }}
      >
        <div ref={contentRef}>
          <DynamicRichTextDisplay
            value={{ text: description, facets: descriptionFacets }}
            classNames={richTextDisplayClassNames}
          />
        </div>
      </motion.div>
      {shouldShowButton && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent h-24 flex items-end justify-center",
            isExpanded && "flex justify-center pt-4 static bg-transparent h-auto"
          )}
        >
          <Button
            variant="outline"
            className="rounded-full bg-background"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown
              size={16}
              strokeWidth={1.5}
              className={cn(
                "mr-1 transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
            />
            {isExpanded ? "Show less" : "Read more"}
          </Button>
        </div>
      )}
    </div>
  );
};

const Body = ({
  serializedBumicert,
}: {
  serializedBumicert: SerializedSuperjson<OrgHypercertsClaimActivity.Record>;
}) => {
  const bumicert = deserialize(serializedBumicert);

  const hasLocations = bumicert.locations && bumicert.locations.length > 0;

  const descriptionFacets = bumicert.descriptionFacets
    ? toRichTextFacets(bumicert.descriptionFacets)
    : undefined;

  return (
    <div className="mt-12">
      <div
        className={cn(
          "grid gap-8",
          hasLocations ? "lg:grid-cols-[1fr_380px]" : "grid-cols-1 max-w-3xl"
        )}
      >
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            About this project
          </h2>
          <CollapsibleDescription
            description={bumicert.description ?? ""}
            descriptionFacets={descriptionFacets}
          />
        </div>
        {hasLocations && (
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SiteBoundaries locationAtUri={bumicert.locations![0].uri} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Body;

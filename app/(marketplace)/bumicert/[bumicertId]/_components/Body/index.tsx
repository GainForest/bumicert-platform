"use client";

import { useNavbarContext } from "@/components/global/Navbar/context";
import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import SiteBoundaries from "./SiteBoundaries";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
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
  maxHeight = 360,
}: {
  description: string;
  descriptionFacets?: RichTextRecord["facets"];
  maxHeight?: number;
}) => {
  const { isExpanded, setIsExpanded, shouldShowButton, contentRef } =
    useCollapsible(maxHeight);

  return (
    <motion.div
      className="flex flex-col overflow-hidden relative"
      animate={{
        height: isExpanded ? "auto" : `${maxHeight}px`,
      }}
    >
      <div className="flex flex-col" ref={contentRef}>
        <h2 className="text-2xl font-bold font-serif px-3 text-primary">
          Description
        </h2>
        <div className="p-3">
          <DynamicRichTextDisplay
            value={{ text: description, facets: descriptionFacets }}
            classNames={richTextDisplayClassNames}
          />
        </div>
      </div>
      {shouldShowButton && (
        <div
          className={cn(
            "absolute bottom-0 w-full flex items-end justify-center bg-gradient-to-t from-background to-transparent h-20 py-1",
            isExpanded && "bg-transparent static h-10"
          )}
        >
          <Button
            variant="outline"
            className="rounded-full"
            style={{
              backgroundColor: "var(--background)",
            }}
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDownIcon
              className={cn(
                "transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
            />
            {isExpanded ? "Read Less" : "Read More"}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

const Body = ({
  serializedBumicert,
}: {
  serializedBumicert: SerializedSuperjson<OrgHypercertsClaimActivity.Record>;
}) => {
  const bumicert = deserialize(serializedBumicert);
  const { openState, viewport } = useNavbarContext();

  let displayMode: "stacked" | "side-by-side" = "stacked";
  if (viewport === "desktop" && openState.desktop === true) {
    displayMode = "side-by-side";
  }

  const descriptionFacets = bumicert.descriptionFacets
    ? toRichTextFacets(bumicert.descriptionFacets)
    : undefined;

  return (
    <div
      className={cn(
        "mt-8 gap-2 grid",
        displayMode === "stacked"
          ? "grid-cols-1 min-[880px]:grid-cols-[1fr_300px]"
          : "grid-cols-1 min-[1000px]:grid-cols-[1fr_300px]"
      )}
    >
      <CollapsibleDescription
        description={bumicert.description ?? ""}
        descriptionFacets={descriptionFacets}
      />
      <div className="flex flex-col px-3 min-[1000px]:px-0">
        {bumicert.locations && bumicert.locations.length > 0 && (
          <SiteBoundaries locationAtUri={bumicert.locations[0].uri} />
        )}
      </div>
    </div>
  );
};

export default Body;

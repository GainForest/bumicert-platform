"use client";

import { useNavbarContext } from "@/components/global/Navbar/context";
import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import SiteBoundaries from "./SiteBoundaries";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { OrgHypercertsClaimActivity, AppBskyRichtextFacet } from "gainforest-sdk/lex-api";
import {
  deserialize,
  SerializedSuperjson,
} from "gainforest-sdk/utilities/transform";
import {
  RichTextDisplay,
  type RichTextRecord,
  type FacetFeature,
} from "bsky-richtext-react";
import { richTextDisplayClassNames } from "@/lib/richtext";

const KNOWN_FEATURE_TYPES = new Set([
  "app.bsky.richtext.facet#mention",
  "app.bsky.richtext.facet#link",
  "app.bsky.richtext.facet#tag",
]);

/**
 * Type guard that checks whether an SDK facet feature is a known
 * bsky-richtext-react FacetFeature (mention, link, or tag).
 * The SDK's facet type includes a catch-all `{ $type: string }` in the
 * features union; this guard narrows it to the three concrete types.
 */
function isKnownFacetFeature(
  f: AppBskyRichtextFacet.Main["features"][number]
): f is FacetFeature {
  return typeof f.$type === "string" && KNOWN_FEATURE_TYPES.has(f.$type);
}

/**
 * Converts SDK facets (AppBskyRichtextFacet.Main[]) to bsky-richtext-react
 * Facet[] by filtering out any features with unknown $type values.
 */
function toRichTextFacets(
  facets: AppBskyRichtextFacet.Main[]
): RichTextRecord["facets"] {
  return facets.map((facet) => ({
    index: facet.index,
    features: facet.features.filter(isKnownFacetFeature),
  }));
}

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
          <RichTextDisplay
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

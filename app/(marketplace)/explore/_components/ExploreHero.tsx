"use client";

import React from "react";
import { useExploreStore } from "../store";

const ExploreHero = () => {
  const { bumicerts } = useExploreStore();
  const count = bumicerts?.length ?? 0;

  return (
    <div className="pt-8 pb-6">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
        Explore
      </h1>
      <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
        Browse verified conservation projects from communities protecting ecosystems worldwide.
      </p>
      {count > 0 && (
        <p className="mt-2 text-sm text-muted-foreground/60">
          {count} bumicert{count !== 1 ? "s" : ""} available
        </p>
      )}
    </div>
  );
};

export default ExploreHero;

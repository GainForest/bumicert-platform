"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import {
  sortingOptions,
  TBumicertSortingOptions,
} from "../_hooks/use-sorted-bumicerts";
import { useExploreStore } from "../store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ExploreFilters = () => {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const { organizations, bumicerts } = useExploreStore();
  const [selectedOrg, setSelectedOrg] = useQueryState("org", { defaultValue: "" });

  const sortKeys = sortingOptions.map((option) => option.value);
  const [sortKey, setSortKey] = useQueryState(
    "sort",
    parseAsStringLiteral<TBumicertSortingOptions["key"]>(sortKeys).withDefault(
      "date-created"
    )
  );

  const orderKeys: Array<TBumicertSortingOptions["order"]> = ["asc", "desc"];
  const [sortDirection, setSortDirection] = useQueryState(
    "order",
    parseAsStringLiteral<TBumicertSortingOptions["order"]>(
      orderKeys
    ).withDefault("desc")
  );

  const organizationsWithCounts = useMemo(() => {
    if (!organizations || !bumicerts) return null;
    const countMap = new Map<string, number>();
    for (const bumicert of bumicerts) {
      countMap.set(bumicert.repo.did, (countMap.get(bumicert.repo.did) ?? 0) + 1);
    }
    return organizations
      .map((org) => ({
        ...org,
        count: countMap.get(org.repo.did) ?? 0,
      }))
      .filter((org) => org.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [organizations, bumicerts]);

  const currentSortOption = sortingOptions.find((opt) => opt.value === sortKey);

  const handleSortChange = (value: string) => {
    const validatedValue = sortKeys.find((key) => key === value);
    setSortKey(validatedValue ?? "date-created");
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="pb-6 space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" strokeWidth={1.5} />
          <Input
            placeholder="Search bumicerts..."
            className="pl-10 bg-background border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="size-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">{currentSortOption?.label || "Sort"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortingOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={cn(sortKey === option.value && "bg-accent")}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            className="size-9"
            onClick={toggleSortDirection}
          >
            <ArrowUpDown
              className={cn(
                "size-4 transition-transform",
                sortDirection === "asc" && "rotate-180"
              )}
              strokeWidth={1.5}
            />
          </Button>
        </div>
      </div>

      {/* Organization Filter Pills */}
      {organizationsWithCounts && organizationsWithCounts.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hidden">
          <button
            onClick={() => setSelectedOrg("")}
            className={cn(
              "shrink-0 px-3 py-1.5 text-sm rounded-full border transition-colors",
              !selectedOrg
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
            )}
          >
            All
          </button>
          {organizationsWithCounts.map((org) => (
            <button
              key={org.repo.did}
              onClick={() => setSelectedOrg(selectedOrg === org.repo.did ? "" : org.repo.did)}
              className={cn(
                "shrink-0 px-3 py-1.5 text-sm rounded-full border transition-colors inline-flex items-center gap-1.5",
                selectedOrg === org.repo.did
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
              )}
            >
              {org.info.displayName}
              <span className={cn(
                "text-xs",
                selectedOrg === org.repo.did ? "text-background/60" : "text-muted-foreground/50"
              )}>
                {org.count}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreFilters;

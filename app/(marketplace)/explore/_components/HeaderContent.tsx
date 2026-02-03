"use client";
import { useNavbarContext } from "@/components/global/Navbar/context";
import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDown01,
  ArrowDownNarrowWide,
  ArrowUp10,
  ArrowUpWideNarrow,
  BadgePlus,
  CalendarArrowDown,
  CalendarArrowUp,
  Filter,
} from "lucide-react";
import React, { Suspense, useEffect, useMemo } from "react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import {
  sortingOptions,
  TBumicertSortingOptions,
} from "../_hooks/use-sorted-bumicerts";
import { useAtprotoStore } from "@/components/stores/atproto";
import { useExploreStore } from "../store";
import Link from "next/link";
import { links } from "@/lib/links";

const LeftContent = () => {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  return (
    <Input
      placeholder="Search Bumicerts"
      className="h-8 bg-background/60"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

const RightContent = () => {
  const { viewport } = useNavbarContext();
  const auth = useAtprotoStore((state) => state.auth);
  return (
    <Link href={links.bumicert.create}>
      <Button
        size={"sm"}
        variant={
          viewport === "mobile"
            ? "default"
            : auth.status === "AUTHENTICATED"
            ? "default"
            : "outline"
        }
      >
        <BadgePlus />
        <span className="inline min-[48.01rem]:max-[54rem]:hidden max-[28rem]:hidden">
          Create Bumicert
        </span>
      </Button>
    </Link>
  );
};

const FilterOptions = () => {
  const { viewport } = useNavbarContext();
  const { organizations, bumicerts } = useExploreStore();
  const organizationsWithBumicertCounts = useMemo(() => {
    const hashmap = new Map<string, number>();
    for (const bumicert of bumicerts ?? []) {
      hashmap.set(bumicert.repo.did, (hashmap.get(bumicert.repo.did) ?? 0) + 1);
    }
    const orgsWithCounts = organizations?.map((organization) => ({
      ...organization,
      bumicertCount: hashmap.get(organization.repo.did) ?? 0,
    }));
    const sortedOrgsWithCounts = orgsWithCounts?.sort(
      (a, b) => b.bumicertCount - a.bumicertCount
    );
    return sortedOrgsWithCounts;
  }, [organizations, bumicerts]);
  if (viewport === "mobile") {
    return (
      <div className="flex items-center gap-2">
        <Button size={"sm"} variant={"outline"} disabled={!organizations}>
          <Filter />
          <span className="inline max-[22rem]:hidden">Filter</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
      <span className="font-semibold text-sm text-muted-foreground">
        {/* Organizations: */}
      </span>
      <div className="flex-1 overflow-x-auto scrollbar-hidden rounded-full mask-r-from-90%">
        <div className="flex items-center gap-1">
          {!organizationsWithBumicertCounts &&
            Array.from({ length: 10 }).map((_, index) => (
              <Button
                key={index}
                size={"sm"}
                variant={"secondary"}
                className="rounded-full bg-primary/20 animate-pulse w-26"
              ></Button>
            ))}
          {organizationsWithBumicertCounts &&
            organizationsWithBumicertCounts.map((organization) => (
              <Button
                key={organization.repo.did}
                size={"sm"}
                variant={"secondary"}
                className="rounded-full border border-primary/30 hover:border-primary/60"
              >
                {organization.info.displayName}
                <span className="ml-2">{organization.bumicertCount}</span>
              </Button>
            ))}
          <div className="">&nbsp;&nbsp;&nbsp;&nbsp;</div>
        </div>
      </div>
    </div>
  );
};

const SortingOptions = () => {
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

  return (
    <div className="flex items-center gap-2">
      <Select
        value={sortKey}
        onValueChange={(value) => {
          const validatedValue = sortKeys.find((key) => key === value);
          setSortKey(validatedValue ?? "date-created");
        }}
      >
        <SelectTrigger className="h-8 w-auto">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortingOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center border border-border bg-background rounded-lg p-0.5 gap-0.5 overflow-hidden">
        <Button
          size={"icon"}
          variant={sortDirection === "asc" ? "secondary" : "ghost"}
          className={cn(
            "h-7 relative border border-transparent",
            sortDirection === "asc" &&
              "border-primary/50 bg-accent text-primary"
          )}
          onClick={() => setSortDirection("asc")}
        >
          {sortKey === "date-created" ? (
            <CalendarArrowUp />
          ) : sortKey === "funds-raised" || sortKey === "funding-goal" ? (
            <ArrowDown01 />
          ) : (
            <ArrowDownNarrowWide />
          )}
        </Button>
        <div className="h-4 w-0.5 bg-border"></div>
        <Button
          size={"icon"}
          variant={sortDirection === "desc" ? "secondary" : "ghost"}
          className={cn(
            "h-7 border border-transparent",
            sortDirection === "desc" &&
              "border-primary/50 bg-accent text-primary"
          )}
          onClick={() => setSortDirection("desc")}
        >
          {sortKey === "date-created" ? (
            <CalendarArrowDown />
          ) : sortKey === "funds-raised" || sortKey === "funding-goal" ? (
            <ArrowUp10 />
          ) : (
            <ArrowUpWideNarrow />
          )}
        </Button>
      </div>
    </div>
  );
};

const SubHeaderContent = () => {
  return (
    <div className="flex items-center justify-between gap-2 w-full bg-muted/90 p-2">
      <FilterOptions />
      <SortingOptions />
    </div>
  );
};

const HeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(<LeftContent />);
    setRightContent(
      <Suspense>
        <RightContent />
      </Suspense>
    );
    setSubHeaderContent(
      <Suspense>
        <SubHeaderContent />
      </Suspense>
    );
  }, []);

  return null;
};

export default HeaderContent;

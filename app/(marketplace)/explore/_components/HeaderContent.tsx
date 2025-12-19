"use client";
import { useNavbarContext } from "@/components/global/Navbar/context";
import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
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
import React, { Suspense, useEffect } from "react";
import useAccount from "@/hooks/use-account";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import {
  sortingOptions,
  TEcocertSortingOptions,
} from "../_hooks/use-sorted-ecocerts";

const LeftContent = () => {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  return (
    <Input
      placeholder="Search Ecocerts"
      className="h-8 bg-background/60"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

const RightContent = () => {
  const { viewport } = useNavbarContext();
  const { authenticated } = useAccount();
  return (
    <Button
      size={"sm"}
      variant={
        viewport === "mobile"
          ? "default"
          : authenticated
          ? "default"
          : "outline"
      }
    >
      <BadgePlus />
      <span className="inline min-[48.01rem]:max-[54rem]:hidden max-[28rem]:hidden">
        Create Ecocert
      </span>
    </Button>
  );
};

const FilterOptions = () => {
  const { viewport } = useNavbarContext();
  if (viewport === "mobile") {
    return (
      <div className="flex items-center gap-2">
        <Button size={"sm"} variant={"outline"}>
          <Filter />
          <span className="inline max-[22rem]:hidden">Filter</span>
        </Button>
      </div>
    );
  }
  const organizations = [
    "organization 1",
    "organization 2",
    "organization 3",
    "organization 4",
    "organization 5",
    "organization 6",
    "organization 7",
    "organization 8",
    "organization 9",
    "organization 10",
  ];
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
      <span className="font-semibold text-sm text-muted-foreground">
        {/* Organizations: */}
      </span>
      <div className="flex-1 overflow-x-auto scrollbar-hidden rounded-full mask-r-from-90%">
        <div className="flex items-center gap-1">
          {organizations.map((organization) => (
            <Button
              key={organization}
              size={"sm"}
              variant={"secondary"}
              className="rounded-full border border-primary/30 hover:border-primary/60"
            >
              {organization}
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
    parseAsStringLiteral<TEcocertSortingOptions["key"]>(sortKeys).withDefault(
      "date-created"
    )
  );

  const orderKeys: Array<TEcocertSortingOptions["order"]> = ["asc", "desc"];
  const [sortDirection, setSortDirection] = useQueryState(
    "order",
    parseAsStringLiteral<TEcocertSortingOptions["order"]>(
      orderKeys
    ).withDefault("desc")
  );

  return (
    <div className="flex items-center gap-2">
      <Combobox
        options={sortingOptions}
        value={sortKey}
        onChange={(value) => {
          const validatedValue = sortKeys.find((key) => key === value);
          setSortKey(validatedValue ?? "date-created");
        }}
        placeholder="Sort by"
        size={"sm"}
      />
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

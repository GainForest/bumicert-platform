"use client";

import { Search } from "lucide-react";
import { useMemo } from "react";
import {
  deserialize,
  SerializedSuperjson,
} from "gainforest-sdk/utilities/transform";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  parseAsString,
  parseAsStringLiteral,
  parseAsArrayOf,
  useQueryState,
} from "nuqs";
import type { AllOrganizationsPageData } from "../page";
import OrganizationCard from "./OrganizationCard";
import CountryCombobox from "./CountryCombobox";
import { useNavbarContext } from "@/components/global/Navbar/context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AllOrganizationsClientProps {
  serializedData: SerializedSuperjson<AllOrganizationsPageData>;
}

const sortOptions = ["bumicerts", "alphabetical", "newest", "oldest"] as const;
type SortOption = (typeof sortOptions)[number];

const AllOrganizationsClient = ({
  serializedData,
}: AllOrganizationsClientProps) => {
  const { viewport, openState } = useNavbarContext();
  const { organizations } = deserialize<AllOrganizationsPageData>(serializedData);

  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    parseAsString.withDefault("")
  );

  const [sortBy, setSortBy] = useQueryState(
    "sort",
    parseAsStringLiteral(sortOptions).withDefault("bumicerts")
  );

  const [selectedCountries, setSelectedCountries] = useQueryState(
    "countries",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const availableCountries = useMemo(() => {
    const countryCodes = new Set<string>();
    organizations.forEach((org) => {
      if (org.country) {
        countryCodes.add(org.country);
      }
    });
    return Array.from(countryCodes);
  }, [organizations]);

  const filteredOrganizations = useMemo(() => {
    let result = [...organizations];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (org) =>
          org.displayName.toLowerCase().includes(query) ||
          org.shortDescription.toLowerCase().includes(query)
      );
    }

    if (selectedCountries.length > 0) {
      result = result.filter((org) => selectedCountries.includes(org.country));
    }

    switch (sortBy) {
      case "bumicerts":
        result.sort((a, b) => b.bumicertCount - a.bumicertCount);
        break;
      case "alphabetical":
        result.sort((a, b) => a.displayName.localeCompare(b.displayName));
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [organizations, searchQuery, selectedCountries, sortBy]);

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-serif text-foreground">
          Organizations
        </h1>
        <p className="text-muted-foreground mt-2">
          Browse all public organizations creating positive environmental impact
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value || null)}
            className="pl-9"
          />
        </div>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bumicerts">Most Bumicerts</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>

        {availableCountries.length > 0 && (
          <div className="w-full sm:flex-1 sm:w-auto">
            <CountryCombobox
              availableCountries={availableCountries}
              selectedCountries={selectedCountries}
              onSelectionChange={(countries) =>
                setSelectedCountries(countries.length > 0 ? countries : null)
              }
            />
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredOrganizations.length} of {organizations.length}{" "}
        organizations
      </p>

      {filteredOrganizations.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No organizations found matching your criteria.
        </div>
      ) : (
        <div className={cn("grid grid-cols-1 gap-4", viewport === "mobile" ? "sm:grid-cols-2" : (openState.desktop ? "md:grid-cols-2 xl:grid-cols-3" : ""))}>
          {filteredOrganizations.map((organization, index) => (
            <motion.div
              key={organization.did}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ stiffness: 100, damping: 10, delay: Math.min(index * 0.05, 0.5) }}
              className="flex flex-col items-stretch justify-stretch"
            >
              <OrganizationCard organization={organization} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AllOrganizationsClient;

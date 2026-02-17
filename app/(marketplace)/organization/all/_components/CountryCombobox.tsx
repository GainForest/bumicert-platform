"use client";

import * as React from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";
import { countries } from "@/lib/countries";

interface CountryOption {
  code: string;
  name: string;
  emoji: string;
}

interface CountryComboboxProps {
  availableCountries: string[];
  selectedCountries: string[];
  onSelectionChange: (countries: string[]) => void;
}

const CountryCombobox = ({
  availableCountries,
  selectedCountries,
  onSelectionChange,
}: CountryComboboxProps) => {
  const countryOptions: CountryOption[] = React.useMemo(() => {
    return availableCountries
      .map((code) => {
        const country = countries[code];
        return country
          ? {
              code,
              name: country.name,
              emoji: country.emoji,
            }
          : null;
      })
      .filter((c): c is CountryOption => c !== null)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [availableCountries]);

  if (countryOptions.length === 0) return null;

  return (
    <Combobox
        items={countryOptions}
        itemToStringValue={(country) => `${country.emoji} ${country.name}`}
        multiple
        value={selectedCountries
          .map((code) => countryOptions.find((c) => c.code === code))
          .filter((c): c is CountryOption => c !== null)}
        onValueChange={(values) => {
          onSelectionChange(values.map((v) => v.code));
        }}
      >
        <ComboboxChips className="w-full">
          <ComboboxValue>
            {selectedCountries.map((code) => {
              const country = countryOptions.find((c) => c.code === code);
              if (!country) return null;
              return (
                <ComboboxChip key={code}>
                  {country.emoji} {country.name}
                </ComboboxChip>
              );
            })}
          </ComboboxValue>
          <ComboboxChipsInput placeholder="Filter by country..." />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxEmpty>No countries found.</ComboboxEmpty>
          <ComboboxList>
            {(country) => (
              <ComboboxItem key={country.code} value={country}>
                <span>{country.emoji}</span>
                <span>{country.name}</span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
    </Combobox>
  );
};

export default CountryCombobox;

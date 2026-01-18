import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModal } from "@/components/ui/modal/context";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { countries } from "@/lib/countries";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const allCountries = Object.entries(countries);

export const CountrySelectorModalId = "country-selector-modal";

const CountrySelectorModal = ({
  initialCountryCode,
  onCountryChange,
}: {
  initialCountryCode: string;
  onCountryChange: (country: string) => void;
}) => {
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const { popModal, stack, hide } = useModal();
  const handleDone = (country: string) => {
    onCountryChange(country);
    if (stack.length === 1) {
      hide().then(() => {
        popModal();
      });
    } else {
      popModal();
    }
  };

  const selectedCountryData =
    countryCode in countries ? countries[countryCode] : null;
  const [searchText, setSearchText] = useState("");
  const filteredCountries = allCountries.filter(([, countryData]) => {
    return countryData.name.toLowerCase().includes(searchText.toLowerCase());
  });

  useEffect(() => {
    setCountryCode(initialCountryCode);
  }, [initialCountryCode]);
  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>Select Country</ModalTitle>
        <ModalDescription>
          Select the country for your organization.
        </ModalDescription>
      </ModalHeader>
      <Input
        placeholder="Search country"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <div className="w-full h-full max-h-[max(45vh,500px)] overflow-y-auto mt-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Show the selected country on top if it exists */}
          {searchText === "" && selectedCountryData && (
            <CountryButton
              countryCode={countryCode}
              countryData={selectedCountryData}
              selectedCountry={countryCode}
              onClick={() => setCountryCode(countryCode)}
            />
          )}

          {/* Show the filtered countries */}
          {filteredCountries.map((c) => {
            return (
              <CountryButton
                key={c[0]}
                countryCode={c[0]}
                countryData={c[1]}
                selectedCountry={countryCode}
                onClick={() => setCountryCode(c[0])}
              />
            );
          })}
        </div>
      </div>

      <ModalFooter className="mt-4 flex justify-end">
        <Button onClick={() => handleDone(countryCode)}>Done</Button>
      </ModalFooter>
    </ModalContent>
  );
};

const CountryButton = ({
  countryCode,
  countryData,
  selectedCountry,
  onClick,
}: {
  countryCode: string;
  countryData: (typeof countries)[string];
  selectedCountry: string;
  onClick: () => void;
}) => {
  return (
    <Button
      variant={"secondary"}
      className={cn(
        "flex flex-col h-auto items-start justify-between gap-0 px-2 py-1 text-wrap border-2 border-transparent",
        countryCode === selectedCountry &&
          "border-primary text-primary bg-primary/10 hover:bg-primary/15"
      )}
      onClick={onClick}
    >
      <span className="text-2xl">{countryData.emoji}</span>
      <span className="text-base truncate">
        {countryData.name.length > 16
          ? countryData.name.slice(0, 16) + "..."
          : countryData.name}
      </span>
    </Button>
  );
};

export default CountrySelectorModal;

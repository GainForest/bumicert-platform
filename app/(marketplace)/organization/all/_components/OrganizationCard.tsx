"use client";

import { Building2, Globe, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { countries } from "@/lib/countries";
import type { OrganizationWithBumicertCount } from "../page";

interface OrganizationCardProps {
  organization: OrganizationWithBumicertCount;
}

const OrganizationCard = ({ organization }: OrganizationCardProps) => {
  const countryData = countries[organization.country];

  return (
    <Link
      href={`/organization/${encodeURIComponent(organization.did)}`}
      className="group flex-1 flex flex-col justify-between bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/50 p-2"
    >
      <div className="h-28 bg-muted rounded-t-lg p-3 relative flex flex-col justify-end overflow-hidden">
        {organization.coverImageUrl && (
          <Image src={organization.coverImageUrl} alt={organization.displayName} fill className="z-0 object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        {countryData && (
          <span className="flex items-center text-sm gap-1 absolute top-2 right-2 bg-background/50 backdrop-blur-sm rounded-full px-2 py-1">
            <span>{countryData.emoji}</span>
            {countryData.name}
          </span>
        )}
        <div className="flex flex-col gap-2 relative z-5">
          <div className="flex-shrink-0 w-10 h-10 rounded-full p-0.5 bg-muted flex items-center justify-center overflow-hidden">
            {organization.logoUrl ? (
              <Image
                src={organization.logoUrl}
                alt={organization.displayName}
                width={56}
                height={56}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Building2 className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {organization.displayName}
          </h3>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {organization.shortDescription}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {organization.objectives.length > 0 && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {organization.objectives[0]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
          <Leaf className="w-4 h-4" />
          <span>{organization.bumicertCount} Bumicerts</span>
        </div>
      </div>
    </Link>
  );
};

export default OrganizationCard;

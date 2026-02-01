"use client";

import { useAtprotoStore } from "@/components/stores/atproto";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { cn } from "@/lib/utils";
import { AppGainforestOrganizationInfo, OrgHypercertsDefs } from "climateai-sdk/lex-api";
import { getBlobUrl } from "climateai-sdk/utilities/atproto";
import { SerializedSuperjson, deserialize } from "climateai-sdk/utilities/transform";
import {
  ArrowUpRight,
  Building2,
  Calendar,
  ClipboardList,
  ExternalLink,
  FolderKanban,
  Globe,
  MapPin,
  Satellite,
  Users,
} from "lucide-react";
import { countries } from "@/lib/countries";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import DataWidget from "./DataWidget";
import { links } from "@/lib/links";

type ViewMode = "public" | "personal";

export type OrganizationPageData = {
  organizationInfo: AppGainforestOrganizationInfo.Record;
  bumicerts: { uri: string; value: { title?: string; name?: string } }[];
  projects: { uri: string; value: { title?: string } }[];
  sites: { uri: string; value: { name?: string } }[];
  layers: { uri: string; value: { title?: string; name?: string } }[];
};

interface OrganizationPageClientProps {
  did: string;
  serializedData: SerializedSuperjson<OrganizationPageData>;
}

const OrganizationPageClient = ({
  did,
  serializedData,
}: OrganizationPageClientProps) => {
  const { organizationInfo, bumicerts, projects, sites, layers } = deserialize(serializedData);
  const auth = useAtprotoStore((state) => state.auth);
  const [viewMode, setViewMode] = useState<ViewMode>("public");
  const [isClient, setIsClient] = useState(false);

  const isOwner =
    auth.status === "AUTHENTICATED" && auth.user.did === did;

  // Switch to personal view on client if user is the owner
  useEffect(() => {
    setIsClient(true);
    if (isOwner) {
      setViewMode("personal");
    }
  }, [isOwner]);

  // Get image URLs
  const coverImageUrl = organizationInfo.coverImage
    ? getBlobUrl(
        did,
        (organizationInfo.coverImage as OrgHypercertsDefs.SmallImage).image,
        allowedPDSDomains[0]
      )
    : null;

  const logoImageUrl = organizationInfo.logo
    ? getBlobUrl(
        did,
        (organizationInfo.logo as OrgHypercertsDefs.SmallImage).image,
        allowedPDSDomains[0]
      )
    : null;

  return (
    <div className="w-full">
      <Container>
        {/* Management Banner - Only shown to owner in personal view */}
        {isClient && isOwner && viewMode === "personal" && (
          <div className="border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="size-4" />
              <span>You are viewing your organization profile.</span>
            </div>
            <Link href={`/upload/organization/${did}`}>
              <Button size="sm" className="gap-2">
                Manage Organization
                <ArrowUpRight className="size-4" />
              </Button>
            </Link>
          </div>
        )}

        {/* Hero Section */}
        <div className={cn("w-full rounded-t-2xl overflow-hidden relative", viewMode === "personal" && "mt-4")}>
          {/* Cover Image */}
          <div className={cn("w-full relative", viewMode === "personal" ? "h-48" : "h-64")}>
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt="Cover Image"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

            {/* View Toggle - Only shown to owner on client, positioned top-right */}
            {isClient && isOwner && (
              <div className="absolute top-2 right-2 z-10 flex items-center gap-2 bg-background/80 p-1 rounded-xl">
                {/* <span className="text-sm text-foreground/70 ml-2 font-bold">View</span> */}
                <div className="flex items-center">
                  <button
                    onClick={() => setViewMode("public")}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5",
                      viewMode === "public"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Globe className="size-3.5" />
                    Public
                  </button>
                  <button
                    onClick={() => setViewMode("personal")}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5",
                      viewMode === "personal"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Users className="size-3.5" />
                    Personal
                  </button>
                </div>
              </div>
            )}

            {/* Profile Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end gap-4">
                {/* Logo */}
                <div className="size-20 rounded-xl bg-background border-2 border-background shadow-lg overflow-hidden flex-shrink-0">
                  {logoImageUrl ? (
                    <Image
                      src={logoImageUrl}
                      alt="Organization Logo"
                      width={80}
                      height={80}
                      className="object-cover size-full"
                    />
                  ) : (
                    <div className="size-full bg-muted flex items-center justify-center">
                      <Building2 className="size-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Name and Description */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl md:text-3xl font-bold font-serif truncate">
                    {organizationInfo.displayName || "Unnamed Organization"}
                  </h1>
                  {organizationInfo.shortDescription && (
                    <p className="mt-1 text-muted-foreground line-clamp-2 whitespace-pre-wrap">
                      {organizationInfo.shortDescription}
                    </p>
                  )}
                </div>
              </div>
        {/* Organization Metadata - Only shown in public view */}
        {viewMode === "public" && (
          <OrganizationMetadata organizationInfo={organizationInfo} />
        )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          <StatCard icon={ClipboardList} label="Bumicerts" count={bumicerts.length} />
          <StatCard icon={FolderKanban} label="Projects" count={projects.length} />
          <StatCard icon={MapPin} label="Sites" count={sites.length} />
          <StatCard icon={Satellite} label="Layers" count={layers.length} />
        </div>

        {/* About Section - Only shown in public view */}
        {viewMode === "public" && (
          <div className="mt-8">
            <h2 className="text-xl font-bold font-serif mb-4">About</h2>
            {organizationInfo.longDescription ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{organizationInfo.longDescription}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No detailed description available.
              </p>
            )}
          </div>
        )}

        {/* Data Widgets - Only shown in personal view */}

          <div className="grid grid-cols-2 gap-2 mt-4">
            <DataWidget
              title="Bumicerts"
              icon={ClipboardList}
              items={bumicerts.map((b) => ({
                text: b.value.title || b.value.name || "Unnamed Bumicert",
                href: links.upload.bumicerts(did),
              }))}
              viewAllHref={links.upload.bumicerts(did)}
              showManageCTA={viewMode === "personal"}
            />
            <DataWidget
              title="Projects"
              icon={FolderKanban}
              items={projects.map((p) => ({
                text: p.value.title || "Untitled Project",
                href: links.upload.projects(did),
              }))}
              viewAllHref={links.upload.projects(did)}
              showManageCTA={viewMode === "personal"}
            />
            <DataWidget
              title="Sites"
              icon={MapPin}
              items={sites.map((s) => ({
                text: s.value.name || "Unnamed Site",
                href: links.upload.sites(did),
              }))}
              viewAllHref={links.upload.sites(did)}
              showManageCTA={viewMode === "personal"}
            />
            <DataWidget
              title="Layers"
              icon={Satellite}
              items={layers.map((l) => ({
                text: l.value.title || l.value.name || "Unnamed Layer",
                href: links.upload.layers(did),
              }))}
              viewAllHref={links.upload.layers(did)}
              showManageCTA={viewMode === "personal"}
            />
          </div>

        <div className="pb-8" />
      </Container>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  count,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
}) => (
  <div className="bg-muted rounded-xl p-4 flex items-center gap-4 relative">
    <div>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
    <Icon className="size-8 text-primary opacity-50 absolute top-2 right-2" />
  </div>
);

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

const OrganizationMetadata = ({
  organizationInfo,
}: {
  organizationInfo: AppGainforestOrganizationInfo.Record;
}) => {
  const countryData = organizationInfo.country
    ? countries[organizationInfo.country]
    : null;
  const formattedDate = formatDate(organizationInfo.startDate ?? undefined);
  const website = organizationInfo.website;

  const hasAnyData = countryData || formattedDate || website;

  if (!hasAnyData) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
      {countryData && (
        <div className="flex items-center gap-1.5">
          <span className="text-base">{countryData.emoji}</span>
          <span>{countryData.name}</span>
        </div>
      )}
      {formattedDate && (
        <div className="flex items-center gap-1.5">
          <Calendar className="size-4" />
          <span>Since {formattedDate}</span>
        </div>
      )}
      {website && (
        <Link
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <ExternalLink className="size-4" />
          <span>{website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
        </Link>
      )}
    </div>
  );
};

export default OrganizationPageClient;

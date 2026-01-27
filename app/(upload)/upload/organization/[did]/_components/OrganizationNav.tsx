"use client";

import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { links } from "@/lib/links";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Overview", href: (did: string) => links.upload.organization(did) },
  { label: "Projects", href: (did: string) => links.upload.projects(did) },
  { label: "Sites", href: (did: string) => links.upload.sites(did) },
  { label: "Layers", href: (did: string) => links.upload.layers(did) },
  { label: "Bumicerts", href: (did: string) => links.upload.bumicerts(did) },
];

export const OrganizationHeaderNav = () => {
  const pathname = usePathname();
  const params = useParams();
  const did = params.did as string;

  if (!did) return null;

  return (
    <div className="flex items-center gap-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Organization" },
        ]}
      />
      
      {/* Divider */}
      <div className="h-4 w-px bg-border/50" />
      
      {/* Tabs */}
      <nav className="flex items-center gap-1">
        {tabs.map((tab) => {
          const href = tab.href(did);
          const isActive = pathname === href;
          
          return (
            <Link
              key={tab.label}
              href={href}
              className={cn(
                "px-2.5 py-1 text-sm rounded-md transition-colors",
                isActive
                  ? "text-foreground bg-foreground/5 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Map route segments to human-readable labels
const segmentLabels: Record<string, string> = {
  explore: "Explore",
  bumicert: "Bumicerts",
  create: "Create",
  organization: "Organization",
  user: "User",
  changelog: "Changelog",
};

/**
 * Auto-generates breadcrumbs from pathname, or uses custom items if provided
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Use custom items if provided, otherwise generate from pathname
  const breadcrumbItems: BreadcrumbItem[] = items || generateBreadcrumbs(pathname);

  // Don't show breadcrumbs for home page or if only one item
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center gap-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight 
                  className="size-3 text-foreground/20" 
                  strokeWidth={1.5} 
                />
              )}
              {isLast || !item.href ? (
                <span className="text-sm text-foreground/70">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [];

  // Always start with Home
  items.push({ label: "Home", href: "/" });

  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Skip route group segments like (marketplace)
    if (segment.startsWith("(") && segment.endsWith(")")) {
      continue;
    }

    // Get human-readable label
    let label = segmentLabels[segment] || formatSegment(segment);

    // For dynamic segments (DIDs, IDs), use a shorter label
    if (segment.startsWith("did:")) {
      label = "Profile";
    } else if (segment.includes("-") && segment.length > 20) {
      // Likely a bumicert ID or similar
      label = "Details";
    }

    items.push({
      label,
      href: currentPath,
    });
  }

  return items;
}

function formatSegment(segment: string): string {
  // Convert kebab-case or camelCase to Title Case
  return segment
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default Breadcrumbs;

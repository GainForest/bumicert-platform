"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronUp, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import useIsMounted from "@/hooks/use-is-mounted";
import { useAtprotoStore } from "@/components/stores/atproto";
import { NavLinkConfig, NavLinkLeaf } from "./types";
import { links } from "@/lib/links";
import packageJson from "@/package.json";

export type DesktopNavbarProps = {
  navLinks: NavLinkConfig[];
  footerLinks: {
    href: string;
    text: string;
  }[];
  title?: string;
};

function isLeafActive(
  leaf: NavLinkLeaf,
  pathname: string,
  did?: string
): boolean {
  if (leaf.id === "my-organization") {
    if (did) {
      return pathname.startsWith(links.myOrganization(did));
    }
    return pathname === links.myOrganization();
  }

  if ("equals" in leaf.pathCheck) {
    const targetPath =
      typeof leaf.pathCheck.equals === "function"
        ? leaf.pathCheck.equals(did)
        : leaf.pathCheck.equals;
    return pathname === targetPath;
  }

  const targetPath =
    typeof leaf.pathCheck.startsWith === "function"
      ? leaf.pathCheck.startsWith(did)
      : leaf.pathCheck.startsWith;
  return pathname.startsWith(targetPath);
}

const DesktopNavbar = ({
  navLinks,
  footerLinks,
  title = "Bumicerts",
}: DesktopNavbarProps) => {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();
  const pathname = usePathname();
  const auth = useAtprotoStore((state) => state.auth);
  const did = auth.user?.did;

  const isHome = title === "Bumicerts";

  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const expandedOrderRef = useRef<string[]>([]);

  const isChildActive = useCallback(
    (group: NavLinkConfig) => {
      if (!group.children) return false;
      return group.children.some((child) => isLeafActive(child, pathname, did));
    },
    [pathname, did]
  );

  // Auto-expand groups with active children on pathname change
  useEffect(() => {
    const activeGroupIds = navLinks
      .filter((link) => link.children && isChildActive(link))
      .map((link) => link.id);

    setExpandedGroups((prev) => {
      const merged = new Set([...prev, ...activeGroupIds]);
      const result = Array.from(merged);
      expandedOrderRef.current = result;
      return result;
    });
  }, [pathname, did, navLinks, isChildActive]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      if (prev.includes(groupId)) {
        // Collapse
        const next = prev.filter((id) => id !== groupId);
        expandedOrderRef.current = next;
        return next;
      }

      // Expand
      let next = [...prev, groupId];

      // If more than 2 expanded, collapse the oldest non-active group
      if (next.length > 2) {
        const toCollapse = expandedOrderRef.current.find((id) => {
          const group = navLinks.find((l) => l.id === id);
          return group && !isChildActive(group);
        });
        if (toCollapse) {
          next = next.filter((id) => id !== toCollapse);
        } else {
          // All have active children — collapse the oldest anyway
          next = next.slice(1);
        }
      }

      expandedOrderRef.current = next;
      return next;
    });
  };

  return (
    <nav className={cn("w-[240px] p-4 flex flex-col justify-between")}>
      {/* Top Section */}
      <div className="flex flex-col gap-2">
        {/* Header */}
        <Link
          href="/"
          className="group hover:scale-105 transition-all duration-300 origin-left"
        >
          <div
            className={cn(
              "h-12 w-12 border border-border rounded-xl shadow-lg bg-background flex items-center justify-center gap-1",
              !isHome && "h-8 w-fit px-1 pr-4"
            )}
          >
            {!isHome && (
              <div className="group-hover:bg-primary text-muted-foreground group-hover:text-primary-foreground transition-all duration-300 rounded-full p-1">
                <ChevronLeft className="size-4" />
              </div>
            )}
            <div className="flex items-center gap-0">
              <Image
                src="/assets/media/images/logo.svg"
                alt={title}
                width={isHome ? 32 : 24}
                height={isHome ? 32 : 24}
              />
              {!isHome && <span className="font-medium">Home</span>}
            </div>
          </div>
        </Link>
        <b
          className={cn(
            "font-serif text-2xl drop-shadow-lg",
            !isHome && "mt-4"
          )}
        >
          {title}
        </b>

        {/* Nav Links */}
        <ul className="mt-2 flex flex-col gap-1">
          {navLinks.map((link) => {
            // Group item
            if (link.children) {
              const isExpanded = expandedGroups.includes(link.id);
              const hasActiveChild = isChildActive(link);
              const parentHighlighted = !isExpanded && hasActiveChild;

              return (
                <li key={link.id} className="w-full flex flex-col gap-0.5">
                  <button
                    onClick={() => toggleGroup(link.id)}
                    className="w-full"
                  >
                    <Button
                      variant={parentHighlighted ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full text-left justify-start relative overflow-hidden cursor-pointer",
                        !parentHighlighted && "hover:bg-background",
                        !parentHighlighted && hasActiveChild && "bg-foreground/10"
                      )}
                      asChild
                    >
                      <span>
                        {parentHighlighted && (
                          <div className="absolute left-0.5 top-2 bottom-2 w-0.5 bg-primary-foreground/50 rounded-full" />
                        )}
                        {!parentHighlighted && hasActiveChild && (
                          <div className="absolute left-0.5 top-2 bottom-2 w-0.5 bg-primary/50 rounded-full" />
                        )}
                        <link.Icon
                          size={16}
                          className={cn(
                            "text-primary/70",
                            parentHighlighted && "text-primary-foreground/80"
                          )}
                        />
                        <span className="flex-1">{link.text}</span>
                        {isExpanded ? (
                          <ChevronUp size={14} className={cn("text-muted-foreground", parentHighlighted && "text-primary-foreground/60")} />
                        ) : (
                          <ChevronDown size={14} className={cn("text-muted-foreground", parentHighlighted && "text-primary-foreground/60")} />
                        )}
                      </span>
                    </Button>
                  </button>

                  {/* Children */}
                  {isExpanded && (
                    <div className="ml-5 flex flex-col gap-0.5">
                      {link.children.map((child) => {
                        const isHighlighted = isLeafActive(child, pathname, did);
                        const href =
                          typeof child.href === "function"
                            ? child.href(did)
                            : child.href;

                        return (
                          <Link href={href} key={child.id} className="w-full">
                            <Button
                              variant={isHighlighted ? "default" : "ghost"}
                              size="sm"
                              className={cn(
                                "w-full text-left justify-start relative overflow-hidden cursor-pointer",
                                !isHighlighted && "hover:bg-background"
                              )}
                            >
                              {isHighlighted && (
                                <div className="absolute left-0.5 top-2 bottom-2 w-0.5 bg-primary-foreground/50 rounded-full" />
                              )}
                              <child.Icon
                                size={16}
                                className={cn(
                                  "text-primary/70",
                                  isHighlighted && "text-primary-foreground/80"
                                )}
                              />
                              <span>{child.text}</span>
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            }

            // Leaf item
            const isHighlighted = isLeafActive(link, pathname, did);
            const href =
              typeof link.href === "function" ? link.href(did) : link.href;

            return (
              <li key={link.id} className="w-full">
                <Link href={href} className="w-full">
                  <Button
                    variant={isHighlighted ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full text-left justify-start relative overflow-hidden cursor-pointer",
                      !isHighlighted && "hover:bg-background "
                    )}
                  >
                    {isHighlighted && (
                      <div className="absolute left-0.5 top-2 bottom-2 w-0.5 bg-primary-foreground/50 rounded-full" />
                    )}
                    <link.Icon
                      size={16}
                      className={cn(
                        "text-primary/70",
                        isHighlighted && "text-primary-foreground/80"
                      )}
                    />
                    <span>{link.text}</span>
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-2">
        {/* Footer */}
        <div className="flex flex-col">
          <ul className="flex flex-col">
            {footerLinks.map((link) => {
              const isInternal = link.href.startsWith("/");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={isInternal ? undefined : "_blank"}
                    className="cursor-pointer"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer hover:bg-background hover:shadow-md w-full text-left justify-between"
                    >
                      <span>{link.text}</span>
                      <ArrowUpRight size={16} className="text-primary" />
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <hr />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-semibold">
            v{packageJson.version}
          </span>
          <div className="flex items-center gap-1">
            <Sun className="size-3" />
            {isMounted && (
              <Switch
                checked={theme === "dark"}
                onCheckedChange={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
              />
            )}
            <Moon className="size-3" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavbar;

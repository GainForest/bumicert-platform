"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import useIsMounted from "@/hooks/use-is-mounted";
import { useAtprotoStore } from "@/components/stores/atproto";
import { NavLinkConfig, NavLinkLeaf } from "./types";
import { links } from "@/lib/links";
import packageJson from "@/package.json";
import { useNavbarContext } from "./context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

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
  const { openState, setOpenState } = useNavbarContext();
  const isCollapsed = !openState.desktop;

  const [expandedGroups, setExpandedGroups] = useState<string[]>(() =>
    navLinks.filter((link) => link.children).map((link) => link.id)
  );
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
    <nav
      className={cn(
        "flex flex-col justify-between p-3 transition-all duration-200 ease-in-out overflow-hidden shrink-0 bg-transparent",
        isCollapsed ? "w-16" : "w-[240px]"
      )}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-2">
        {/* Header: logo + title in same line */}
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setOpenState(true, "desktop")}
                className="flex flex-col items-center justify-center gap-1 mx-auto h-auto py-2 px-2"
              >
                <Image
                  src="/assets/media/images/logo.svg"
                  alt={title}
                  width={20}
                  height={20}
                  className="shrink-0 opacity-80"
                />
                <ChevronRight size={12} strokeWidth={1.5} className="text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand sidebar</TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <Image
                src="/assets/media/images/logo.svg"
                alt={title}
                width={20}
                height={20}
                className="shrink-0 opacity-80"
              />
              <h1 className="font-serif text-xl font-semibold text-foreground whitespace-nowrap">
                {title}
              </h1>
            </Link>
            {/* Collapse button — only when expanded */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setOpenState(false, "desktop")}
                  className="p-1 text-muted-foreground/60 hover:text-muted-foreground transition-colors shrink-0"
                >
                  <ChevronLeft size={14} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Collapse sidebar</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Nav Links */}
        <ul className="mt-2 flex flex-col gap-1">
          {navLinks.map((link) => {
            // Group item
            if (link.children) {
              const isExpanded = expandedGroups.includes(link.id);
              const hasActiveChild = isChildActive(link);
              const parentHighlighted = !isExpanded && hasActiveChild;

              if (isCollapsed) {
                // Collapsed: show icon-only, clicking expands the sidebar
                return (
                  <li key={link.id} className="w-full">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setOpenState(true, "desktop")}
                          className={cn(
                            "w-8 h-8 rounded-md flex items-center justify-center mx-auto transition-colors",
                            parentHighlighted
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-foreground/5 text-foreground"
                          )}
                        >
                          <link.Icon
                            size={16}
                            className={cn(
                              "text-primary/70",
                              parentHighlighted && "text-primary-foreground/80"
                            )}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">{link.text}</TooltipContent>
                    </Tooltip>
                  </li>
                );
              }

              return (
                <li key={link.id} className="w-full flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => toggleGroup(link.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors relative overflow-hidden",
                      parentHighlighted
                        ? "bg-primary text-primary-foreground"
                        : hasActiveChild
                        ? "bg-foreground/10 hover:bg-foreground/5"
                        : "hover:bg-foreground/5 text-foreground"
                    )}
                  >
                    {parentHighlighted && (
                      <div className="absolute left-0.5 top-2 bottom-2 w-0.5 bg-primary-foreground/50 rounded-full" />
                    )}
                    {!parentHighlighted && hasActiveChild && (
                      <div className="absolute left-0.5 top-2 bottom-2 w-0.5 bg-primary/50 rounded-full" />
                    )}
                    <link.Icon
                      size={16}
                      className={cn(
                        "text-primary/70 shrink-0",
                        parentHighlighted && "text-primary-foreground/80"
                      )}
                    />
                    <span className="flex-1 text-left">{link.text}</span>
                    {isExpanded ? (
                      <ChevronUp
                        size={14}
                        className={cn(
                          "text-muted-foreground shrink-0",
                          parentHighlighted && "text-primary-foreground/60"
                        )}
                      />
                    ) : (
                      <ChevronDown
                        size={14}
                        className={cn(
                          "text-muted-foreground shrink-0",
                          parentHighlighted && "text-primary-foreground/60"
                        )}
                      />
                    )}
                  </button>

                  {/* Children */}
                  {isExpanded && (
                    <div className="ml-5 flex flex-col gap-0.5">
                      {link.children.map((child) => {
                        const isHighlighted = isLeafActive(
                          child,
                          pathname,
                          did
                        );
                        const href =
                          typeof child.href === "function"
                            ? child.href(did)
                            : child.href;

                        return (
                          <Link href={href} key={child.id} className="w-full">
                            <div
                              className={cn(
                                "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors relative overflow-hidden cursor-pointer",
                                isHighlighted
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-foreground/5 text-foreground"
                              )}
                            >
                              {isHighlighted && (
                                <div className="absolute left-0.5 top-2 bottom-2 w-0.5 bg-primary-foreground/50 rounded-full" />
                              )}
                              <child.Icon
                                size={16}
                                className={cn(
                                  "text-primary/70 shrink-0",
                                  isHighlighted && "text-primary-foreground/80"
                                )}
                              />
                              <span>{child.text}</span>
                            </div>
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

            if (isCollapsed) {
              return (
                <li key={link.id} className="w-full">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={href} className="w-full flex justify-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                            isHighlighted
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-foreground/5 text-foreground"
                          )}
                        >
                          <link.Icon
                            size={16}
                            className={cn(
                              "text-primary/70",
                              isHighlighted && "text-primary-foreground/80"
                            )}
                          />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{link.text}</TooltipContent>
                  </Tooltip>
                </li>
              );
            }

            return (
              <li key={link.id} className="w-full">
                <Link href={href} className="w-full">
                  <div
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors relative overflow-hidden cursor-pointer",
                      isHighlighted
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-foreground/5 text-foreground"
                    )}
                  >
                    {isHighlighted && (
                      <div className="absolute left-0.5 top-2 bottom-2 w-0.5 bg-primary-foreground/50 rounded-full" />
                    )}
                    <link.Icon
                      size={16}
                      className={cn(
                        "text-primary/70 shrink-0",
                        isHighlighted && "text-primary-foreground/80"
                      )}
                    />
                    <span>{link.text}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-2">
        {/* Footer links — hidden when collapsed */}
        {!isCollapsed && (
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
                      <div className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm hover:bg-foreground/5 transition-colors cursor-pointer">
                        <span>{link.text}</span>
                        <ArrowUpRight size={16} className="text-primary" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <hr />
        {/* Theme toggle */}
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
                className="w-8 h-8 rounded-md flex items-center justify-center mx-auto hover:bg-foreground/5 transition-colors text-muted-foreground"
              >
                {isMounted ? (
                  theme === "dark" ? (
                    <Moon className="size-4" />
                  ) : (
                    <Sun className="size-4" />
                  )
                ) : (
                  <Sun className="size-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Toggle theme</TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              {isMounted ? (
                theme === "dark" ? (
                  <Moon className="size-4" />
                ) : (
                  <Sun className="size-4" />
                )
              ) : (
                <Sun className="size-4" />
              )}
              <span className="text-xs">
                {isMounted
                  ? theme === "dark"
                    ? "Dark"
                    : "Light"
                  : "Light"}
              </span>
            </div>
            {isMounted && (
              <Switch
                checked={theme === "dark"}
                onCheckedChange={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
              />
            )}
          </div>
        )}
        {/* Version — hidden when collapsed */}
        {!isCollapsed && (
          <span className="text-muted-foreground text-xs font-semibold px-1">
            v{packageJson.version}
          </span>
        )}

      </div>
    </nav>
  );
};

export default DesktopNavbar;

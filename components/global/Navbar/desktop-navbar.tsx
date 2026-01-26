"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import useIsMounted from "@/hooks/use-is-mounted";
import { useAtprotoStore } from "@/components/stores/atproto";
import { NavLinkConfig } from "./types";
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

  return (
    <nav className={cn("w-[240px] p-4 flex flex-col justify-between bg-background/50")}>
      {/* Top Section */}
      <div className="flex flex-col gap-2">
        {/* Header */}
        <Link
          href="/"
          className="group flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div
            className={cn(
              "h-10 w-10 border border-border/60 rounded-lg bg-background flex items-center justify-center shrink-0",
              !isHome && "h-8 w-8"
            )}
          >
            <Image
              src="/assets/media/images/logo.svg"
              alt={title}
              width={isHome ? 24 : 20}
              height={isHome ? 24 : 20}
              className="opacity-90"
            />
          </div>
          {!isHome && (
            <div className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground transition-colors">
              <ChevronLeft className="size-4" />
              <span className="text-sm">Home</span>
            </div>
          )}
        </Link>
        <h1
          className={cn(
            "font-serif text-xl font-medium tracking-tight text-foreground",
            !isHome && "mt-4"
          )}
        >
          {title}
        </h1>

        {/* Nav Links */}
        <ul className="mt-3 flex flex-col gap-0.5">
          {navLinks.map((link) => {
            let isHighlighted = false;

            if ("equals" in link.pathCheck) {
              const targetPath =
                typeof link.pathCheck.equals === "function"
                  ? link.pathCheck.equals(did)
                  : link.pathCheck.equals;
              isHighlighted = pathname === targetPath;
            } else {
              const targetPath =
                typeof link.pathCheck.startsWith === "function"
                  ? link.pathCheck.startsWith(did)
                  : link.pathCheck.startsWith;
              isHighlighted = pathname.startsWith(targetPath);
            }

            // Special case for my organization link
            if (link.id === "my-organization") {
              if (did) {
                isHighlighted = pathname.startsWith(links.myOrganization(did));
              } else {
                isHighlighted = pathname === links.myOrganization();
              }
            }

            const href =
              typeof link.href === "function" ? link.href(did) : link.href;

            return (
              <li key={link.id} className="w-full">
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                    isHighlighted
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <link.Icon
                    size={16}
                    className={cn(
                      isHighlighted ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span>{link.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-3">
        {/* Footer Links */}
        <div className="flex flex-col gap-0.5">
          {footerLinks.map((link) => {
            const isInternal = link.href.startsWith("/");
            return (
              <Link
                key={link.href}
                href={link.href}
                target={isInternal ? undefined : "_blank"}
                rel={isInternal ? undefined : "noopener noreferrer"}
                className="flex items-center justify-between px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50"
              >
                <span>{link.text}</span>
                <ArrowUpRight size={14} className="text-primary/60" />
              </Link>
            );
          })}
        </div>
        <div className="h-px bg-border/60" />
        <div className="flex items-center justify-between px-1">
          <span className="text-muted-foreground text-[11px] tracking-wide">
            v{packageJson.version}
          </span>
          <div className="flex items-center gap-1.5">
            <Sun className="size-3 text-muted-foreground" />
            {isMounted && (
              <Switch
                checked={theme === "dark"}
                onCheckedChange={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
              />
            )}
            <Moon className="size-3 text-muted-foreground" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavbar;

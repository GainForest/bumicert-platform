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
  title = "Bumicertain",
}: DesktopNavbarProps) => {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();
  const pathname = usePathname();
  const auth = useAtprotoStore((state) => state.auth);
  const did = auth.user?.did;

  const isHome = title === "Bumicertain";

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
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
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
            v0.1.0
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

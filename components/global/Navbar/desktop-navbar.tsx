"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import useIsMounted from "@/hooks/use-is-mounted";
import { useAtprotoStore } from "@/components/stores/atproto";
import { NavLinkConfig } from "./types";

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
  title = "Ecocertain",
}: DesktopNavbarProps) => {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();
  const pathname = usePathname();
  const auth = useAtprotoStore((state) => state.auth);
  const did = auth.user?.did;

  return (
    <nav className={cn("w-[240px] p-4 flex flex-col justify-between")}>
      {/* Top Section */}
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="h-12 w-12 border border-border rounded-xl shadow-lg bg-background flex items-center justify-center">
          <Image
            src="/assets/media/images/logo.svg"
            alt={title}
            width={32}
            height={32}
          />
        </div>
        <b className="font-serif text-2xl drop-shadow-lg">{title}</b>

        {/* Nav Links */}
        <ul className="mt-2 flex flex-col gap-1">
          {navLinks.map((link) => {
            let isHighlighted = false;

            if ("equals" in link.pathCheck) {
              isHighlighted = pathname === link.pathCheck.equals;
              // Special case for organization link
              if (link.id === "organization" && did && !isHighlighted) {
                isHighlighted = pathname.startsWith(`/organization/${did}`);
              }
            } else {
              isHighlighted = pathname.startsWith(link.pathCheck.startsWith);
            }

            return (
              <li key={link.id} className="w-full">
                <Link href={link.href} className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-full text-left justify-start relative overflow-hidden",
                      isHighlighted && "bg-accent hover:bg-accent"
                    )}
                  >
                    {isHighlighted && (
                      <div className="absolute left-0.5 top-2 bottom-2 w-0.5 bg-primary rounded-full" />
                    )}
                    <link.Icon
                      size={16}
                      className={cn(
                        "text-primary/70",
                        isHighlighted && "text-primary"
                      )}
                    />
                    <span
                      className={cn(
                        isHighlighted && "text-primary font-semibold"
                      )}
                    >
                      {link.text}
                    </span>
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

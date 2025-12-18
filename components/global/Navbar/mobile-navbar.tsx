"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Menu, UserX2, X } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { useNavbarContext } from "./context";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NavLinkConfig } from "./types";

export type MobileNavbarProps = {
  navLinks: NavLinkConfig[];
  footerLinks: {
    href: string;
    text: string;
  }[];
};

const MobileNavbar = ({ navLinks, footerLinks }: MobileNavbarProps) => {
  const { openState, setOpenState } = useNavbarContext();
  const [parent] = useAutoAnimate();
  return (
    <div className="flex flex-col gap-2 w-full" ref={parent}>
      <div className="w-full flex items-center justify-between p-2 relative">
        <span className="font-serif absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center text-primary text-lg font-bold">
          Ecocertain
        </span>
        <Button variant={"outline"} size={"sm"} onClick={() => setOpenState()}>
          {openState.mobile ? <X /> : <Menu />}
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          className="h-8 w-8 rounded-full"
        >
          <UserX2 className="size-4 text-muted-foreground" />
        </Button>
      </div>
      {openState.mobile && (
        <div className="flex flex-col gap-2 w-full mb-2">
          <div className="flex items-center justify-center flex-wrap gap-1">
            {navLinks.map((link) => {
              return (
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  key={link.id}
                  className="flex flex-col gap-1 items-center h-auto min-w-16 p-1"
                >
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <link.Icon className="size-4 text-primary-foreground" />
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-md",
                      link.id === "explore" &&
                        "bg-primary text-primary-foreground"
                    )}
                  >
                    {link.text}
                  </span>
                </Button>
              );
            })}
          </div>
          <div className="flex items-center justify-center flex-wrap gap-2">
            {footerLinks.map((link) => {
              return (
                <Button
                  variant={"outline"}
                  size={"sm"}
                  key={link.href}
                  className="rounded-full text-xs h-7"
                >
                  {link.text}
                  <ArrowUpRight className="size-3" />
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;

"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Menu, UserX2, X } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { useNavbarContext } from "./context";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NavLinkConfig } from "./types";
import { usePathname } from "next/navigation";
import { useAtprotoStore } from "@/components/stores/atproto";
import Link from "next/link";

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
  const pathname = usePathname();
  const auth = useAtprotoStore((state) => state.auth);
  const did = auth.user?.did;

  return (
    <div className="flex flex-col gap-2 w-full" ref={parent}>
      <div className="w-full flex items-center justify-between p-2 relative">
        <span className="font-serif absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center text-primary text-lg font-bold">
          Bumicertain
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
              let isHighlighted = false;

              if ("equals" in link.pathCheck) {
                const targetPath =
                  typeof link.pathCheck.equals === "function"
                    ? link.pathCheck.equals(did)
                    : link.pathCheck.equals;
                isHighlighted = pathname === targetPath;
                // Special case for organization link
                if (link.id === "organization" && did && !isHighlighted) {
                  isHighlighted = pathname.startsWith(`/organization/${did}`);
                }
              } else {
                const targetPath =
                  typeof link.pathCheck.startsWith === "function"
                    ? link.pathCheck.startsWith(did)
                    : link.pathCheck.startsWith;
                isHighlighted = pathname.startsWith(targetPath);
              }

              const href =
                typeof link.href === "function" ? link.href(did) : link.href;

              return (
                <Link href={href} key={link.id} className="w-auto">
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="flex flex-col gap-1 items-center h-auto min-w-16 p-1"
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center shadow-lg",
                        isHighlighted ? "bg-primary" : "bg-primary/10"
                      )}
                    >
                      <link.Icon
                        className={cn(
                          "size-4",
                          isHighlighted
                            ? "text-primary-foreground"
                            : "text-primary"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-md",
                        isHighlighted && "bg-primary text-primary-foreground"
                      )}
                    >
                      {link.text}
                    </span>
                  </Button>
                </Link>
              );
            })}
          </div>
          <div className="flex items-center justify-center flex-wrap gap-2">
            {footerLinks.map((link) => {
              return (
                <Link
                  href={link.href}
                  target="_blank"
                  key={link.href}
                  className="cursor-pointer"
                >
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="rounded-full text-xs h-7"
                  >
                    {link.text}
                    <ArrowUpRight className="size-3" />
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;

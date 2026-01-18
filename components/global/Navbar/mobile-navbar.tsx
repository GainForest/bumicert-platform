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
import UserAvatar from "@/components/user-avatar";
import { AnimatePresence, motion } from "framer-motion";
import { useModal } from "@/components/ui/modal/context";
import { ProfileModal, ProfileModalId } from "../modals/profile";
import AuthModal, { AuthModalId } from "../modals/auth";
import { links } from "@/lib/links";

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

  const { show, popModal, pushModal } = useModal();

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex items-center justify-between p-2 relative">
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} size={"sm"} onClick={() => setOpenState()}>
            {openState.mobile ? <X /> : <Menu />}
          </Button>
          <span className="font-serif text-primary text-lg font-bold">
            Bumicertain
          </span>
        </div>

        <Button
          variant={"outline"}
          size={"sm"}
          className={cn(
            "absolute right-2 top-2 h-8 w-8 rounded-full transition-all duration-300",
            openState.mobile &&
              "h-20 w-20 translate-y-8 right-[50%] translate-x-[calc(5rem-50%)]"
          )}
          onClick={() => {
            setOpenState(false);
            pushModal(
              {
                id: did ? ProfileModalId : AuthModalId,
                content: did ? <ProfileModal /> : <AuthModal />,
              },
              true
            );
            show();
          }}
        >
          {did ? (
            <UserAvatar
              className="transition-all duration-300"
              did={did as `did:plc:${string}`}
              size={openState.mobile ? "calc(5rem - 12px)" : "calc(2rem - 6px)"}
            />
          ) : (
            <UserX2
              className={cn(
                "size-4 text-muted-foreground transition-all duration-300",
                openState.mobile && "size-8"
              )}
            />
          )}
        </Button>
      </div>
      <div
        className={cn(
          "flex items-center justify-center transition-all duration-300",
          openState.mobile && "h-20"
        )}
      ></div>
      <div className="w-full flex flex-col" ref={parent}>
        {openState.mobile && (
          <div className="mt-2 flex flex-col gap-2 w-full mb-2">
            <div className="grid grid-cols-1 min-[28rem]:grid-cols-2 px-4 py-1 gap-1 min-[28rem]:gap-2">
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
                    isHighlighted = pathname.startsWith(
                      links.myOrganization(did)
                    );
                  } else {
                    isHighlighted = pathname === links.myOrganization();
                  }
                }

                const href =
                  typeof link.href === "function" ? link.href(did) : link.href;

                return (
                  <Link href={href} key={link.id} className="w-auto">
                    <Button
                      variant={isHighlighted ? "default" : "outline"}
                      size={"lg"}
                      className={cn(
                        "w-full flex justify-start px-1 h-10 rounded-lg text-md",
                        !isHighlighted &&
                          "bg-primary/10 border-none shadow-none"
                      )}
                    >
                      <link.Icon
                        className={cn(
                          "size-5",
                          isHighlighted
                            ? "text-primary-foreground"
                            : "text-primary"
                        )}
                      />
                      <span>{link.text}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
            <hr />
            <div className="flex flex-col px-5">
              <span className="text-muted-foreground text-sm font-medium">
                Links
              </span>
              <div className="flex items-center flex-wrap gap-2 mt-1">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNavbar;

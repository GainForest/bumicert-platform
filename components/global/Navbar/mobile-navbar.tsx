"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronDown, ChevronUp, Menu, UserX2, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useNavbarContext } from "./context";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NavLinkConfig, NavLinkLeaf } from "./types";
import { usePathname } from "next/navigation";
import { useAtprotoStore } from "@/components/stores/atproto";
import Link from "next/link";
import UserAvatar from "@/components/user-avatar";
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

const MobileNavbar = ({ navLinks, footerLinks }: MobileNavbarProps) => {
  const { openState, setOpenState } = useNavbarContext();
  const [parent] = useAutoAnimate();
  const pathname = usePathname();
  const auth = useAtprotoStore((state) => state.auth);
  const did = auth.user?.did;

  const { show, popModal, pushModal } = useModal();

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
        const next = prev.filter((id) => id !== groupId);
        expandedOrderRef.current = next;
        return next;
      }

      let next = [...prev, groupId];

      if (next.length > 2) {
        const toCollapse = expandedOrderRef.current.find((id) => {
          const group = navLinks.find((l) => l.id === id);
          return group && !isChildActive(group);
        });
        if (toCollapse) {
          next = next.filter((id) => id !== toCollapse);
        } else {
          next = next.slice(1);
        }
      }

      expandedOrderRef.current = next;
      return next;
    });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex items-center justify-between p-2 relative">
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} size={"sm"} onClick={() => setOpenState()}>
            {openState.mobile ? <X /> : <Menu />}
          </Button>
          <span className="font-serif text-primary text-lg font-bold">
            Bumicerts
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
                // Group item
                if (link.children) {
                  const isExpanded = expandedGroups.includes(link.id);
                  const hasActiveChild = isChildActive(link);
                  const parentHighlighted = !isExpanded && hasActiveChild;

                  return (
                    <div key={link.id} className="flex flex-col gap-1 min-[28rem]:col-span-2">
                      <button
                        onClick={() => toggleGroup(link.id)}
                        className="w-full"
                      >
                        <Button
                          variant={parentHighlighted ? "default" : "outline"}
                          size={"lg"}
                          className={cn(
                            "w-full flex justify-between px-1 h-10 rounded-lg text-md",
                            !parentHighlighted &&
                              "bg-primary/10 border-none shadow-none",
                            !parentHighlighted && hasActiveChild && "bg-foreground/10"
                          )}
                          asChild
                        >
                          <span className="relative">
                            <span className="flex items-center gap-2">
                              <link.Icon
                                className={cn(
                                  "size-5",
                                  parentHighlighted
                                    ? "text-primary-foreground"
                                    : "text-primary"
                                )}
                              />
                              <span>{link.text}</span>
                            </span>
                            {isExpanded ? (
                              <ChevronUp className={cn("size-4", parentHighlighted ? "text-primary-foreground/60" : "text-muted-foreground")} />
                            ) : (
                              <ChevronDown className={cn("size-4", parentHighlighted ? "text-primary-foreground/60" : "text-muted-foreground")} />
                            )}
                          </span>
                        </Button>
                      </button>

                      {isExpanded && (
                        <div className="grid grid-cols-1 min-[28rem]:grid-cols-2 gap-1 min-[28rem]:gap-2 ml-5">
                          {link.children.map((child) => {
                            const isHighlighted = isLeafActive(child, pathname, did);
                            const href =
                              typeof child.href === "function"
                                ? child.href(did)
                                : child.href;

                            return (
                              <Link href={href} key={child.id} className="w-auto">
                                <Button
                                  variant={isHighlighted ? "default" : "outline"}
                                  size={"lg"}
                                  className={cn(
                                    "w-full flex justify-start px-1 h-10 rounded-lg text-md",
                                    !isHighlighted &&
                                      "bg-primary/10 border-none shadow-none"
                                  )}
                                >
                                  <child.Icon
                                    className={cn(
                                      "size-5",
                                      isHighlighted
                                        ? "text-primary-foreground"
                                        : "text-primary"
                                    )}
                                  />
                                  <span>{child.text}</span>
                                </Button>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Leaf item
                const isHighlighted = isLeafActive(link, pathname, did);
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

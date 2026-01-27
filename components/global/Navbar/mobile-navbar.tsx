"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Loader2, Menu, Moon, Sun, X } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { useNavbarContext } from "./context";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NavLinkConfig } from "./types";
import { usePathname } from "next/navigation";
import { useAtprotoStore } from "@/components/stores/atproto";
import Link from "next/link";
import ProfileAvatar from "@/components/profile-avatar";
import { useModal } from "@/components/ui/modal/context";
import { ProfileModal, ProfileModalId } from "../modals/profile";
import AuthModal, { AuthModalId } from "../modals/auth";
import { links } from "@/lib/links";
import { useAtprotoProfile } from "@/hooks/use-atproto-profile";
import { useTheme } from "next-themes";
import useIsMounted from "@/hooks/use-is-mounted";

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
  const { profile } = useAtprotoProfile(did);
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  const { show, pushModal } = useModal();

  const isAuthenticated = auth.status === "AUTHENTICATED";
  const isResuming = auth.status === "RESUMING";
  const displayName = profile?.displayName || auth.user?.handle?.split(".")[0];

  const handleAccountClick = () => {
    setOpenState(false);
    pushModal(
      {
        id: isAuthenticated ? ProfileModalId : AuthModalId,
        content: isAuthenticated ? <ProfileModal /> : <AuthModal />,
      },
      true
    );
    show();
  };

  return (
    <div className="flex flex-col w-full bg-background">
      <div className="w-full flex items-center justify-between p-2 relative bg-background">
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} size={"sm"} onClick={() => setOpenState()}>
            {openState.mobile ? <X /> : <Menu />}
          </Button>
          <span className="font-serif text-primary text-lg font-bold">
            Bumicerts
          </span>
        </div>

        <button
          className={cn(
            "absolute right-2 top-2 h-8 w-8 rounded-full transition-all duration-300 flex items-center justify-center border border-border/40 bg-background hover:bg-foreground/5",
            openState.mobile &&
              "h-20 w-20 translate-y-8 right-[50%] translate-x-[calc(5rem-50%)]"
          )}
          onClick={handleAccountClick}
        >
          {isResuming ? (
            <Loader2 className="animate-spin text-muted-foreground size-4" />
          ) : isAuthenticated && did ? (
            <ProfileAvatar
              did={did}
              size={openState.mobile ? 68 : 24}
            />
          ) : (
            <div
              className={cn(
                "rounded-full bg-foreground/10 transition-all duration-300",
                openState.mobile ? "w-16 h-16" : "w-5 h-5"
              )}
            />
          )}
        </button>
      </div>
      <div
        className={cn(
          "flex items-center justify-center transition-all duration-300",
          openState.mobile && "h-20"
        )}
      ></div>
      <div className="w-full flex flex-col bg-background" ref={parent}>
        {openState.mobile && (
          <div className="flex flex-col gap-2 w-full pb-4">
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

                // Special case for my organization/dashboard link
                if (link.id === "my-organization") {
                  if (did) {
                    isHighlighted = pathname.startsWith(
                      links.upload.organization(did)
                    );
                  } else {
                    isHighlighted = pathname.startsWith("/upload/organization");
                  }
                }

                const href =
                  typeof link.href === "function" ? link.href(did) : link.href;

                return (
                  <Link
                    href={href}
                    key={link.id}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors",
                      isHighlighted
                        ? "bg-foreground/5 text-foreground font-semibold"
                        : "text-foreground hover:bg-foreground/5"
                    )}
                  >
                    <link.Icon size={18} strokeWidth={1.25} className="shrink-0" />
                    <span>{link.text}</span>
                  </Link>
                );
              })}
            </div>
            {/* Divider */}
            <div className="h-px bg-border/40 mx-4" />

            {/* Footer Links */}
            <div className="flex flex-col px-4">
              <span className="text-muted-foreground/60 text-xs font-medium mb-2">
                Links
              </span>
              <div className="flex items-center flex-wrap gap-2">
                {footerLinks.map((link) => {
                  const isInternal = link.href.startsWith("/");
                  return (
                    <Link
                      href={link.href}
                      target={isInternal ? undefined : "_blank"}
                      rel={isInternal ? undefined : "noopener noreferrer"}
                      key={link.href}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs text-foreground/60 bg-foreground/5 hover:bg-foreground/10 transition-colors"
                    >
                      {link.text}
                      <ArrowUpRight size={10} strokeWidth={1.5} />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Theme Toggle */}
            {isMounted && (
              <>
                <div className="h-px bg-border/40 mx-4" />
                <div className="px-4">
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors w-full"
                  >
                    {theme === "dark" ? (
                      <Moon size={18} strokeWidth={1.25} />
                    ) : (
                      <Sun size={18} strokeWidth={1.25} />
                    )}
                    <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
                  </button>
                </div>
              </>
            )}

            {/* User Info (when logged in) */}
            {isAuthenticated && displayName && (
              <>
                <div className="h-px bg-border/40 mx-4" />
                <div className="px-4 pb-2">
                  <button
                    onClick={handleAccountClick}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-foreground/5 transition-colors w-full"
                  >
                    {did && <ProfileAvatar did={did} size={32} />}
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-foreground">
                        {displayName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        View profile
                      </span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNavbar;

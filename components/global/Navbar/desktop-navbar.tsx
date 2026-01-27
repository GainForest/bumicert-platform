"use client";
import React from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, Loader2, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import useIsMounted from "@/hooks/use-is-mounted";
import { useAtprotoStore } from "@/components/stores/atproto";
import { NavLinkConfig } from "./types";
import { links } from "@/lib/links";
import packageJson from "@/package.json";
import { useNavbarContext } from "./context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModal } from "@/components/ui/modal/context";
import ProfileAvatar from "@/components/profile-avatar";
import { useAtprotoProfile } from "@/hooks/use-atproto-profile";
import AuthModal, { AuthModalId } from "@/components/global/modals/auth";
import { ProfileModal, ProfileModalId } from "@/components/global/modals/profile";

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
  const { openState, setOpenState } = useNavbarContext();
  const { pushModal, show } = useModal();
  const { profile } = useAtprotoProfile(did);

  const isCollapsed = !openState.desktop;
  const isAuthenticated = auth.status === "AUTHENTICATED";
  const isResuming = auth.status === "RESUMING";
  const displayName = profile?.displayName || auth.user?.handle?.split(".")[0];

  const handleAccountClick = () => {
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
    <nav
      className={cn(
        "flex flex-col justify-between bg-background/50 transition-all duration-200 ease-in-out overflow-hidden py-4 px-4",
        isCollapsed ? "w-16" : "w-[240px]"
      )}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-2">
        {/* Header with Logo, Title and Collapse Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <Image
              src="/assets/media/images/logo.svg"
              alt={title}
              width={20}
              height={20}
              className="shrink-0 opacity-80"
            />
            {!isCollapsed && (
              <h1 className="font-serif text-xl font-semibold text-foreground whitespace-nowrap">
                {title}
              </h1>
            )}
          </Link>
          
          {/* Collapse Button - only show when expanded */}
          {!isCollapsed && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setOpenState(false, "desktop")}
                  className="p-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                >
                  <ChevronLeft size={14} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                Collapse sidebar
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Nav Links */}
        <ul className={cn(
          "flex flex-col gap-0",
          isCollapsed ? "mt-3 -ml-2" : "mt-4"
        )}>
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

            // Collapsed view - icon only with tooltip and hover background
            if (isCollapsed) {
              return (
                <li key={link.id}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
                          isHighlighted
                            ? "text-foreground bg-foreground/5"
                            : "text-muted-foreground/50 hover:text-foreground hover:bg-foreground/5"
                        )}
                      >
                        <link.Icon size={15} strokeWidth={1.25} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={12}>
                      {link.text}
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            }

            // Expanded view - icon + text with hover background
            return (
              <li key={link.id} className="w-full">
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 -mx-1 rounded-md text-sm transition-colors whitespace-nowrap",
                    isHighlighted
                      ? "text-foreground bg-foreground/5"
                      : "text-muted-foreground/70 hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  <link.Icon size={15} strokeWidth={1.25} className="shrink-0" />
                  <span>{link.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Account */}
        <div className={cn("mt-4", isCollapsed ? "-ml-2" : "")}>
          {isResuming ? (
            <div className={cn(
              "flex items-center justify-center",
              isCollapsed ? "w-8 h-8" : "px-2 py-1.5"
            )}>
              <Loader2 className="animate-spin text-muted-foreground size-4" />
            </div>
          ) : isCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={handleAccountClick}
                  className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-foreground/5 transition-colors"
                >
                  {isAuthenticated && did ? (
                    <ProfileAvatar did={did} size={20} />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-foreground/10" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                {isAuthenticated ? displayName : "Sign in"}
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={handleAccountClick}
              className="w-full flex items-center gap-2 px-2 py-1.5 -mx-1 rounded-md hover:bg-foreground/5 transition-colors"
            >
              {isAuthenticated && did ? (
                <>
                  <ProfileAvatar did={did} size={20} />
                  <span className="text-sm text-foreground truncate">
                    {displayName}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-full bg-foreground/10" />
                  <span className="text-sm text-muted-foreground">
                    Sign in
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className={cn(
        "flex flex-col",
        isCollapsed ? "-ml-2 gap-1" : "gap-3"
      )}>
        {/* Footer Links - only show when expanded */}
        {!isCollapsed && (
          <>
            <div className="flex flex-col">
              {footerLinks.map((link) => {
                const isInternal = link.href.startsWith("/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={isInternal ? undefined : "_blank"}
                    rel={isInternal ? undefined : "noopener noreferrer"}
                    className="flex items-center gap-1 px-2 py-1.5 -mx-1 rounded-md text-sm text-muted-foreground/50 hover:text-muted-foreground hover:bg-foreground/5 transition-colors whitespace-nowrap"
                  >
                    <span>{link.text}</span>
                    <ArrowUpRight size={11} strokeWidth={1.5} className="shrink-0" />
                  </Link>
                );
              })}
            </div>
            <div className="h-px bg-border/40 my-2" />
          </>
        )}
        
        {/* Theme Toggle & Version */}
        <div className={cn(
          "flex items-center",
          isCollapsed ? "" : "justify-between px-1"
        )}>
          {!isCollapsed && (
            <span className="text-muted-foreground/40 text-[10px]">
              v{packageJson.version}
            </span>
          )}
          
          {isMounted && (
            isCollapsed ? (
              // Collapsed: icon button with tooltip and hover background
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    {theme === "dark" ? <Moon size={15} strokeWidth={1.5} /> : <Sun size={15} strokeWidth={1.5} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  {theme === "dark" ? "Dark mode" : "Light mode"}
                </TooltipContent>
              </Tooltip>
            ) : (
              // Expanded: icon + text with hover background
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-1.5 px-2 py-1.5 -mx-1 rounded-md text-muted-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                {theme === "dark" ? <Moon size={14} strokeWidth={1.5} /> : <Sun size={14} strokeWidth={1.5} />}
                <span className="text-xs">{theme === "dark" ? "Dark" : "Light"}</span>
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavbar;

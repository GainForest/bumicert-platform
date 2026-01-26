"use client";
import React from "react";
import Image from "next/image";
import { useNavbarContext } from "./context";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Header from "../Header";
import { cn } from "@/lib/utils";
import { HeaderContextProvider } from "@/components/providers/HeaderProvider";
import MobileNavbar, { MobileNavbarProps } from "./mobile-navbar";
import DesktopNavbar, { DesktopNavbarProps } from "./desktop-navbar";

const NavbarLayout = ({
  children,
  desktopNavbarProps,
  mobileNavbarProps,
}: {
  children: React.ReactNode;
  desktopNavbarProps: DesktopNavbarProps;
  mobileNavbarProps: MobileNavbarProps;
}) => {
  const { openState, viewport, setOpenState } = useNavbarContext();
  const [parent] = useAutoAnimate<HTMLDivElement>();
  return (
    <HeaderContextProvider>
      <div
        className={cn(
          "h-full w-full flex relative overflow-hidden",
          viewport === "mobile" && "flex-col",
          "bg-secondary/30 dark:bg-secondary/10"
        )}
        ref={parent}
      >
        {/* Decorative watercolor background - desktop only */}
        <div
          className="hidden lg:block fixed top-1/2 -right-44 -translate-y-1/2 w-[560px] h-[680px]
                     pointer-events-none select-none opacity-50 dark:opacity-30"
          aria-hidden="true"
        >
          <Image
            src="/banner.png"
            alt=""
            fill
            className="object-contain"
            priority={false}
          />
        </div>

        {viewport === "desktop" && openState.desktop && (
          <DesktopNavbar {...desktopNavbarProps} />
        )}
        {viewport === "mobile" && <MobileNavbar {...mobileNavbarProps} />}
        <main
          onClick={(e) => {
            if (viewport === "mobile" && openState.mobile) {
              e.preventDefault();
              e.stopPropagation();
              setOpenState(false, "mobile");
            }
          }}
          className={cn(
            "flex-1 flex flex-col bg-background border border-border/60 rounded-xl relative overflow-y-auto",
            viewport === "desktop"
              ? openState.desktop
                ? "m-2 md:ml-0"
                : "m-0 rounded-none"
              : openState.mobile
              ? "brightness-90 blur-[1px] overflow-hidden cursor-default"
              : ""
          )}
        >
          <Header />
          {children}
        </main>
      </div>
    </HeaderContextProvider>
  );
};

export default NavbarLayout;

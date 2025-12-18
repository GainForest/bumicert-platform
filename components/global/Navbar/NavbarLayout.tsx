"use client";
import React from "react";
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
  const { openState, viewport } = useNavbarContext();
  const [parent] = useAutoAnimate<HTMLDivElement>();
  return (
    <HeaderContextProvider>
      <div
        className={cn(
          "h-full w-full flex",
          viewport === "mobile" && "flex-col",
          "bg-[rgb(242_237_227.7)] dark:bg-[rgb(30_30_30.7)]"
        )}
        // style={{
        //   background: `repeating-linear-gradient(
        //     -55deg,
        //     var(--background),
        //     var(--background) 2px,
        //     color-mix(in oklab, var(--primary) 10%, transparent) 2px,
        //     color-mix(in oklab, var(--primary) 10%, transparent) 4px
        //   )`,
        // }}
        ref={parent}
      >
        {viewport === "desktop" && openState.desktop && (
          <DesktopNavbar {...desktopNavbarProps} />
        )}
        {viewport === "mobile" && <MobileNavbar {...mobileNavbarProps} />}
        <main
          className={cn(
            "flex-1 bg-background border border-border shadow-inner rounded-xl relative overflow-y-auto",
            viewport === "desktop"
              ? openState.desktop
                ? "m-2 md:ml-0"
                : "m-0 rounded-none"
              : openState.mobile
              ? "brightness-90 blur-[1px] overflow-hidden pointer-events-none"
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

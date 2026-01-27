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
  const { openState, viewport, setOpenState } = useNavbarContext();
  const [parent] = useAutoAnimate<HTMLDivElement>();
  return (
    <HeaderContextProvider>
      <div
        className={cn(
          "h-full w-full flex relative overflow-hidden",
          viewport === "mobile" && "flex-col",
          "bg-[rgb(242_237_227.7)] dark:bg-[rgb(30_30_30.7)]"
        )}
        ref={parent}
      >
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

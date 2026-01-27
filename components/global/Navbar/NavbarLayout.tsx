"use client";
import React from "react";
import { useNavbarContext } from "./context";
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
  return (
    <HeaderContextProvider>
      <div
        className={cn(
          "h-full w-full flex relative overflow-hidden",
          viewport === "mobile" && "flex-col",
          "bg-[rgb(242_237_227.7)] dark:bg-[rgb(30_30_30.7)]"
        )}
      >
        {viewport === "desktop" && (
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
            "flex-1 flex flex-col bg-background relative overflow-y-auto",
            viewport === "mobile" && openState.mobile && "brightness-90 blur-[1px] overflow-hidden cursor-default"
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

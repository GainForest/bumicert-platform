"use client";
import React from "react";
import { useNavbarContext } from "../Navbar/context";
import { useHeaderContext } from "../../providers/HeaderProvider";
import AtprotoSignInButton from "./AtprotoSignInButton";

const Header = () => {
  const { viewport } = useNavbarContext();
  const { leftContent, rightContent, subHeaderContent } = useHeaderContext();
  return (
    <div className="w-full flex flex-col sticky top-0 border-b border-border/60 backdrop-blur-sm bg-background/80 z-20">
      <div className="flex items-center justify-between gap-2 px-4 py-3 min-h-[52px]">
        <div className="flex items-center gap-2">
          {leftContent}
        </div>
        <div className="flex items-center gap-2">
          {rightContent}
          {viewport === "desktop" && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-0.5 bg-muted-foreground/50 rounded-full"></div>
              <AtprotoSignInButton />
            </div>
          )}
        </div>
      </div>
      {subHeaderContent}
    </div>
  );
};

export default Header;

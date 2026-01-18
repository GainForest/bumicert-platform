"use client";
import React from "react";
import { Button } from "../../ui/button";
import { ChevronLeft, Sidebar } from "lucide-react";
import { useNavbarContext } from "../Navbar/context";
import { useHeaderContext } from "../../providers/HeaderProvider";
import AtprotoSignInButton from "./AtprotoSignInButton";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const { setOpenState, viewport } = useNavbarContext();
  const { leftContent, rightContent, subHeaderContent } = useHeaderContext();
  return (
    <div className="w-full flex flex-col sticky top-0 border-b border-b-border shadow-xl backdrop-blur-xl bg-background/80 z-20">
      <div className="flex items-center justify-between gap-1 p-2">
        <div className="flex items-center gap-1">
          {viewport === "desktop" && (
            <Button variant="ghost" size={"sm"} onClick={() => setOpenState()}>
              <Sidebar className="size-4" />
            </Button>
          )}
          <Button size={"sm"} variant={"outline"} onClick={() => router.back()}>
            <ChevronLeft />
            {viewport === "desktop" && <span>Back</span>}
          </Button>
          {leftContent}
        </div>
        <div className="flex items-center gap-1">
          {rightContent}
          {viewport === "desktop" && (
            <div className="flex items-center gap-1">
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

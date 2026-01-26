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
    <div className="w-full flex flex-col sticky top-0 border-b border-border/60 backdrop-blur-sm bg-background/80 z-20">
      <div className="flex items-center justify-between gap-2 px-4 py-2">
        <div className="flex items-center gap-2">
          {viewport === "desktop" && (
            <Button variant="ghost" size="sm" onClick={() => setOpenState()} className="text-muted-foreground hover:text-foreground">
              <Sidebar className="size-4" />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="size-4" />
            {viewport === "desktop" && <span>Back</span>}
          </Button>
          {leftContent}
        </div>
        <div className="flex items-center gap-2">
          {rightContent}
          {viewport === "desktop" && (
            <div className="flex items-center gap-2">
              <div className="w-px h-4 bg-border/60" />
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

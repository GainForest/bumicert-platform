"use client";
import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavbarContext } from "../Navbar/context";
import { useHeaderContext } from "../../providers/HeaderProvider";
import AtprotoSignInButton from "./AtprotoSignInButton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Header = () => {
  const { viewport, openState, setOpenState } = useNavbarContext();
  const { leftContent, rightContent, subHeaderContent } = useHeaderContext();
  
  const isCollapsed = viewport === "desktop" && !openState.desktop;
  
  return (
    <div className="w-full flex flex-col sticky top-0 border-b border-border/60 backdrop-blur-sm bg-background/80 z-20">
      <div className="flex items-center justify-between gap-2 px-4 py-2">
        <div className="flex items-center gap-2">
          {isCollapsed && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setOpenState(true, "desktop")} 
                  className="p-1.5 rounded-md text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  <ChevronRight className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          )}
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

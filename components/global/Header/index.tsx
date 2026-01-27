"use client";
import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavbarContext } from "../Navbar/context";
import { useHeaderContext } from "../../providers/HeaderProvider";
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
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <div className="flex items-center gap-2">
          {isCollapsed && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setOpenState(true, "desktop")} 
                  className="p-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                >
                  <ChevronRight size={14} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          )}
          {leftContent}
        </div>
        <div className="flex items-center gap-2">
          {rightContent}
        </div>
      </div>
      {subHeaderContent}
    </div>
  );
};

export default Header;

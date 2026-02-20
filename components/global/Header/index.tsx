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
  const { openState, setOpenState, viewport } = useNavbarContext();
  const { leftContent, rightContent, subHeaderContent } = useHeaderContext();
  const isCollapsed = !openState.desktop;
  return (
    <div className="w-full flex flex-col sticky top-0 border-b border-border/60 backdrop-blur-sm bg-background/80 z-20">
      <div className="flex items-center justify-between gap-2 px-4 py-3 min-h-[52px]">
        <div className="flex items-center gap-2">
          {viewport === "desktop" && isCollapsed && (
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

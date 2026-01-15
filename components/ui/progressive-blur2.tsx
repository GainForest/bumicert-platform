import React from "react";
import { cn } from "@/lib/utils";

type Position = "top" | "bottom";

const positionClasses: Record<Position, string> = {
  top: "top-0",
  bottom: "bottom-0",
};

const ProgressiveBlur2 = ({
  intensity,
  position = "bottom",
  className,
}: {
  intensity: number;
  position?: Position;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "absolute left-0 right-0",
        positionClasses[position],
        className
      )}
    >
      {Array.from({ length: intensity }).map((_, index) => {
        return (
          <div
            key={index}
            className={cn("absolute left-0 right-0", positionClasses[position])}
            style={{
              height: `${100 / (index + 1)}%`,
              backdropFilter: `blur(1px)`,
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default ProgressiveBlur2;

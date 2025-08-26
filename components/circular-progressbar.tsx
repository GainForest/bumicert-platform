"use client";
import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";

const CircularProgressBar = ({
  value,
  size = 40,
  text,
}: {
  value: number;
  size?: number;
  text?: string;
}) => {
  return (
    <div
      className="flex items-center justify-center relative"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <CircularProgressbar
        value={value}
        styles={{
          path: {
            stroke: "var(--primary)",
            strokeWidth: 9,
            strokeLinecap: "round",
          },
          trail: {
            stroke: "color-mix(in oklab, var(--primary) 30%, transparent)",
          },
        }}
      />
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs scale-75">
        {text}
      </span>
    </div>
  );
};

export default CircularProgressBar;

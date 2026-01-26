"use client";
import { cn } from "@/lib/utils";
import React from "react";

const Container = ({
  children,
  className,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("w-full max-w-5xl mx-auto px-4 sm:px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
};

export default Container;

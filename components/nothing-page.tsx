"use client";
import React from "react";
import { CircleAlert } from "lucide-react";
import { getStripedBackground } from "@/lib/getStripedBackground";

const NothingPage = ({
  title,
  description,
  cta,
}: {
  title?: string;
  description?: string;
  cta?: React.ReactNode;
}) => {
  return (
    <div
      className="flex flex-col items-center gap-4 w-full p-4 rounded-xl"
      style={{
        background: getStripedBackground(
          { variable: "--muted", opacity: 50 },
          { variable: "--muted", opacity: 100 }
        ),
      }}
    >
      <CircleAlert className="size-10 text-muted-foreground/50" />
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl text-center font-bold font-serif">
          {title ?? "No data found."}
        </h1>
        <p className="text-muted-foreground text-center text-balance">
          {description ?? "No data could be found."}
        </p>
        {cta}
      </div>
    </div>
  );
};

export default NothingPage;

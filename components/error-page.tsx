"use client";
import React from "react";
import { Button } from "./ui/button";
import { CircleAlert, RefreshCcwIcon } from "lucide-react";
import { getStripedBackground } from "@/lib/getStripedBackground";

const ErrorPage = ({
  showRefreshButton = true,
  title,
  description,
  error,
}: {
  title?: string;
  description?: string;
  showRefreshButton?: boolean;
  error?: unknown;
}) => {
  console.error(error);
  return (
    <div
      className="flex flex-col items-center gap-4 w-full p-4 rounded-xl"
      style={{
        background: getStripedBackground(
          { variable: "--destructive", opacity: 10 },
          { variable: "--destructive", opacity: 3 }
        ),
      }}
    >
      <CircleAlert className="size-10 text-destructive/50" />
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl text-center font-bold font-serif">
          {title ?? "Oops! Something went wrong."}
        </h1>
        <p className="text-muted-foreground text-center text-balance">
          {description ??
            "We're sorry, but an error occurred while processing your request."}
        </p>
        {showRefreshButton && (
          <Button className="mt-4" onClick={() => window.location.reload()}>
            <RefreshCcwIcon />
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;

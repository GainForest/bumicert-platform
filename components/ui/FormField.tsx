import { LucideIcon } from "lucide-react";
import React from "react";
import BiokoPeekingImage from "@/app/(marketplace)/ecocert/create/[draftId]/_assets/bioko-peeking.png";
import BiokoGrabbingImage from "@/app/(marketplace)/ecocert/create/[draftId]/_assets/bioko-grabbing.png";
import Image from "next/image";
import { cn } from "@/lib/utils";

const FormField = ({
  Icon,
  children,
  label,
  inlineEndMessage,
  htmlFor,
  error,
  className,
  showError = true,
  biokoMode = true,
}: {
  label: string;
  Icon: LucideIcon;
  inlineEndMessage?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  htmlFor?: string;
  error?: string;
  showError?: boolean;
  className?: string;
  biokoMode?: boolean;
}) => {
  const kebabCaseLabel = label.toLowerCase().replace(/ /g, "-");
  return (
    <div
      className={cn(
        "group flex flex-col gap-1.5 p-2 rounded-md transition-colors relative z-10",
        showError && error
          ? "bg-destructive/5"
          : "hover:bg-primary/5 focus-within:bg-primary/5",
        className
      )}
    >
      {biokoMode && (
        <div className="absolute -top-8 right-0 w-30 h-20 not-[group-focus-within]:pointer-events-none">
          <div className="w-full h-8 rounded-md absolute top-0 overflow-hidden">
            <Image
              src={BiokoPeekingImage}
              alt="Bioko Peeking"
              className="h-8 w-auto absolute top-8 right-6 group-focus-within:top-0 transition-all duration-300"
            />
          </div>

          <Image
            src={BiokoGrabbingImage}
            alt="Bioko Grabbing"
            className="h-4 w-auto absolute top-6 -right-1 opacity-0 group-focus-within:opacity-100 transition-all duration-300"
          />
        </div>
      )}

      <div className="flex items-center justify-between w-full">
        <label
          htmlFor={htmlFor ?? kebabCaseLabel}
          className={cn(
            "ml-1 flex items-center gap-1 text-sm transition-colors",
            showError && error
              ? "text-destructive"
              : "text-muted-foreground group-hover:text-foreground group-focus-within:text-foreground"
          )}
        >
          <Icon className="size-3.5" />
          {label}
        </label>
        {showError && error ? (
          <span className="text-destructive text-xs">{error}</span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {inlineEndMessage}
          </span>
        )}
      </div>

      {children}
    </div>
  );
};

export default FormField;

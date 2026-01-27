import { Button } from "@/components/ui/button";
import React from "react";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import z from "zod";
import { cn } from "@/lib/utils";

const ReviewStepCard = <
  K extends string,
  T extends z.ZodObject<Record<K, z.ZodTypeAny>>,
>({
  title,
  percentage,
  onEdit,
  children,
  schema,
  errors,
}: {
  title: string;
  percentage?: number;
  onEdit?: () => void;
  children?: React.ReactNode;
  schema: T;
  errors: Partial<Record<K, string>>;
}) => {
  const errorKeys = Object.keys(errors) as K[];
  const errorKeysWithRequired = errorKeys.filter(
    (key) => errors[key] === "Required"
  );
  const errorKeysWithoutRequired = errorKeys.filter(
    (key) => errors[key] !== "Required"
  );
  const hasErrors =
    errorKeysWithRequired.length > 0 || errorKeysWithoutRequired.length > 0;
  
  const allMissingFields = [
    ...errorKeysWithRequired.map((key) => schema.shape[key].description),
    ...errorKeysWithoutRequired.map((key) => schema.shape[key].description),
  ].filter(Boolean);

  return (
    <div className="rounded-lg border border-border/50 bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center",
            hasErrors 
              ? "bg-amber-100 dark:bg-amber-900/30" 
              : "bg-primary/10"
          )}>
            {hasErrors ? (
              <AlertCircle className="size-3 text-amber-600 dark:text-amber-400" strokeWidth={2} />
            ) : (
              <Check className="size-3 text-primary" strokeWidth={2.5} />
            )}
          </div>
          <span className="font-medium text-foreground">{title}</span>
        </div>
        {onEdit !== undefined && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            Edit
            <ArrowRight className="size-3 ml-1" strokeWidth={1.5} />
          </Button>
        )}
      </div>

      {/* Status message */}
      {hasErrors && (
        <div className="px-4 py-2 bg-amber-50/50 dark:bg-amber-950/20 border-b border-amber-100/50 dark:border-amber-900/30">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Missing: {allMissingFields.join(", ")}
          </p>
        </div>
      )}

      {/* Content */}
      {children && (
        <div className="px-4 py-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default ReviewStepCard;

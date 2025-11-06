"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface CalendarRangeProps {
  value?: [Date, Date] | null;
  onValueChange?: (value: [Date, Date] | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function CalendarRange({
  value,
  onValueChange,
  placeholder = "Pick a date range",
  className,
  disabled = false,
  id,
}: CalendarRangeProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const newValue: [Date, Date] = [range.from, range.to];
      onValueChange?.(newValue);
    } else {
      onValueChange?.(null);
    }
    // Never auto-close the popover - let user close it manually
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value?.[0] && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.[0] && value?.[1] ?
              <>
                {format(value[0], "LLL dd, y")} -{" "}
                {format(value[1], "LLL dd, y")}
              </>
            : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            className="h-[340px]"
            mode="range"
            defaultMonth={value?.[0]}
            selected={
              value ?
                {
                  from: value[0],
                  to: value[1],
                }
              : undefined
            }
            onSelect={handleSelect}
            numberOfMonths={2}
          />
          <div className="w-full flex items-center text-center justify-center text-sm text-muted-foreground mb-2">
            To change start date, double click a date.
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

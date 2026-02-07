"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./dropdown";
import { GlobeHemisphereWest } from "@phosphor-icons/react";
import { COMMON_TIMEZONES } from "@/lib/scheduling";

/* ============================================
   Timezone Selector Component
   ============================================ */
export interface TimezoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
  className?: string;
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <GlobeHemisphereWest className="h-4 w-4 text-foreground-muted" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-auto border-0 bg-transparent px-2 text-sm hover:bg-[var(--background-interactive-hover)]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COMMON_TIMEZONES.map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

TimezoneSelector.displayName = "TimezoneSelector";

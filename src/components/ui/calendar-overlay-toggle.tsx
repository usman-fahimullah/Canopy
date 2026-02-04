"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeSlash } from "@phosphor-icons/react";

export interface CalendarOverlayToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

const CalendarOverlayToggle: React.FC<CalendarOverlayToggleProps> = ({
  enabled,
  onToggle,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(!enabled)}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-medium transition-all",
        enabled
          ? "border border-[var(--primitive-blue-300)] bg-[var(--primitive-blue-100)] text-[var(--primitive-blue-700)]"
          : "border border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-100)] text-[var(--foreground-muted)]",
        className
      )}
    >
      {enabled ? <Eye size={14} /> : <EyeSlash size={14} />}
      <span>Show my events</span>
    </button>
  );
};

CalendarOverlayToggle.displayName = "CalendarOverlayToggle";

export { CalendarOverlayToggle };

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SimpleTooltip } from "./tooltip";

export interface TruncateTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The text to display. Used as both visible content and tooltip.
   * Must be a string so the tooltip can show the full value.
   */
  children: string;
  /**
   * Number of lines before truncating.
   * - 1 (default): single-line `truncate` with tooltip
   * - 2+: `line-clamp-N` without tooltip (content is mostly visible)
   */
  lines?: number;
  /** Tooltip placement (only applies when lines === 1) */
  side?: "top" | "right" | "bottom" | "left";
}

/**
 * Map line counts to Tailwind classes so they're statically analyzable.
 * Tailwind JIT can't detect dynamic `line-clamp-${n}` — full class names
 * must appear in source for the utility to be generated.
 */
const lineClampClass: Record<number, string> = {
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

/**
 * TruncateText — pairs CSS truncation with an accessible tooltip.
 *
 * Use for any single-line truncated user-generated text (names, emails,
 * company names, URLs). Multi-line mode (lines >= 2) applies line-clamp
 * without a tooltip since most content remains visible.
 *
 * @example
 * ```tsx
 * // Single-line with tooltip (default)
 * <TruncateText>Long company name here</TruncateText>
 *
 * // Multi-line clamping, no tooltip
 * <TruncateText lines={3}>Long description...</TruncateText>
 *
 * // With custom styling
 * <TruncateText className="text-caption text-foreground-muted">
 *   user@example.com
 * </TruncateText>
 * ```
 */
const TruncateText = React.forwardRef<HTMLSpanElement, TruncateTextProps>(
  ({ children, lines = 1, side = "top", className, ...props }, ref) => {
    if (lines === 1) {
      return (
        <SimpleTooltip content={children} side={side}>
          <span ref={ref} className={cn("block min-w-0 truncate", className)} {...props}>
            {children}
          </span>
        </SimpleTooltip>
      );
    }

    const clamp = lineClampClass[lines] ?? `line-clamp-[${lines}]`;

    return (
      <span ref={ref} className={cn("block min-w-0", clamp, className)} {...props}>
        {children}
      </span>
    );
  }
);

TruncateText.displayName = "TruncateText";

export { TruncateText };

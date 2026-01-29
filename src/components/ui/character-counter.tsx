"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CharacterCounter component
 *
 * Displays current character count vs maximum limit.
 * Can be used standalone or integrated with text inputs/editors.
 *
 * Features:
 * - Shows current/max format (e.g., "125/250")
 * - Visual warning when approaching limit
 * - Error state when exceeding limit
 */

export interface CharacterCounterProps {
  /** Current character count */
  current: number;
  /** Maximum allowed characters */
  max: number;
  /** Warning threshold percentage (default: 80%) */
  warningThreshold?: number;
  /** Show counter even when count is 0 */
  showWhenEmpty?: boolean;
  /** Additional class names */
  className?: string;
}

const CharacterCounter = React.forwardRef<HTMLSpanElement, CharacterCounterProps>(
  (
    {
      current,
      max,
      warningThreshold = 80,
      showWhenEmpty = true,
      className,
    },
    ref
  ) => {
    const percentage = (current / max) * 100;
    const isWarning = percentage >= warningThreshold && percentage < 100;
    const isError = percentage >= 100;
    const isOverLimit = current > max;

    if (!showWhenEmpty && current === 0) {
      return null;
    }

    return (
      <span
        ref={ref}
        className={cn(
          "text-caption tabular-nums transition-colors duration-150",
          isError
            ? "text-foreground-error"
            : isWarning
            ? "text-foreground-warning"
            : "text-foreground-muted",
          className
        )}
        role="status"
        aria-live="polite"
        aria-label={`${current} of ${max} characters${isOverLimit ? ", limit exceeded" : ""}`}
      >
        {current}/{max}
      </span>
    );
  }
);

CharacterCounter.displayName = "CharacterCounter";

/**
 * RichTextCharacterCounter - Specifically for use with RichTextEditor
 *
 * Automatically strips HTML tags to count only visible text.
 * Position this component below or inside the RichTextEditor container.
 */
export interface RichTextCharacterCounterProps extends Omit<CharacterCounterProps, "current"> {
  /** HTML content from the editor */
  htmlContent: string;
}

const RichTextCharacterCounter = React.forwardRef<
  HTMLSpanElement,
  RichTextCharacterCounterProps
>(({ htmlContent, ...props }, ref) => {
  // Strip HTML tags and count only text content
  const textContent = React.useMemo(() => {
    if (!htmlContent) return "";
    // Create a temporary element to parse HTML
    if (typeof window === "undefined") {
      // Server-side: simple regex strip
      return htmlContent.replace(/<[^>]*>/g, "").trim();
    }
    // Client-side: use DOM parser for accuracy
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    return doc.body.textContent || "";
  }, [htmlContent]);

  return <CharacterCounter ref={ref} current={textContent.length} {...props} />;
});

RichTextCharacterCounter.displayName = "RichTextCharacterCounter";

export { CharacterCounter, RichTextCharacterCounter };

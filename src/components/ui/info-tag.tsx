"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "@phosphor-icons/react";

/**
 * InfoTag Component - Trails Design System
 *
 * A simple tag with cream background, used for metadata display.
 * Based on Figma "Info Tag" component (1375:14494)
 *
 * Figma Specs:
 * - Background: neutral-200 (#F2EDE9) or transparent with backdrop blur
 * - Border radius: 8px (rounded-lg)
 * - Padding: px-2 py-1 (8px/4px) without button, p-2 (8px) with button
 * - Text: 14px (sm), neutral-800 (#1F1D1C), 20px line-height
 * - Close icon: 20px, neutral-600 (#7A7671) color
 * - Gap: 4px (gap-1) between text and close icon
 * - Variants: transparent (with backdrop blur), removable (with close button)
 */

export interface InfoTagProps {
  /** Text content */
  children: React.ReactNode;
  /** Whether the tag can be dismissed (shows close button) */
  removable?: boolean;
  /** Callback when dismiss button is clicked */
  onRemove?: () => void;
  /** Transparent variant with backdrop blur (for overlaying images) */
  transparent?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

const InfoTag = React.forwardRef<HTMLDivElement, InfoTagProps>(
  (
    {
      children,
      removable = false,
      onRemove,
      transparent = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled) {
        onRemove?.();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center",
          // Figma: 8px radius
          "rounded-lg",
          // Figma: gap-1 (4px) between text and close icon
          removable && "gap-1",
          // Figma: p-2 (8px) with button, px-2 py-1 (8px/4px) without
          removable ? "p-2" : "px-2 py-1",
          // Background variants
          transparent
            ? "bg-white/50 backdrop-blur-[6px]"
            : "bg-[var(--tag-info-background)]",
          // Text color
          transparent
            ? "text-[var(--primitive-neutral-900)]"
            : "text-[var(--tag-info-foreground)]",
          // Figma: 14px font, 20px line-height
          "text-sm leading-5",
          "font-normal select-none",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <span className="truncate">{children}</span>
        {removable && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className={cn(
              // Figma: 20px close icon
              "shrink-0 w-5 h-5",
              "flex items-center justify-center",
              "transition-colors duration-150",
              "hover:opacity-70",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--border-emphasis)]",
              disabled && "cursor-not-allowed"
            )}
            aria-label={`Remove ${typeof children === "string" ? children : "tag"}`}
          >
            {/* Figma: neutral-600 (#7A7671) icon color */}
            <X size={20} weight="bold" className="text-[var(--primitive-neutral-600)]" />
          </button>
        )}
      </div>
    );
  }
);

InfoTag.displayName = "InfoTag";

export { InfoTag };

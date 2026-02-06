"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { BookmarkSimple, CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * SaveButton component based on Trails Design System
 *
 * @figma https://figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System?node-id=3560-13050
 *
 * A dedicated save/bookmark button with two visual states:
 * - Unsaved: Blue background with BookmarkSimple icon + "Save It" label
 * - Saved: Green background with CheckCircle icon + "Saved" label
 *
 * Figma Specs:
 * - Default size: px-16px py-14px, 14px font bold, 4px icon gap, 20px icon
 * - Large size: p-16px, 18px font bold, 4px icon gap, 24px icon
 * - Icon-only: 10px padding (default), 12px padding (large)
 * - Border radius: 16px (rounded-2xl)
 *
 * Color tokens:
 * - Unsaved: bg blue-100 (#E5F1FF), hover blue-200 (#CCE4FF), text green-800
 * - Saved: bg green-200 (#DCFAC8), hover green-300 (#BCEBB2), text green-700
 */

const saveButtonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "whitespace-nowrap font-bold",
    "rounded-2xl",
    "transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
    "cursor-pointer",
  ],
  {
    variants: {
      size: {
        default: "px-4 py-3.5 gap-1 text-sm leading-5",
        lg: "p-4 gap-1 text-lg leading-6",
        "icon-default": "p-2.5",
        "icon-lg": "p-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface SaveButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof saveButtonVariants> {
  /** Whether the item is currently saved */
  saved?: boolean;
  /** Show only the icon without label text */
  iconOnly?: boolean;
}

const SaveButton = React.forwardRef<HTMLButtonElement, SaveButtonProps>(
  ({ className, size = "default", saved = false, iconOnly = false, ...props }, ref) => {
    const effectiveSize = iconOnly ? (size === "lg" ? "icon-lg" : "icon-default") : size;

    const iconSize = size === "lg" ? 24 : 20;

    return (
      <button
        ref={ref}
        className={cn(
          saveButtonVariants({ size: effectiveSize }),
          saved
            ? "bg-[var(--save-button-saved-background)] text-[var(--save-button-saved-foreground)] hover:bg-[var(--save-button-saved-background-hover)]"
            : "bg-[var(--save-button-background)] text-[var(--save-button-foreground)] hover:bg-[var(--save-button-background-hover)]",
          className
        )}
        {...props}
      >
        {saved ? (
          <>
            <CheckCircle size={iconSize} weight="fill" />
            {!iconOnly && <span>Saved</span>}
          </>
        ) : (
          <>
            <BookmarkSimple size={iconSize} />
            {!iconOnly && <span>Save It</span>}
          </>
        )}
      </button>
    );
  }
);

SaveButton.displayName = "SaveButton";

export { SaveButton, saveButtonVariants };

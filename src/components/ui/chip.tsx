"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X, DotsThree, Plus } from "@phosphor-icons/react";

/**
 * Chip/Tag Component - Trails Design System
 *
 * A removable, interactive chip component for tags, filters, and selections.
 *
 * Features:
 * - Multiple color variants using design tokens
 * - Removable with X button
 * - Selectable/clickable for filter use cases
 * - Optional leading icon
 * - Keyboard accessible (Delete/Backspace to remove)
 *
 * Specs:
 * - Height: 28px (sm), 32px (md), 40px (lg)
 * - Border radius: full (pill shape)
 * - Focus ring: blue-500
 */

/* ============================================
   CHIP VARIANTS (CVA)
   ============================================ */

const chipVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full",
    "font-medium select-none",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none",
  ],
  {
    variants: {
      variant: {
        neutral: [
          "bg-[var(--chip-neutral-background)]",
          "text-[var(--chip-neutral-foreground)]",
          "hover:bg-[var(--chip-neutral-background-hover)]",
        ],
        primary: [
          "bg-[var(--chip-primary-background)]",
          "text-[var(--chip-primary-foreground)]",
          "hover:bg-[var(--chip-primary-background-hover)]",
        ],
        blue: [
          "bg-[var(--chip-blue-background)]",
          "text-[var(--chip-blue-foreground)]",
          "hover:bg-[var(--chip-blue-background-hover)]",
        ],
        red: [
          "bg-[var(--chip-red-background)]",
          "text-[var(--chip-red-foreground)]",
          "hover:bg-[var(--chip-red-background-hover)]",
        ],
        orange: [
          "bg-[var(--chip-orange-background)]",
          "text-[var(--chip-orange-foreground)]",
          "hover:bg-[var(--chip-orange-background-hover)]",
        ],
        yellow: [
          "bg-[var(--chip-yellow-background)]",
          "text-[var(--chip-yellow-foreground)]",
          "hover:bg-[var(--chip-yellow-background-hover)]",
        ],
        purple: [
          "bg-[var(--chip-purple-background)]",
          "text-[var(--chip-purple-foreground)]",
          "hover:bg-[var(--chip-purple-background-hover)]",
        ],
      },
      size: {
        sm: "h-7 px-2.5 text-sm",
        md: "h-8 px-3 text-sm",
        lg: "h-10 px-4 text-base",
      },
      selected: {
        true: [
          "bg-[var(--chip-selected-background)]",
          "text-[var(--chip-selected-foreground)]",
          "hover:bg-[var(--chip-selected-background-hover)]",
        ],
        false: "",
      },
      clickable: {
        true: "cursor-pointer",
        false: "cursor-default",
      },
    },
    compoundVariants: [
      // When selected, override variant colors
      {
        selected: true,
        className: [
          "bg-[var(--chip-selected-background)]",
          "text-[var(--chip-selected-foreground)]",
          "hover:bg-[var(--chip-selected-background-hover)]",
        ],
      },
    ],
    defaultVariants: {
      variant: "neutral",
      size: "md",
      selected: false,
      clickable: false,
    },
  }
);

/* ============================================
   CLOSE BUTTON VARIANTS
   ============================================ */

const closeButtonVariants = cva(
  [
    "shrink-0 rounded-full p-0.5",
    "transition-colors duration-150",
    "focus-visible:outline-none",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        neutral: [
          "text-[var(--chip-neutral-foreground)]",
          "hover:bg-[var(--chip-neutral-close-background-hover)]",
          "",
        ],
        primary: [
          "text-[var(--chip-primary-foreground)]",
          "hover:bg-[var(--chip-primary-close-background-hover)]",
          "",
        ],
        blue: [
          "text-[var(--chip-blue-foreground)]",
          "hover:bg-[var(--chip-blue-close-background-hover)]",
          "",
        ],
        red: [
          "text-[var(--chip-red-foreground)]",
          "hover:bg-[var(--chip-red-close-background-hover)]",
          "",
        ],
        orange: [
          "text-[var(--chip-orange-foreground)]",
          "hover:bg-[var(--chip-orange-close-background-hover)]",
          "",
        ],
        yellow: [
          "text-[var(--chip-yellow-foreground)]",
          "hover:bg-[var(--chip-yellow-close-background-hover)]",
          "",
        ],
        purple: [
          "text-[var(--chip-purple-foreground)]",
          "hover:bg-[var(--chip-purple-close-background-hover)]",
          "",
        ],
        selected: [
          "text-[var(--chip-selected-foreground)]",
          "hover:bg-[var(--chip-selected-close-background-hover)]",
          "",
        ],
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

/* ============================================
   CHIP COMPONENT
   ============================================ */

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">, VariantProps<typeof chipVariants> {
  /** Text content of the chip */
  children: React.ReactNode;
  /** Optional icon to display on the left */
  icon?: React.ReactNode;
  /** Whether the chip can be removed (shows X button) */
  removable?: boolean;
  /** Callback when the remove button is clicked */
  onRemove?: () => void;
  /** Whether the chip is selected (for filter chips) */
  selected?: boolean;
  /** Click handler for the chip itself (makes it interactive) */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      children,
      icon,
      variant = "neutral",
      size = "md",
      removable = false,
      onRemove,
      selected = false,
      onClick,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const iconSize = size === "sm" ? 14 : size === "lg" ? 18 : 16;
    const isClickable = !!onClick;

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled) {
        onRemove?.();
      }
    };

    const handleClick = () => {
      if (!disabled && onClick) {
        onClick();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      // Delete/Backspace removes the chip if removable
      if ((e.key === "Backspace" || e.key === "Delete") && removable) {
        e.preventDefault();
        onRemove?.();
      }

      // Enter/Space toggles selection if clickable
      if ((e.key === "Enter" || e.key === " ") && isClickable) {
        e.preventDefault();
        onClick?.();
      }
    };

    return (
      <div
        ref={ref}
        role={isClickable ? "button" : "listitem"}
        tabIndex={disabled ? -1 : isClickable || removable ? 0 : undefined}
        aria-selected={isClickable ? selected : undefined}
        aria-disabled={disabled || undefined}
        onClick={isClickable ? handleClick : undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          chipVariants({ variant, size, selected, clickable: isClickable }),
          disabled && "pointer-events-none cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      >
        {/* Optional leading icon */}
        {icon && (
          <span className="flex shrink-0 items-center justify-center">
            {React.isValidElement(icon)
              ? React.cloneElement(
                  icon as React.ReactElement<{ size?: number; className?: string }>,
                  {
                    size: iconSize,
                    className: cn("shrink-0", (icon.props as { className?: string })?.className),
                  }
                )
              : icon}
          </span>
        )}

        {/* Content */}
        <span className="truncate">{children}</span>

        {/* Remove button */}
        {removable && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className={cn(
              closeButtonVariants({ variant: selected ? "selected" : variant }),
              disabled && "cursor-not-allowed"
            )}
            aria-label={`Remove ${typeof children === "string" ? children : "chip"}`}
          >
            <X size={iconSize - 2} weight="bold" />
          </button>
        )}
      </div>
    );
  }
);

Chip.displayName = "Chip";

/* ============================================
   CHIP MORE COMPONENT
   Shows overflow count (+N) or dots
   ============================================ */

export interface ChipMoreProps extends VariantProps<typeof chipVariants> {
  /** Number of additional items (shows as "+N") */
  count?: number;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

const ChipMore = React.forwardRef<HTMLButtonElement, ChipMoreProps>(
  (
    { count, variant = "neutral", size = "md", onClick, disabled = false, className, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          chipVariants({ variant, size, clickable: true }),
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        aria-label={count !== undefined ? `Show ${count} more items` : "Show more"}
        {...props}
      >
        {count !== undefined ? `+${count}` : <DotsThree size={16} weight="bold" />}
      </button>
    );
  }
);

ChipMore.displayName = "ChipMore";

/* ============================================
   CHIP GROUP COMPONENT
   Container for multiple chips with optional truncation
   ============================================ */

export interface ChipGroupProps {
  /** Chips to display */
  children: React.ReactNode;
  /** Label for the group */
  label?: string;
  /** Maximum chips to show before truncating */
  maxVisible?: number;
  /** Callback when "+N more" is clicked */
  onShowMore?: () => void;
  /** Gap between chips (default: 2 = 8px) */
  gap?: 1 | 1.5 | 2 | 3;
  /** Additional class names */
  className?: string;
}

const ChipGroup = React.forwardRef<HTMLDivElement, ChipGroupProps>(
  ({ children, label, maxVisible, onShowMore, gap = 2, className, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visibleChildren = maxVisible ? childArray.slice(0, maxVisible) : childArray;
    const hiddenCount = maxVisible ? Math.max(0, childArray.length - maxVisible) : 0;

    const gapClass = {
      1: "gap-1",
      1.5: "gap-1.5",
      2: "gap-2",
      3: "gap-3",
    }[gap];

    return (
      <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
        {label && <span className="text-sm text-[var(--foreground-muted)]">{label}</span>}
        <div role="list" className={cn("flex flex-wrap items-center", gapClass)}>
          {visibleChildren}
          {hiddenCount > 0 && <ChipMore count={hiddenCount} onClick={onShowMore} />}
        </div>
      </div>
    );
  }
);

ChipGroup.displayName = "ChipGroup";

/* ============================================
   ADD CHIP BUTTON
   Dashed button to add new chips
   ============================================ */

export interface AddChipButtonProps {
  /** Button text */
  children?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

const AddChipButton = React.forwardRef<HTMLButtonElement, AddChipButtonProps>(
  ({ children = "Add", onClick, size = "md", disabled = false, className, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-7 px-2.5 text-sm",
      md: "h-8 px-3 text-sm",
      lg: "h-10 px-4 text-base",
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full",
          "border-2 border-dashed",
          "border-[var(--chip-add-border)]",
          "text-[var(--chip-add-foreground)]",
          "font-medium",
          "hover:border-[var(--chip-add-border-hover)]",
          "hover:text-[var(--chip-add-foreground-hover)]",
          "hover:bg-[var(--chip-add-background-hover)]",
          "transition-colors duration-150 ease-out",
          "focus-visible:outline-none",
          sizeClasses[size],
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      >
        <Plus size={size === "sm" ? 14 : size === "lg" ? 18 : 16} weight="bold" />
        {children}
      </button>
    );
  }
);

AddChipButton.displayName = "AddChipButton";

/* ============================================
   EXPORTS
   ============================================ */

export { Chip, ChipMore, ChipGroup, AddChipButton, chipVariants, closeButtonVariants };

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * SplitButton - A compound button with two independently interactive sections
 * separated by a divider. Used for actions with a primary action + dropdown.
 *
 * @figma https://figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System?node-id=6173-22849
 *
 * Figma specs:
 * - Border radius: 16px (rounded-2xl)
 * - Text section: px-16px py-14px, 14px font bold
 * - Icon section: p-12px, 24px icon
 * - Divider: semi-transparent border between sections
 * - Independent hover per section (left or right)
 *
 * Variants: Outline, Primary, Secondary, Tertiary
 * Layouts: "text-icon" (text left + icon right), "icon-icon" (icon left + icon right)
 */

const splitButtonVariants = cva(
  [
    "inline-flex items-center overflow-clip",
    "rounded-2xl",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        primary: "bg-[var(--button-primary-background)] text-[var(--button-primary-foreground)]",
        secondary:
          "bg-[var(--button-secondary-background)] text-[var(--button-secondary-foreground)]",
        tertiary: "bg-[var(--button-tertiary-background)] text-[var(--button-tertiary-foreground)]",
        outline: [
          "bg-[var(--button-outline-background)] text-[var(--button-outline-foreground)]",
          "border border-[var(--border-default)]",
        ],
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
);

type SplitButtonVariant = "primary" | "secondary" | "tertiary" | "outline";

const dividerStyles: Record<SplitButtonVariant, string> = {
  primary: "border-r border-white/[0.12]",
  secondary: "border-r border-white/50",
  tertiary: "border-r border-white/50",
  outline: "border-r border-[var(--border-default)]",
};

const hoverStyles: Record<SplitButtonVariant, string> = {
  primary: [
    "hover:bg-[var(--button-primary-background-hover)]",
    "active:bg-[var(--button-primary-background-hover)]",
    "data-[selected=true]:bg-[var(--button-primary-background-hover)]",
  ].join(" "),
  secondary: [
    "hover:bg-[var(--button-secondary-background-hover)]",
    "active:bg-[var(--button-secondary-background-hover)]",
    "data-[selected=true]:bg-[var(--button-secondary-background-hover)]",
  ].join(" "),
  tertiary: [
    "hover:bg-[var(--button-tertiary-background-hover)]",
    "active:bg-[var(--button-tertiary-background-hover)]",
    "data-[selected=true]:bg-[var(--button-tertiary-background-hover)]",
  ].join(" "),
  outline: [
    "hover:bg-[var(--primitive-neutral-100)]",
    "active:bg-[var(--primitive-neutral-100)]",
    "data-[selected=true]:bg-[var(--primitive-neutral-100)]",
  ].join(" "),
};

export interface SplitButtonProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof splitButtonVariants> {
  /** Text label for the primary (left) section. If omitted, uses icon-only layout. */
  label?: string;
  /** Icon for the left section in icon-only mode */
  leftIcon?: React.ReactNode;
  /** Icon for the right section. Defaults to CaretDown. */
  rightIcon?: React.ReactNode;
  /** Callback when the left (text/primary) section is clicked */
  onPrimaryClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Callback when the right (icon/secondary) section is clicked */
  onSecondaryClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Mark the primary (left) section as selected — keeps hover bg persistent */
  primarySelected?: boolean;
  /** Mark the secondary (right) section as selected — keeps hover bg persistent */
  secondarySelected?: boolean;
  /** Disable the entire button */
  disabled?: boolean;
}

const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      className,
      variant = "outline",
      label,
      leftIcon,
      rightIcon,
      onPrimaryClick,
      onSecondaryClick,
      primarySelected = false,
      secondarySelected = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const resolvedVariant = variant ?? "outline";
    const divider = dividerStyles[resolvedVariant];
    const hover = hoverStyles[resolvedVariant];

    const isTextIcon = !!label;

    return (
      <div
        ref={ref}
        className={cn(
          splitButtonVariants({ variant }),
          disabled && "pointer-events-none opacity-50",
          className
        )}
        {...props}
      >
        {/* Left section */}
        <button
          type="button"
          disabled={disabled}
          onClick={onPrimaryClick}
          data-selected={primarySelected ? "true" : undefined}
          className={cn(
            "flex shrink-0 items-center justify-center transition-colors duration-150",
            divider,
            hover,
            isTextIcon ? "gap-0 px-4 py-3.5 text-sm font-bold leading-5" : "p-3"
          )}
          style={isTextIcon ? { minWidth: 110 } : undefined}
        >
          {isTextIcon ? (
            <span className="text-center">{label}</span>
          ) : (
            <span className="inline-flex shrink-0">
              {leftIcon ?? <CaretUp size={24} weight="bold" />}
            </span>
          )}
        </button>

        {/* Right section */}
        <button
          type="button"
          disabled={disabled}
          onClick={onSecondaryClick}
          data-selected={secondarySelected ? "true" : undefined}
          className={cn(
            "flex shrink-0 items-center justify-center p-3 transition-colors duration-150",
            hover
          )}
        >
          <span className="inline-flex shrink-0">
            {rightIcon ?? <CaretDown size={24} weight="bold" />}
          </span>
        </button>
      </div>
    );
  }
);

SplitButton.displayName = "SplitButton";

export { SplitButton, splitButtonVariants };

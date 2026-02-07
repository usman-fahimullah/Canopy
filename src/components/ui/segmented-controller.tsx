"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * SegmentedController component based on Figma Design (188:7308)
 *
 * Figma Specs:
 * - Container: rounded-2xl (16px), neutral-200 background (#f2ede9), p-1 (4px) padding
 * - Selected tab: white background, rounded-xl (12px), shadow 1px 3px 16px rgba(31,29,28,0.08)
 * - Selected text: Bold (700), green-800 (#0A3D2C), 14px
 * - Selected icon: green-800 (#0A3D2C)
 * - Unselected text: Regular (400), neutral-700 (#3d3a37), 14px
 * - Unselected icon: neutral-600 (#3d3a37)
 * - Tab padding: 12px, gap between icon and text: 4px
 * - Icon size: 16px
 */

const segmentedControllerVariants = cva(
  // Figma: bg #f2ede9 (neutral-200), rounded-2xl (16px), p-1 (4px)
  "inline-grid rounded-2xl bg-[var(--primitive-neutral-200)] p-1 relative",
  {
    variants: {
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      fullWidth: false,
    },
  }
);

export interface SegmentedControllerOption {
  value: string;
  label: string;
  /** Optional icon to display before the label */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControllerProps extends VariantProps<typeof segmentedControllerVariants> {
  /** Array of options to display (2-5 items) */
  options: SegmentedControllerOption[];
  /** Currently selected value */
  value?: string;
  /** Default selected value (uncontrolled) */
  defaultValue?: string;
  /** Callback when selection changes */
  onValueChange?: (value: string) => void;
  /** Disable the entire controller */
  disabled?: boolean;
  /** Additional class names for the container */
  className?: string;
  /** Accessible label for the group */
  "aria-label"?: string;
}

const SegmentedController = React.forwardRef<HTMLDivElement, SegmentedControllerProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onValueChange,
      disabled = false,
      fullWidth = false,
      className,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || options[0]?.value);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const value = controlledValue ?? internalValue;
    const selectedIndex = options.findIndex((opt) => opt.value === value);

    const handleSelect = (optionValue: string, optionDisabled?: boolean) => {
      if (disabled || optionDisabled) return;

      if (controlledValue === undefined) {
        setInternalValue(optionValue);
      }
      onValueChange?.(optionValue);
    };

    const handleKeyDown = (
      e: React.KeyboardEvent,
      index: number,
      optionValue: string,
      optionDisabled?: boolean
    ) => {
      if (disabled || optionDisabled) return;

      const enabledOptions = options.filter((opt) => !opt.disabled);
      const currentEnabledIndex = enabledOptions.findIndex((opt) => opt.value === optionValue);

      let newIndex = currentEnabledIndex;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          handleSelect(optionValue, optionDisabled);
          return;
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          newIndex = (currentEnabledIndex + 1) % enabledOptions.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          newIndex = (currentEnabledIndex - 1 + enabledOptions.length) % enabledOptions.length;
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = enabledOptions.length - 1;
          break;
        default:
          return;
      }

      const nextOption = enabledOptions[newIndex];
      handleSelect(nextOption.value, nextOption.disabled);

      // Focus the next button
      const buttons = containerRef.current?.querySelectorAll('[role="tab"]');
      const nextButtonIndex = options.findIndex((opt) => opt.value === nextOption.value);
      (buttons?.[nextButtonIndex] as HTMLElement)?.focus();
    };

    // Calculate the width percentage for each tab
    const tabWidthPercent = 100 / options.length;

    return (
      <div
        ref={(node) => {
          // Handle both refs
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          segmentedControllerVariants({ fullWidth }),
          "surface-level-2",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(80px, 1fr))`,
        }}
        {...props}
      >
        {/* Sliding pill indicator */}
        <div
          // Figma: white bg, rounded-xl (12px), shadow 1px 3px 16px rgba(31,29,28,0.08)
          className="absolute bottom-1 top-1 rounded-xl bg-[var(--background-default)] shadow-[1px_3px_16px_0px_rgba(31,29,28,0.08)] transition-[left] duration-200 ease-out"
          style={{
            left: `calc(${selectedIndex * tabWidthPercent}% + 4px)`,
            width: `calc(${tabWidthPercent}% - 8px)`,
          }}
        />

        {options.map((option, index) => {
          const isSelected = value === option.value;
          const isDisabled = disabled || option.disabled;

          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={isSelected}
              disabled={isDisabled}
              tabIndex={isSelected ? 0 : -1}
              className={cn(
                "relative z-10 flex items-center justify-center",
                // Figma: rounded-xl (12px), p-3 (12px)
                "rounded-xl p-3",
                // Figma: 14px font, gap 4px
                "ease-default whitespace-nowrap text-sm transition-all duration-150",
                "outline-none",
                // Figma: selected = green-800 (#0A3D2C), unselected = neutral-700 (#3d3a37)
                isSelected
                  ? "text-[var(--primitive-green-800)]"
                  : "text-[var(--primitive-neutral-700)]",
                !isSelected && !isDisabled && "hover:bg-[var(--surface-hover)]",
                isDisabled && "cursor-not-allowed"
              )}
              onClick={() => handleSelect(option.value, option.disabled)}
              onKeyDown={(e) => handleKeyDown(e, index, option.value, option.disabled)}
            >
              {/* Invisible bold text to reserve space and prevent layout shift */}
              <span className="invisible flex items-center gap-1 font-bold" aria-hidden="true">
                {option.icon && <span className="h-4 w-4 shrink-0">{option.icon}</span>}
                {option.label}
              </span>
              {/* Visible content positioned absolutely over the invisible text */}
              <span
                className={cn(
                  // Figma: gap 4px between icon and text
                  "absolute inset-0 flex items-center justify-center gap-1",
                  // Figma: selected = bold, unselected = regular
                  isSelected ? "font-bold" : "font-normal"
                )}
              >
                {option.icon && (
                  // Figma: 16px icon, selected = green-800, unselected = neutral-600
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center",
                      "[&>svg]:h-4 [&>svg]:w-4",
                      isSelected
                        ? "text-[var(--primitive-green-800)]"
                        : "text-[var(--primitive-neutral-600)]"
                    )}
                  >
                    {option.icon}
                  </span>
                )}
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }
);

SegmentedController.displayName = "SegmentedController";

export { SegmentedController, segmentedControllerVariants };

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Slider component based on Trails Design System
 *
 * Specs:
 * - Track height: 24px (full pill shape)
 * - Track background: neutral-200 (#F2EDE9)
 * - Filled track: variant color, extends to fully contain thumb
 * - Thumb: 24px outer ring (matches track/fill color)
 *         18px white inner circle
 *         6px center dot (grows to 10px on hover)
 * - Two variants: default (blue-500), poppy (orange-500)
 *
 * Thumb States:
 * - Inactive (0%): neutral-200 outer, neutral-400 center dot (6px)
 * - Default (>0%): variant color outer, variant color center dot (6px)
 * - Hover: center dot grows to 10px
 */

const sliderVariants = cva("", {
  variants: {
    variant: {
      default: "",
      poppy: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface SliderProps extends VariantProps<typeof sliderVariants> {
  /** Current value (0-100) */
  value?: number;
  /** Default value */
  defaultValue?: number;
  /** Maximum value */
  max?: number;
  /** Minimum value */
  min?: number;
  /** Step increment */
  step?: number;
  /** Callback when value changes */
  onValueChange?: (value: number) => void;
  /** Show the current value as a label */
  showValue?: boolean;
  /** Label text above the slider */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      variant = "default",
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      showValue,
      label,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const trackRef = React.useRef<HTMLDivElement>(null);

    // Use controlled value if provided, otherwise use internal state
    const value = controlledValue ?? internalValue;
    const percentage = Math.round(((value - min) / (max - min)) * 100);
    const isAtZero = value === min;

    // Colors based on variant - using CSS custom property values
    // These are accessed via getComputedStyle at runtime for proper dark mode support
    const variantColor =
      variant === "poppy" ? "var(--primitive-orange-500)" : "var(--primitive-blue-500)";
    // Use CSS variable values that respond to dark mode
    const trackBgColor = "var(--background-muted)";
    const dotInactiveColor = "var(--border-emphasis)";

    // Calculate thumb position (accounting for thumb width)
    const thumbSize = 24;
    const getThumbLeft = (val: number) => {
      if (!trackRef.current) return 0;
      const trackWidth = trackRef.current.offsetWidth;
      const usableWidth = trackWidth - thumbSize;
      return ((val - min) / (max - min)) * usableWidth;
    };

    // Calculate value from mouse/touch position
    const getValueFromPosition = React.useCallback(
      (clientX: number) => {
        if (!trackRef.current) return value;
        const rect = trackRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const trackWidth = rect.width;
        const usableWidth = trackWidth - thumbSize;
        const adjustedX = x - thumbSize / 2;
        const ratio = adjustedX / usableWidth;
        const rawValue = min + ratio * (max - min);
        const steppedValue = Math.round(rawValue / step) * step;
        return Math.max(min, Math.min(max, steppedValue));
      },
      [min, max, step, value]
    );

    const updateValue = React.useCallback(
      (newValue: number) => {
        if (disabled) return;
        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [disabled, controlledValue, onValueChange]
    );

    // Mouse handlers
    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);

      const handleMouseMove = (e: MouseEvent) => {
        const newValue = getValueFromPosition(e.clientX);
        updateValue(newValue);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      // Initial click position
      const newValue = getValueFromPosition(e.clientX);
      updateValue(newValue);
    };

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
      if (disabled) return;
      setIsDragging(true);

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        const newValue = getValueFromPosition(touch.clientX);
        updateValue(newValue);
      };

      const handleTouchEnd = () => {
        setIsDragging(false);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
    };

    // Keyboard handlers
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      let newValue = value;
      const largeStep = step * 10;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          newValue = Math.min(max, value + (e.shiftKey ? largeStep : step));
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          newValue = Math.max(min, value - (e.shiftKey ? largeStep : step));
          break;
        case "Home":
          e.preventDefault();
          newValue = min;
          break;
        case "End":
          e.preventDefault();
          newValue = max;
          break;
        default:
          return;
      }

      updateValue(newValue);
    };

    const showHoverState = isHovered || isDragging;

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {(label || showValue) && (
          <div className="mb-2 flex items-center justify-between">
            {label && <span className="text-body text-foreground">{label}</span>}
            {showValue && <span className="text-body text-foreground-muted">{percentage}%</span>}
          </div>
        )}

        {/* Track container */}
        <div
          ref={trackRef}
          className={cn(
            "relative h-6 w-full cursor-pointer rounded-full",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50"
          )}
          style={{ backgroundColor: trackBgColor }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => !isDragging && setIsHovered(false)}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
        >
          {/* Filled track - extends to include thumb */}
          {value > min && (
            <div
              className="absolute h-full rounded-full transition-[width] duration-75 ease-out"
              style={{
                backgroundColor: variantColor,
                width: getThumbLeft(value) + thumbSize,
              }}
            />
          )}

          {/* Thumb */}
          <div
            className={cn(
              "absolute top-0 h-6 w-6 rounded-full",
              "flex items-center justify-center",
              "transition-[left] duration-75 ease-out",
              !disabled && "cursor-grab",
              isDragging && "cursor-grabbing"
            )}
            style={{
              left: getThumbLeft(value),
              backgroundColor: isAtZero ? trackBgColor : variantColor,
            }}
          >
            {/* White inner circle */}
            <div
              className="flex items-center justify-center rounded-full bg-surface"
              style={{ width: 18, height: 18 }}
            >
              {/* Center dot */}
              <div
                className="rounded-full transition-all duration-150 ease-out"
                style={{
                  width: showHoverState ? 10 : 6,
                  height: showHoverState ? 10 : 6,
                  backgroundColor: isAtZero && !showHoverState ? dotInactiveColor : variantColor,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider, sliderVariants };

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

/**
 * Toolbar component based on Trails Design System
 * Figma: node-id=5211-4845
 *
 * Structure:
 * - Container: white bg, rounded-2xl (16px), shadow, px-3 py-2
 * - Groups: bg neutral-100, rounded-xl (12px), p-1
 * - Selected: white bg, shadow, dark icon (#0A3D2C)
 * - Unselected: muted icon (#7a7671)
 *
 * Icon size: 24px
 * Icon weight: bold (for all toolbar icons per Figma)
 * Button padding: 8px (p-2) for standalone, px-2 py-1 for grouped
 *
 * Functionality:
 * - Keyboard navigation (Arrow keys, Home/End)
 * - Single-select toggle groups (alignment, lists)
 * - Multi-select toggle groups (bold + italic can both be on)
 * - Tooltips with keyboard shortcuts
 * - Disabled states
 */

/* ============================================
   Toolbar Context
   ============================================ */
interface ToolbarContextValue {
  orientation: "horizontal" | "vertical";
  disabled?: boolean;
}

const ToolbarContext = React.createContext<ToolbarContextValue>({
  orientation: "horizontal",
  disabled: false,
});

/* ============================================
   Toolbar Root
   ============================================ */
interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  "aria-label"?: string;
}

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  (
    {
      className,
      children,
      orientation = "horizontal",
      disabled = false,
      "aria-label": ariaLabel = "Formatting toolbar",
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const toolbarRef = React.useRef<HTMLDivElement>(null);
    const combinedRef = useCombinedRefs(ref, toolbarRef);

    // Keyboard navigation within toolbar
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const toolbar = toolbarRef.current;
        if (!toolbar) return;

        const buttons = Array.from(
          toolbar.querySelectorAll<HTMLButtonElement>(
            'button:not([disabled]), [role="button"]:not([disabled])'
          )
        );
        const currentIndex = buttons.findIndex((btn) => btn === document.activeElement);

        let nextIndex = currentIndex;
        const isHorizontal = orientation === "horizontal";

        switch (e.key) {
          case "ArrowRight":
          case "ArrowDown":
            if (
              (isHorizontal && e.key === "ArrowRight") ||
              (!isHorizontal && e.key === "ArrowDown")
            ) {
              e.preventDefault();
              nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
            }
            break;
          case "ArrowLeft":
          case "ArrowUp":
            if ((isHorizontal && e.key === "ArrowLeft") || (!isHorizontal && e.key === "ArrowUp")) {
              e.preventDefault();
              nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
            }
            break;
          case "Home":
            e.preventDefault();
            nextIndex = 0;
            break;
          case "End":
            e.preventDefault();
            nextIndex = buttons.length - 1;
            break;
        }

        if (nextIndex !== currentIndex && buttons[nextIndex]) {
          buttons[nextIndex].focus();
        }

        onKeyDown?.(e);
      },
      [orientation, onKeyDown]
    );

    return (
      <ToolbarContext.Provider value={{ orientation, disabled }}>
        <TooltipProvider delayDuration={400}>
          <div
            ref={combinedRef}
            role="toolbar"
            aria-label={ariaLabel}
            aria-orientation={orientation}
            aria-disabled={disabled}
            onKeyDown={handleKeyDown}
            className={cn(
              // Figma: white bg, rounded-2xl (16px), shadow 1px 3px 16px rgba(31,29,28,0.08), px-3 (12px) py-2 (8px)
              "inline-flex items-center",
              "px-3 py-2",
              "rounded-2xl bg-[var(--background-default)]",
              "shadow-[1px_3px_16px_0px_rgba(31,29,28,0.08)]",
              // Figma: gap-6 (24px) between major sections
              "gap-6",
              disabled && "pointer-events-none opacity-50",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </ToolbarContext.Provider>
    );
  }
);
Toolbar.displayName = "Toolbar";

/* ============================================
   ToolbarSection - Main content sections
   Figma: flex-1 for standard section, shrink-0 for actions
   ============================================ */
interface ToolbarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ToolbarSection = React.forwardRef<HTMLDivElement, ToolbarSectionProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      // Figma: gap-6 (24px) between groups within section
      className={cn("flex items-center gap-6", className)}
      {...props}
    >
      {children}
    </div>
  )
);
ToolbarSection.displayName = "ToolbarSection";

/* ============================================
   ToolbarGroup - Groups related buttons
   Figma: standalone buttons with gap-2, OR grouped with bg-neutral-100
   ============================================ */
interface ToolbarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** "plain" = standalone buttons, "grouped" = bg container with rounded corners */
  variant?: "plain" | "grouped";
  "aria-label"?: string;
}

const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, children, variant = "plain", "aria-label": ariaLabel, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "flex items-center",
        // Figma: grouped = bg #faf9f7 (neutral-100), rounded-xl (12px), p-1 (4px)
        variant === "grouped" && "rounded-xl bg-[var(--primitive-neutral-100)] p-1",
        // Figma: plain = gap-2 (8px) between standalone items (Bold/Italic)
        variant === "plain" && "gap-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ToolbarGroup.displayName = "ToolbarGroup";

/* ============================================
   ToolbarButton - Individual button
   Figma specs:
   - Icon size: 24px
   - Icon weight: bold
   - Standalone: p-2 (8px padding = 40px total)
   - Grouped: px-2 py-1 (8px/4px padding = 40x32 total)

   Selected states (two different styles):
   - Standalone selected: bg neutral-200 (#f2ede9), no shadow, icon #0A3D2C
   - Grouped selected (inside toggle group): bg white, shadow, icon #0A3D2C

   Unselected: icon #7a7671
   ============================================ */
interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
  /** Whether button is inside a grouped container (affects selected styling) */
  grouped?: boolean;
  tooltip?: string;
  shortcut?: string;
  /** Show loading spinner */
  loading?: boolean;
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      className,
      children,
      selected = false,
      grouped = false,
      tooltip,
      shortcut,
      disabled,
      loading,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(ToolbarContext);
    const isDisabled = disabled || context.disabled || loading;

    const button = (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        disabled={isDisabled}
        className={cn(
          "flex items-center justify-center",
          "rounded-lg",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-1",
          "disabled:pointer-events-none disabled:opacity-50",
          // Figma: grouped = px-2 py-1 (total 40x32), standalone = p-2 (total 40x40)
          grouped ? "px-2 py-1" : "p-2",
          // Figma: Selected states differ based on grouped vs standalone
          selected &&
            grouped && [
              // Grouped selected: white bg with shadow (inside toggle groups)
              "bg-[var(--background-default)]",
              "shadow-[1px_2px_16px_0px_rgba(31,29,28,0.08)]",
              "text-[var(--primitive-green-900)]",
            ],
          selected &&
            !grouped && [
              // Standalone selected: neutral-200 bg, no shadow (Bold/Italic buttons)
              "bg-[var(--primitive-neutral-200)]",
              "text-[var(--primitive-green-900)]",
            ],
          // Figma: unselected = icon color #7a7671 (neutral-600)
          !selected &&
            !isDisabled && [
              "text-[var(--primitive-neutral-600)]",
              "hover:text-[var(--primitive-green-900)]",
              grouped ? "hover:bg-white/50" : "hover:bg-[var(--background-interactive-hover)]",
              "active:bg-white/80",
            ],
          className
        )}
        {...props}
      >
        {/* Figma: icon size 24px */}
        <span className="flex h-6 w-6 items-center justify-center [&>svg]:h-6 [&>svg]:w-6">
          {loading ? (
            <svg
              className="animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            children
          )}
        </span>
      </button>
    );

    if (tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="bottom" className="flex flex-col items-center gap-0.5">
            <span>{tooltip}</span>
            {shortcut && <span className="text-xs text-foreground-subtle">{shortcut}</span>}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  }
);
ToolbarButton.displayName = "ToolbarButton";

/* ============================================
   ToolbarToggleGroup - Mutually exclusive toggles (single-select)
   Figma: bg #faf9f7 (neutral-100), rounded-xl (12px), p-1
   ============================================ */
interface ToolbarToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Current selected value (single-select mode) */
  value?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Allow deselecting current value by clicking again */
  allowDeselect?: boolean;
  "aria-label"?: string;
}

const ToolbarToggleGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  allowDeselect?: boolean;
  type: "single" | "multiple";
  values?: string[];
  onValuesChange?: (values: string[]) => void;
}>({ type: "single" });

const ToolbarToggleGroup = React.forwardRef<HTMLDivElement, ToolbarToggleGroupProps>(
  (
    {
      className,
      children,
      value,
      onValueChange,
      allowDeselect = false,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => (
    <ToolbarToggleGroupContext.Provider
      value={{ value, onValueChange, allowDeselect, type: "single" }}
    >
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          // Figma: bg #faf9f7 (neutral-100), rounded-xl (12px), p-1
          "flex items-center",
          "overflow-clip rounded-xl bg-[var(--primitive-neutral-100)] p-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ToolbarToggleGroupContext.Provider>
  )
);
ToolbarToggleGroup.displayName = "ToolbarToggleGroup";

/* ============================================
   ToolbarMultiToggleGroup - Multiple toggles can be active (multi-select)
   Use for things like Bold + Italic where both can be on
   ============================================ */
interface ToolbarMultiToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Array of currently selected values */
  values?: string[];
  /** Callback when values change */
  onValuesChange?: (values: string[]) => void;
  "aria-label"?: string;
}

const ToolbarMultiToggleGroup = React.forwardRef<HTMLDivElement, ToolbarMultiToggleGroupProps>(
  (
    { className, children, values = [], onValuesChange, "aria-label": ariaLabel, ...props },
    ref
  ) => (
    <ToolbarToggleGroupContext.Provider value={{ values, onValuesChange, type: "multiple" }}>
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          // Same styling as single toggle group
          "flex items-center",
          "overflow-clip rounded-xl bg-[var(--primitive-neutral-100)] p-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ToolbarToggleGroupContext.Provider>
  )
);
ToolbarMultiToggleGroup.displayName = "ToolbarMultiToggleGroup";

/* ============================================
   ToolbarToggleItem
   ============================================ */
interface ToolbarToggleItemProps extends Omit<ToolbarButtonProps, "selected" | "grouped"> {
  value: string;
}

const ToolbarToggleItem = React.forwardRef<HTMLButtonElement, ToolbarToggleItemProps>(
  ({ value, onClick, ...props }, ref) => {
    const context = React.useContext(ToolbarToggleGroupContext);

    // Determine if selected based on group type
    const isSelected =
      context.type === "multiple"
        ? (context.values?.includes(value) ?? false)
        : context.value === value;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (context.type === "multiple") {
        // Multi-select: toggle the value in the array
        const currentValues = context.values ?? [];
        const newValues = isSelected
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        context.onValuesChange?.(newValues);
      } else {
        // Single-select: set value or deselect if allowed
        if (isSelected && context.allowDeselect) {
          context.onValueChange?.("");
        } else if (!isSelected) {
          context.onValueChange?.(value);
        }
      }
      onClick?.(e);
    };

    return (
      <ToolbarButton ref={ref} selected={isSelected} grouped onClick={handleClick} {...props} />
    );
  }
);
ToolbarToggleItem.displayName = "ToolbarToggleItem";

/* ============================================
   ToolbarSeparator
   ============================================ */
const ToolbarSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn("mx-1 h-6 w-px bg-border", className)}
      {...props}
    />
  )
);
ToolbarSeparator.displayName = "ToolbarSeparator";

/* ============================================
   ToolbarSpacer - Flexible space between sections
   Figma: flex-1 to push right section to the end
   ============================================ */
const ToolbarSpacer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("min-w-0 flex-1", className)} {...props} />
  )
);
ToolbarSpacer.displayName = "ToolbarSpacer";

/* ============================================
   ToolbarLabel
   ============================================ */
const ToolbarLabel = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("select-none px-2 text-sm text-foreground-muted", className)}
      {...props}
    >
      {children}
    </span>
  )
);
ToolbarLabel.displayName = "ToolbarLabel";

/* ============================================
   ToolbarActions - Right-aligned action buttons
   Figma: bg white, p-1, rounded-lg
   ============================================ */
interface ToolbarActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ToolbarActions = React.forwardRef<HTMLDivElement, ToolbarActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        "overflow-clip rounded-lg bg-[var(--background-default)] p-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ToolbarActions.displayName = "ToolbarActions";

/* ============================================
   Utility: Combine refs
   ============================================ */
function useCombinedRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return React.useCallback(
    (element: T) => {
      refs.forEach((ref) => {
        if (!ref) return;
        if (typeof ref === "function") {
          ref(element);
        } else {
          (ref as React.MutableRefObject<T>).current = element;
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}

export {
  Toolbar,
  ToolbarSection,
  ToolbarGroup,
  ToolbarButton,
  ToolbarToggleGroup,
  ToolbarMultiToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
  ToolbarSpacer,
  ToolbarLabel,
  ToolbarActions,
};

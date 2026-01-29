"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/**
 * CoachTip Component based on Trails Design System
 *
 * An interactive tooltip used for onboarding, feature tours, and contextual tips.
 * Unlike simple tooltips, CoachTips:
 * - Are persistent (don't close on hover out)
 * - Can have pagination for multi-step tours
 * - Support titles and close buttons
 * - Have action buttons (Back/Next)
 *
 * Types:
 * - Paginated: Full coach tip with title, content, pagination, and navigation buttons
 * - Single: Title, content, and close button
 * - Single Not Title: Content and close button only (similar to enhanced tooltip)
 */

// ============================================
// CARET/ARROW COMPONENT
// ============================================

interface CaretProps {
  side: "top" | "bottom" | "left" | "right";
  className?: string;
}

const Caret = ({ side, className }: CaretProps) => {
  const isVertical = side === "top" || side === "bottom";
  const width = isVertical ? 25 : 13;
  const height = isVertical ? 13 : 25;

  // SVG paths for the caret pointing in each direction
  const paths = {
    top: "M12.5 0L0 13H25L12.5 0Z",
    bottom: "M12.5 13L0 0H25L12.5 13Z",
    left: "M0 12.5L13 0V25L0 12.5Z",
    right: "M13 12.5L0 0V25L13 12.5Z",
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={cn("shrink-0", className)}
    >
      <path d={paths[side]} fill="white" />
    </svg>
  );
};

// ============================================
// COACH TIP CONTEXT
// ============================================

interface CoachTipContextValue {
  open: boolean;
  onClose: () => void;
}

const CoachTipContext = React.createContext<CoachTipContextValue | null>(null);

const useCoachTip = () => {
  const context = React.useContext(CoachTipContext);
  if (!context) {
    throw new Error("CoachTip components must be used within a CoachTip");
  }
  return context;
};

// ============================================
// COACH TIP ROOT
// ============================================

interface CoachTipProps {
  children: React.ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

const CoachTip = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: CoachTipProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const onClose = React.useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  return (
    <CoachTipContext.Provider value={{ open, onClose }}>
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        {children}
      </PopoverPrimitive.Root>
    </CoachTipContext.Provider>
  );
};

// ============================================
// COACH TIP TRIGGER
// ============================================

const CoachTipTrigger = PopoverPrimitive.Trigger;

// ============================================
// COACH TIP ANCHOR (for positioning without trigger)
// ============================================

const CoachTipAnchor = PopoverPrimitive.Anchor;

// ============================================
// COACH TIP CONTENT
// ============================================

type CoachTipType = "paginated" | "single" | "single-no-title";

interface CoachTipContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    "title"
  > {
  /** Type of coach tip */
  type?: CoachTipType;
  /** Title text (not shown for single-no-title) */
  title?: string;
  /** Main content/description */
  children: React.ReactNode;
  /** Position of the caret/arrow */
  caret?: "top" | "bottom" | "left" | "right";
  /** Current step (for paginated type) */
  currentStep?: number;
  /** Total steps (for paginated type) */
  totalSteps?: number;
  /** Primary button label (for paginated type) */
  primaryLabel?: string;
  /** Secondary button label (for paginated type) */
  secondaryLabel?: string;
  /** Primary button callback */
  onPrimaryClick?: () => void;
  /** Secondary button callback */
  onSecondaryClick?: () => void;
  /** Whether to show the close button */
  showClose?: boolean;
}

const CoachTipContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  CoachTipContentProps
>(
  (
    {
      className,
      type = "single",
      title,
      children,
      caret = "top",
      sideOffset = 0,
      currentStep,
      totalSteps,
      primaryLabel = "Next",
      secondaryLabel = "Back",
      onPrimaryClick,
      onSecondaryClick,
      showClose = true,
      ...props
    },
    ref
  ) => {
    const { onClose } = useCoachTip();
    const isPaginated = type === "paginated";
    const hasTitle = type !== "single-no-title";
    const isVerticalCaret = caret === "top" || caret === "bottom";

    // Map caret position to Radix side (opposite)
    const sideMap = {
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left",
    } as const;

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          side={sideMap[caret]}
          sideOffset={sideOffset}
          className={cn(
            "z-tooltip outline-none",
            "shadow-[var(--shadow-tooltip)]",
            // Animations
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2",
            // Layout for caret positioning
            "flex",
            isVerticalCaret ? "flex-col" : "flex-row",
            caret === "bottom" && "flex-col-reverse",
            caret === "right" && "flex-row-reverse",
            className
          )}
          {...props}
        >
          {/* Caret */}
          <div
            className={cn(
              "flex shrink-0",
              isVerticalCaret ? "justify-center" : "items-center"
            )}
          >
            <Caret side={caret} />
          </div>

          {/* Content Container */}
          <div
            className={cn(
              "bg-[var(--background-default)] rounded-xl p-4",
              "flex flex-col gap-2",
              "min-w-[240px] max-w-[320px]"
            )}
          >
            {/* Header with title and close */}
            {hasTitle && title && (
              <div className="flex items-start gap-3">
                <h3 className="flex-1 text-body-strong font-bold text-[var(--foreground-default)]">
                  {title}
                </h3>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="shrink-0 p-0.5 -m-0.5 rounded hover:bg-[var(--background-subtle)] transition-colors"
                    aria-label="Close"
                  >
                    <X
                      size={20}
                      weight="bold"
                      className="text-[var(--foreground-default)]"
                    />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div
              className={cn(
                "text-caption text-[var(--foreground-default)]",
                !hasTitle && showClose && "flex items-start gap-2"
              )}
            >
              <div className="flex-1">{children}</div>
              {!hasTitle && showClose && (
                <button
                  onClick={onClose}
                  className="shrink-0 p-0.5 -m-0.5 rounded hover:bg-[var(--background-subtle)] transition-colors"
                  aria-label="Close"
                >
                  <X
                    size={20}
                    weight="bold"
                    className="text-[var(--foreground-default)]"
                  />
                </button>
              )}
            </div>

            {/* Footer with pagination and buttons (paginated only) */}
            {isPaginated && (
              <div className="flex items-center gap-2 mt-1">
                {/* Pagination indicator */}
                <span className="flex-1 text-caption text-[var(--foreground-subtle)]">
                  {currentStep} of {totalSteps}
                </span>

                {/* Navigation buttons */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSecondaryClick}
                  className="text-[var(--foreground-brand)] hover:text-[var(--foreground-brand-emphasis)] font-bold"
                >
                  {secondaryLabel}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrimaryClick}
                  className="text-[var(--foreground-brand)] hover:text-[var(--foreground-brand-emphasis)] font-bold"
                >
                  {primaryLabel}
                </Button>
              </div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  }
);
CoachTipContent.displayName = "CoachTipContent";

// ============================================
// SIMPLE COACH TIP (Convenience wrapper)
// ============================================

export interface SimpleCoachTipProps {
  children: React.ReactNode;
  /** Title of the coach tip */
  title?: string;
  /** Content/description */
  content: React.ReactNode;
  /** Position of the caret */
  caret?: "top" | "bottom" | "left" | "right";
  /** Type of coach tip */
  type?: CoachTipType;
  /** Whether the coach tip is open */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** For paginated: current step */
  currentStep?: number;
  /** For paginated: total steps */
  totalSteps?: number;
  /** For paginated: primary button label */
  primaryLabel?: string;
  /** For paginated: secondary button label */
  secondaryLabel?: string;
  /** For paginated: primary button click handler */
  onPrimaryClick?: () => void;
  /** For paginated: secondary button click handler */
  onSecondaryClick?: () => void;
}

const SimpleCoachTip = ({
  children,
  title,
  content,
  caret = "top",
  type = "single",
  open,
  defaultOpen,
  onOpenChange,
  currentStep,
  totalSteps,
  primaryLabel,
  secondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
}: SimpleCoachTipProps) => (
  <CoachTip open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    <CoachTipTrigger asChild>{children}</CoachTipTrigger>
    <CoachTipContent
      type={type}
      title={title}
      caret={caret}
      currentStep={currentStep}
      totalSteps={totalSteps}
      primaryLabel={primaryLabel}
      secondaryLabel={secondaryLabel}
      onPrimaryClick={onPrimaryClick}
      onSecondaryClick={onSecondaryClick}
    >
      {content}
    </CoachTipContent>
  </CoachTip>
);

export {
  CoachTip,
  CoachTipTrigger,
  CoachTipAnchor,
  CoachTipContent,
  SimpleCoachTip,
  type CoachTipProps,
  type CoachTipContentProps,
  type CoachTipType,
};

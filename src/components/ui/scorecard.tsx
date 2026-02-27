"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Star } from "@phosphor-icons/react";

/**
 * Scorecard Components for ATS Candidate Evaluation
 *
 * Used for structured interviewer feedback and ratings.
 */

interface ScorecardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Scorecard = React.forwardRef<HTMLDivElement, ScorecardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border border-border bg-surface p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
);
Scorecard.displayName = "Scorecard";

interface ScorecardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
}

const ScorecardHeader = React.forwardRef<HTMLDivElement, ScorecardHeaderProps>(
  ({ className, title, subtitle, avatar, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-start gap-3 border-b border-border pb-4", className)}
      {...props}
    >
      {avatar}
      <div>
        <h3 className="text-body font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="mt-0.5 text-caption text-foreground-subtle">{subtitle}</p>}
      </div>
    </div>
  )
);
ScorecardHeader.displayName = "ScorecardHeader";

interface ScorecardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
}

const ScorecardSection = React.forwardRef<HTMLDivElement, ScorecardSectionProps>(
  ({ className, title, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-b border-border py-4 last:border-b-0", className)}
      {...props}
    >
      <h4 className="mb-3 text-body-sm font-medium text-foreground-muted">{title}</h4>
      {children}
    </div>
  )
);
ScorecardSection.displayName = "ScorecardSection";

interface ScorecardCriterionProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  description?: string;
  children: React.ReactNode;
}

const ScorecardCriterion = React.forwardRef<HTMLDivElement, ScorecardCriterionProps>(
  ({ className, label, description, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-start justify-between gap-4 py-2", className)}
      {...props}
    >
      <div className="flex-1">
        <p className="text-body-sm text-foreground">{label}</p>
        {description && <p className="mt-0.5 text-caption text-foreground-subtle">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
);
ScorecardCriterion.displayName = "ScorecardCriterion";

/**
 * Star rating input component with keyboard navigation and half-star support
 */
interface StarRatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  /** Allow half-star ratings (0.5 increments) */
  allowHalf?: boolean;
  /** Show numeric value next to stars */
  showValue?: boolean;
}

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  (
    {
      className,
      value,
      max = 5,
      onChange,
      readOnly = false,
      size = "md",
      allowHalf = false,
      showValue = false,
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);
    const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
    const buttonsRef = React.useRef<(HTMLButtonElement | null)[]>([]);

    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const step = allowHalf ? 0.5 : 1;
    const totalSteps = allowHalf ? max * 2 : max;

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      if (readOnly) return;

      let newValue = value;
      let newIndex = index;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          newValue = Math.min(max, value + step);
          newIndex = Math.min(totalSteps - 1, index + 1);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          newValue = Math.max(0, value - step);
          newIndex = Math.max(0, index - 1);
          break;
        case "Home":
          e.preventDefault();
          newValue = allowHalf ? 0.5 : 1;
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newValue = max;
          newIndex = totalSteps - 1;
          break;
        default:
          return;
      }

      onChange?.(newValue);
      buttonsRef.current[newIndex]?.focus();
    };

    const handleClick = (starValue: number, isHalf: boolean) => {
      if (readOnly) return;
      const newValue = isHalf ? starValue - 0.5 : starValue;
      onChange?.(newValue);
    };

    const getStarFill = (starIndex: number) => {
      const displayValue = hoverValue ?? value;
      const starValue = starIndex + 1;

      if (displayValue >= starValue) {
        return "full";
      } else if (allowHalf && displayValue >= starValue - 0.5) {
        return "half";
      }
      return "empty";
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-0.5", className)}
        role="slider"
        aria-label="Rating"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} out of ${max} stars`}
        {...props}
      >
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const fill = getStarFill(i);

          return (
            <button
              key={i}
              ref={(el) => {
                buttonsRef.current[i] = el;
              }}
              type="button"
              disabled={readOnly}
              tabIndex={
                readOnly ? -1 : focusedIndex === i || (focusedIndex === null && i === 0) ? 0 : -1
              }
              onClick={(e) => {
                if (allowHalf) {
                  // Calculate if click was on left or right half
                  const rect = e.currentTarget.getBoundingClientRect();
                  const isLeftHalf = e.clientX - rect.left < rect.width / 2;
                  handleClick(starValue, isLeftHalf);
                } else {
                  handleClick(starValue, false);
                }
              }}
              onMouseEnter={() => !readOnly && setHoverValue(starValue)}
              onMouseLeave={() => !readOnly && setHoverValue(null)}
              onMouseMove={(e) => {
                if (!readOnly && allowHalf) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const isLeftHalf = e.clientX - rect.left < rect.width / 2;
                  setHoverValue(isLeftHalf ? starValue - 0.5 : starValue);
                }
              }}
              onFocus={() => setFocusedIndex(i)}
              onBlur={() => setFocusedIndex(null)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={cn(
                "relative transition-transform",
                readOnly ? "cursor-default" : "cursor-pointer hover:scale-110",
                "rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]"
              )}
              aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            >
              {/* Unselected star (neutral filled) */}
              <Star
                weight="fill"
                className={cn(sizeClasses[size], "text-gray-200 dark:text-gray-600")}
              />
              {/* Selected star (yellow filled overlay) */}
              {fill !== "empty" && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: fill === "half" ? "50%" : "100%" }}
                >
                  <Star weight="fill" className={cn(sizeClasses[size], "text-yellow-400")} />
                </div>
              )}
            </button>
          );
        })}
        {showValue && (
          <span className="ml-2 text-body-sm tabular-nums text-foreground-muted">
            {value.toFixed(allowHalf ? 1 : 0)}/{max}
          </span>
        )}
      </div>
    );
  }
);
StarRating.displayName = "StarRating";

/**
 * Recommendation selector component
 */
type RecommendationType = "strong_yes" | "yes" | "neutral" | "no" | "strong_no";

interface RecommendationSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: RecommendationType;
  onChange?: (value: RecommendationType) => void;
}

const recommendations: {
  value: RecommendationType;
  label: string;
  color: string;
  bgColor: string;
}[] = [
  {
    value: "strong_yes",
    label: "Strong Yes",
    color: "text-[var(--primitive-green-700)] dark:text-[var(--primitive-green-400)]",
    bgColor:
      "bg-[var(--primitive-green-100)] dark:bg-[var(--primitive-green-500)]/20 hover:bg-[var(--primitive-green-200)] dark:hover:bg-[var(--primitive-green-500)]/30 data-[selected=true]:bg-[var(--primitive-green-600)] data-[selected=true]:text-[var(--foreground-on-emphasis)]",
  },
  {
    value: "yes",
    label: "Yes",
    color: "text-[var(--primitive-green-600)] dark:text-[var(--primitive-green-400)]",
    bgColor:
      "bg-[var(--primitive-green-100)]/50 dark:bg-[var(--primitive-green-500)]/15 hover:bg-[var(--primitive-green-100)] dark:hover:bg-[var(--primitive-green-500)]/25 data-[selected=true]:bg-[var(--primitive-green-500)] data-[selected=true]:text-[var(--foreground-on-emphasis)]",
  },
  {
    value: "neutral",
    label: "Neutral",
    color: "text-foreground dark:text-foreground-muted",
    bgColor:
      "bg-background-muted dark:bg-[var(--background-emphasized)] hover:bg-background-emphasized dark:hover:bg-[var(--primitive-neutral-700)] data-[selected=true]:bg-[var(--primitive-neutral-500)] data-[selected=true]:text-[var(--foreground-on-emphasis)]",
  },
  {
    value: "no",
    label: "No",
    color: "text-[var(--primitive-red-600)] dark:text-[var(--primitive-red-300)]",
    bgColor:
      "bg-[var(--primitive-red-100)] dark:bg-[var(--primitive-red-500)]/20 text-[var(--primitive-red-700)] dark:text-[var(--primitive-red-300)] hover:bg-[var(--primitive-red-200)] dark:hover:bg-[var(--primitive-red-500)]/30 data-[selected=true]:bg-[var(--primitive-red-500)] data-[selected=true]:text-[var(--foreground-on-emphasis)]",
  },
  {
    value: "strong_no",
    label: "Strong No",
    color: "text-[var(--primitive-red-700)] dark:text-[var(--primitive-red-300)]",
    bgColor:
      "bg-[var(--primitive-red-200)] dark:bg-[var(--primitive-red-500)]/30 text-[var(--primitive-red-800)] dark:text-[var(--primitive-red-300)] hover:bg-[var(--primitive-red-300)] dark:hover:bg-[var(--primitive-red-500)]/40 data-[selected=true]:bg-[var(--primitive-red-600)] data-[selected=true]:text-[var(--foreground-on-emphasis)]",
  },
];

const RecommendationSelect = React.forwardRef<HTMLDivElement, RecommendationSelectProps>(
  ({ className, value, onChange, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-wrap gap-2", className)}
      role="radiogroup"
      aria-label="Recommendation"
      {...props}
    >
      {recommendations.map((rec) => (
        <button
          key={rec.value}
          type="button"
          role="radio"
          aria-checked={value === rec.value}
          data-selected={value === rec.value}
          onClick={() => onChange?.(rec.value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-body-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]",
            rec.bgColor
          )}
        >
          {rec.label}
        </button>
      ))}
    </div>
  )
);
RecommendationSelect.displayName = "RecommendationSelect";

interface ScorecardSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  overallRating: number;
  recommendation?: RecommendationType;
  reviewerName?: string;
  reviewDate?: Date | string;
}

const ScorecardSummary = React.forwardRef<HTMLDivElement, ScorecardSummaryProps>(
  ({ className, overallRating, recommendation, reviewerName, reviewDate, ...props }, ref) => {
    const recData = recommendations.find((r) => r.value === recommendation);
    const dateFormatted =
      reviewDate &&
      new Date(reviewDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between rounded-lg bg-background-subtle p-4",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="mb-1 text-caption text-foreground-subtle">Overall Rating</p>
            <StarRating value={overallRating} readOnly size="lg" />
          </div>
          {recData && (
            <div>
              <p className="mb-1 text-caption text-foreground-subtle">Recommendation</p>
              <span
                className={cn(
                  "inline-block rounded px-2 py-1 text-body-sm font-medium",
                  recData.value.includes("yes")
                    ? "bg-[var(--background-success)] text-[var(--foreground-success)]"
                    : recData.value.includes("no")
                      ? "bg-[var(--background-error)] text-[var(--foreground-error)]"
                      : "bg-background-emphasized text-foreground-muted"
                )}
              >
                {recData.label}
              </span>
            </div>
          )}
        </div>
        {(reviewerName || dateFormatted) && (
          <div className="text-right">
            {reviewerName && (
              <p className="text-body-sm font-medium text-foreground">{reviewerName}</p>
            )}
            {dateFormatted && (
              <p className="text-caption text-foreground-subtle">{dateFormatted}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
ScorecardSummary.displayName = "ScorecardSummary";

export {
  Scorecard,
  ScorecardHeader,
  ScorecardSection,
  ScorecardCriterion,
  StarRating,
  RecommendationSelect,
  ScorecardSummary,
};

export type { RecommendationType };

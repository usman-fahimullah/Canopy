"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarGroup, type AvatarData } from "./avatar";
import { Badge } from "./badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import {
  ChatCircle,
  Calendar,
  Clock,
  Warning,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from "@phosphor-icons/react";

/**
 * Candidate Card Components for ATS
 *
 * Displays candidate information in pipeline views (Kanban) and list views.
 */

/**
 * Score color configuration for consistent theming
 */
const scoreConfig = {
  excellent: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
    fill: "bg-green-500",
  },
  good: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
    fill: "bg-blue-500",
  },
  average: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-400",
    fill: "bg-yellow-500",
  },
  poor: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    fill: "bg-red-500",
  },
} as const;

type ScoreLevel = keyof typeof scoreConfig;

/**
 * Decision types for reviewer recommendations
 * Standard ATS pattern: Strong Yes, Yes, Maybe, No
 */
type DecisionType = "strong_yes" | "yes" | "maybe" | "no" | "pending";

/**
 * Decision pill styling configuration
 * Colors based on semantic feedback: green for positive, amber for neutral, red for negative
 */
const decisionConfig: Record<DecisionType, {
  bg: string;
  text: string;
  border?: string;
  icon?: React.ElementType;
  label: string;
}> = {
  strong_yes: {
    bg: "bg-[var(--primitive-green-500)]",
    text: "text-white",
    icon: Heart,
    label: "Strong yes",
  },
  yes: {
    bg: "bg-[var(--primitive-green-100)]",
    text: "text-[var(--primitive-green-700)]",
    border: "border border-[var(--primitive-green-300)]",
    icon: ThumbsUp,
    label: "Yes",
  },
  maybe: {
    bg: "bg-[var(--primitive-yellow-100)]",
    text: "text-[var(--primitive-yellow-700)]",
    border: "border border-[var(--primitive-yellow-300)]",
    icon: Minus,
    label: "Maybe",
  },
  no: {
    bg: "bg-[var(--primitive-red-100)]",
    text: "text-[var(--primitive-red-700)]",
    border: "border border-[var(--primitive-red-300)]",
    icon: ThumbsDown,
    label: "No",
  },
  pending: {
    bg: "bg-[var(--primitive-neutral-200)]",
    text: "text-[var(--primitive-neutral-600)]",
    label: "Pending",
  },
};

/**
 * DecisionPill - Displays reviewer recommendation status
 * Shows colored pills with icons for Strong Yes, Yes, Maybe, No
 */
interface DecisionPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Decision type */
  decision: DecisionType;
  /** Show icon alongside text */
  showIcon?: boolean;
  /** Size variant */
  size?: "sm" | "default";
}

const DecisionPill = React.forwardRef<HTMLSpanElement, DecisionPillProps>(
  ({ className, decision, showIcon = true, size = "default", ...props }, ref) => {
    const config = decisionConfig[decision];
    const Icon = config.icon;

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap",
          config.bg,
          config.text,
          config.border,
          size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
          className
        )}
        {...props}
      >
        {showIcon && Icon && (
          <Icon
            weight={decision === "strong_yes" ? "fill" : "bold"}
            className={cn(size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")}
          />
        )}
        {config.label}
      </span>
    );
  }
);
DecisionPill.displayName = "DecisionPill";

/**
 * DaysInStage - Shows how long a candidate has been in the current stage
 * Includes urgency coloring based on threshold
 */
interface DaysInStageProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Number of days in current stage */
  days: number;
  /** Warning threshold (days) - shows amber when exceeded */
  warningThreshold?: number;
  /** Critical threshold (days) - shows red when exceeded */
  criticalThreshold?: number;
  /** Show icon */
  showIcon?: boolean;
  /** Compact mode for tight spaces */
  compact?: boolean;
}

const DaysInStage = React.forwardRef<HTMLSpanElement, DaysInStageProps>(
  (
    {
      className,
      days,
      warningThreshold = 7,
      criticalThreshold = 14,
      showIcon = true,
      compact = false,
      ...props
    },
    ref
  ) => {
    const getStatus = () => {
      if (days >= criticalThreshold) return "critical";
      if (days >= warningThreshold) return "warning";
      return "normal";
    };

    const status = getStatus();

    const statusClasses = {
      normal: "text-foreground-muted",
      warning: "text-[var(--primitive-orange-600)]",
      critical: "text-[var(--primitive-red-600)]",
    };

    const Icon = status === "critical" ? Warning : Clock;

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 text-caption",
          statusClasses[status],
          className
        )}
        {...props}
      >
        {showIcon && (
          <Icon
            weight={status === "critical" ? "fill" : "regular"}
            className="w-3 h-3"
          />
        )}
        {compact ? `${days}d` : `${days} days in stage`}
      </span>
    );
  }
);
DaysInStage.displayName = "DaysInStage";

/**
 * CandidateActivity - Shows recent activity indicators
 * Comment time, scheduled interview, etc.
 */
interface CandidateActivityProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Last comment timestamp (relative string like "2h ago", "1 day ago") */
  lastComment?: string;
  /** Scheduled interview datetime */
  scheduledInterview?: string;
  /** Show "Not scheduled" if no interview scheduled */
  showNotScheduled?: boolean;
}

const CandidateActivity = React.forwardRef<HTMLDivElement, CandidateActivityProps>(
  ({ className, lastComment, scheduledInterview, showNotScheduled = false, ...props }, ref) => {
    const hasActivity = lastComment || scheduledInterview || showNotScheduled;

    if (!hasActivity) return null;

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-3 text-caption", className)}
        {...props}
      >
        {lastComment && (
          <span className="inline-flex items-center gap-1 text-foreground-muted">
            <ChatCircle weight="regular" className="w-3.5 h-3.5" />
            {lastComment}
          </span>
        )}
        {scheduledInterview && (
          <span className="inline-flex items-center gap-1 text-[var(--primitive-green-600)]">
            <Calendar weight="regular" className="w-3.5 h-3.5" />
            {scheduledInterview}
          </span>
        )}
        {!scheduledInterview && showNotScheduled && (
          <span className="inline-flex items-center gap-1 text-foreground-subtle">
            <Calendar weight="regular" className="w-3.5 h-3.5" />
            Not scheduled
          </span>
        )}
      </div>
    );
  }
);
CandidateActivity.displayName = "CandidateActivity";

/**
 * CandidateTags - Display semantic tags for candidates
 * Supports colored variants for different tag types
 */
type TagVariant = "default" | "green" | "blue" | "amber" | "purple" | "pink";

interface CandidateTag {
  label: string;
  variant?: TagVariant;
}

const tagVariantClasses: Record<TagVariant, string> = {
  default: "bg-[var(--primitive-neutral-200)] text-[var(--primitive-neutral-700)]",
  green: "bg-[var(--primitive-green-100)] text-[var(--primitive-green-700)]",
  blue: "bg-[var(--primitive-blue-100)] text-[var(--primitive-blue-700)]",
  amber: "bg-[var(--primitive-yellow-100)] text-[var(--primitive-yellow-700)]",
  purple: "bg-[var(--primitive-purple-100)] text-[var(--primitive-purple-700)]",
  pink: "bg-[var(--primitive-red-100)] text-[var(--primitive-red-600)]",
};

interface CandidateTagsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of tags with optional variants */
  tags: CandidateTag[] | string[];
  /** Maximum tags to show */
  maxVisible?: number;
}

const CandidateTags = React.forwardRef<HTMLDivElement, CandidateTagsProps>(
  ({ className, tags, maxVisible = 3, ...props }, ref) => {
    // Normalize tags to CandidateTag format
    const normalizedTags: CandidateTag[] = tags.map((tag) =>
      typeof tag === "string" ? { label: tag, variant: "default" } : tag
    );

    const visibleTags = normalizedTags.slice(0, maxVisible);
    const hiddenTags = normalizedTags.slice(maxVisible);
    const remainingCount = hiddenTags.length;

    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap gap-1", className)}
        {...props}
      >
        {visibleTags.map((tag, index) => (
          <span
            key={index}
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
              tagVariantClasses[tag.variant || "default"]
            )}
          >
            {tag.label}
          </span>
        ))}
        {remainingCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[var(--primitive-neutral-200)] text-[var(--primitive-neutral-600)] cursor-help">
                  +{remainingCount}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="font-medium mb-1">More tags</p>
                <p className="text-foreground-subtle">
                  {hiddenTags.map((t) => t.label).join(", ")}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }
);
CandidateTags.displayName = "CandidateTags";

interface CandidateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Whether the card is compact (for Kanban) or expanded (for list view) */
  variant?: "compact" | "expanded";
  /** Show loading skeleton */
  loading?: boolean;
}

const CandidateCard = React.forwardRef<HTMLDivElement, CandidateCardProps>(
  ({ className, children, variant = "compact", loading = false, ...props }, ref) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            "bg-surface rounded-lg border border-border animate-pulse",
            variant === "compact" && "p-3",
            variant === "expanded" && "p-4",
            className
          )}
          {...props}
        >
          <CandidateCardSkeleton variant={variant} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface rounded-lg border border-border transition-all cursor-pointer",
          "hover:border-border-emphasis hover:shadow-md",
          "focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2",
          variant === "compact" && "p-3 shadow-card",
          variant === "expanded" && "p-4 shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CandidateCard.displayName = "CandidateCard";

/**
 * Skeleton loading state for CandidateCard
 */
interface CandidateCardSkeletonProps {
  variant?: "compact" | "expanded";
}

const CandidateCardSkeleton = ({ variant = "compact" }: CandidateCardSkeletonProps) => (
  <div className="space-y-3">
    {/* Header skeleton */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-background-emphasized" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 bg-background-emphasized rounded" />
        <div className="h-3 w-24 bg-background-emphasized rounded" />
      </div>
    </div>
    {/* Skills skeleton */}
    <div className="flex gap-1">
      <div className="h-5 w-16 bg-background-emphasized rounded-full" />
      <div className="h-5 w-20 bg-background-emphasized rounded-full" />
      <div className="h-5 w-14 bg-background-emphasized rounded-full" />
    </div>
    {variant === "expanded" && (
      <>
        {/* Meta skeleton */}
        <div className="flex gap-4">
          <div className="h-3 w-20 bg-background-emphasized rounded" />
          <div className="h-3 w-24 bg-background-emphasized rounded" />
        </div>
        {/* Actions skeleton */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <div className="h-8 w-20 bg-background-emphasized rounded" />
          <div className="h-8 w-20 bg-background-emphasized rounded" />
        </div>
      </>
    )}
  </div>
);

interface CandidateHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  email?: string;
  avatarUrl?: string;
  avatarFallback?: string;
}

const CandidateHeader = React.forwardRef<HTMLDivElement, CandidateHeaderProps>(
  ({ className, name, email, avatarUrl, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-3", className)}
        {...props}
      >
        <Avatar
          size="default"
          src={avatarUrl}
          name={name}
          alt={name}
        />
        <div className="min-w-0 flex-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-body-sm font-medium text-foreground truncate">
                  {name}
                </p>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{name}</p>
                {email && <p className="text-foreground-subtle">{email}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {email && (
            <p className="text-caption text-foreground-subtle truncate">{email}</p>
          )}
        </div>
      </div>
    );
  }
);
CandidateHeader.displayName = "CandidateHeader";

interface CandidateMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CandidateMeta = React.forwardRef<HTMLDivElement, CandidateMetaProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-2 text-caption text-foreground-muted",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
CandidateMeta.displayName = "CandidateMeta";

interface CandidateMetaItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const CandidateMetaItem = React.forwardRef<
  HTMLSpanElement,
  CandidateMetaItemProps
>(({ className, icon, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("flex items-center gap-1", className)}
    {...props}
  >
    {icon && <span className="text-foreground-subtle">{icon}</span>}
    {children}
  </span>
));
CandidateMetaItem.displayName = "CandidateMetaItem";

interface CandidateSkillsProps extends React.HTMLAttributes<HTMLDivElement> {
  skills: string[];
  maxVisible?: number;
}

const CandidateSkills = React.forwardRef<HTMLDivElement, CandidateSkillsProps>(
  ({ className, skills, maxVisible = 3, ...props }, ref) => {
    const visibleSkills = skills.slice(0, maxVisible);
    const hiddenSkills = skills.slice(maxVisible);
    const remainingCount = hiddenSkills.length;

    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap gap-1", className)}
        {...props}
      >
        {visibleSkills.map((skill) => (
          <Badge key={skill} variant="secondary" size="sm">
            {skill}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Badge variant="outline" size="sm" className="cursor-help">
                    +{remainingCount}
                  </Badge>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="font-medium mb-1">Additional Skills</p>
                <p className="text-foreground-subtle">
                  {hiddenSkills.join(", ")}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }
);
CandidateSkills.displayName = "CandidateSkills";

interface CandidateScoreProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  label?: string;
  /** Color variant based on score thresholds */
  variant?: "auto" | ScoreLevel;
  /** Show progress bar */
  showProgress?: boolean;
}

const CandidateScore = React.forwardRef<HTMLDivElement, CandidateScoreProps>(
  ({ className, score, label = "Match", variant = "auto", showProgress = false, ...props }, ref) => {
    const getScoreLevel = (): ScoreLevel => {
      if (variant !== "auto") return variant;
      if (score >= 85) return "excellent";
      if (score >= 70) return "good";
      if (score >= 50) return "average";
      return "poor";
    };

    const level = getScoreLevel();
    const config = scoreConfig[level];

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        <div
          className={cn(
            "px-2 py-1 rounded-md text-caption font-medium",
            config.bg,
            config.text
          )}
        >
          {score}%
        </div>
        {showProgress && (
          <div className="flex-1 h-1.5 bg-background-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", config.fill)}
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
            />
          </div>
        )}
        <span className="text-caption text-foreground-subtle">{label}</span>
      </div>
    );
  }
);
CandidateScore.displayName = "CandidateScore";

interface CandidateActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CandidateActions = React.forwardRef<HTMLDivElement, CandidateActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 pt-2 mt-2 border-t border-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
CandidateActions.displayName = "CandidateActions";

/**
 * Stage indicator showing current pipeline stage
 */
interface CandidateStageProps extends React.HTMLAttributes<HTMLDivElement> {
  stage: string;
  color?: string;
}

const CandidateStage = React.forwardRef<HTMLDivElement, CandidateStageProps>(
  ({ className, stage, color, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-1.5", className)}
      {...props}
    >
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color || "#94a3b8" }}
      />
      <span className="text-caption text-foreground-muted">{stage}</span>
    </div>
  )
);
CandidateStage.displayName = "CandidateStage";

/**
 * Application date/time indicator
 */
interface CandidateDateProps extends React.HTMLAttributes<HTMLSpanElement> {
  date: Date | string;
  prefix?: string;
  /** Show relative time (e.g., "2 days ago") instead of absolute date */
  relative?: boolean;
}

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const CandidateDate = React.forwardRef<HTMLSpanElement, CandidateDateProps>(
  ({ className, date, prefix = "Applied", relative = false, ...props }, ref) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const formatted = relative
      ? getRelativeTime(dateObj)
      : dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              ref={ref}
              className={cn("text-caption text-foreground-subtle cursor-help", className)}
              {...props}
            >
              {prefix} {formatted}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            {dateObj.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);
CandidateDate.displayName = "CandidateDate";

/**
 * Star Rating display component
 * Shows filled/empty stars based on rating
 */
interface StarRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rating value (0-5) */
  rating: number;
  /** Maximum stars to show */
  maxStars?: number;
  /** Size of the stars */
  size?: "sm" | "md" | "lg";
  /** Show numeric value alongside stars */
  showValue?: boolean;
}

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  ({ className, rating, maxStars = 5, size = "sm", showValue = false, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-3.5 h-3.5",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-0.5", className)}
        {...props}
      >
        {showValue && (
          <span className="text-caption font-medium text-foreground-muted mr-1">
            {rating.toFixed(1)}
          </span>
        )}
        {Array.from({ length: maxStars }).map((_, index) => {
          const filled = index < Math.floor(roundedRating);
          const halfFilled = !filled && index < roundedRating;

          return (
            <svg
              key={index}
              className={cn(
                sizeClasses[size],
                filled || halfFilled ? "text-rating-filled" : "text-rating-empty"
              )}
              viewBox="0 0 20 20"
              fill={filled || halfFilled ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={filled || halfFilled ? 0 : 1.5}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
    );
  }
);
StarRating.displayName = "StarRating";

/**
 * Reviewer data type for CandidateReviewers
 */
interface ReviewerData {
  name: string;
  avatarUrl?: string;
  /** Review status - rating (0-5), decision, or "in_review" */
  status: "in_review" | number | DecisionType;
  /** Optional rating (if using decision for status) */
  rating?: number;
  /** Avatar color for fallback */
  color?: "green" | "blue" | "purple" | "red" | "orange" | "yellow";
}

/**
 * Reviewer row component - shows reviewer avatar, name, and status/rating/decision
 * Enhanced to support DecisionPill display
 */
interface ReviewerRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Reviewer name */
  name: string;
  /** Reviewer avatar URL */
  avatarUrl?: string;
  /** Review status - "in_review", numeric rating, or decision type */
  status: "in_review" | number | DecisionType;
  /** Optional separate rating (shown alongside decision) */
  rating?: number;
  /** Avatar color */
  color?: "green" | "blue" | "purple" | "red" | "orange" | "yellow";
}

const ReviewerRow = React.forwardRef<HTMLDivElement, ReviewerRowProps>(
  ({ className, name, avatarUrl, status, rating, color, ...props }, ref) => {
    const isDecision = typeof status === "string" && status !== "in_review";
    const isRating = typeof status === "number";

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between py-1.5", className)}
        {...props}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Avatar size="xs" src={avatarUrl} name={name} alt={name} color={color} />
          <span className="text-caption text-foreground-muted truncate">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Show rating stars if provided alongside decision */}
          {rating !== undefined && (
            <StarRating rating={rating} maxStars={5} size="sm" />
          )}
          {/* Show decision pill, rating stars, or in-review badge */}
          {status === "in_review" ? (
            <Badge variant="feature" size="sm">
              In Review
            </Badge>
          ) : isDecision ? (
            <DecisionPill decision={status as DecisionType} size="sm" />
          ) : isRating && rating === undefined ? (
            <StarRating rating={status} maxStars={5} size="sm" />
          ) : null}
        </div>
      </div>
    );
  }
);
ReviewerRow.displayName = "ReviewerRow";

/**
 * Candidate card header for Kanban - matches Figma design
 * Shows avatar, name, star rating (avg reviewer score), match score (AI), and applied date
 */
interface CandidateKanbanHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  avatarUrl?: string;
  /** Average reviewer rating (0-5 stars) */
  rating?: number;
  /** AI-generated match score (0-100%) */
  matchScore?: number;
  appliedDate?: Date | string;
}

const CandidateKanbanHeader = React.forwardRef<HTMLDivElement, CandidateKanbanHeaderProps>(
  ({ className, name, avatarUrl, rating, matchScore, appliedDate, ...props }, ref) => {
    const formatAppliedDate = (date: Date | string) => {
      const d = typeof date === "string" ? new Date(date) : date;
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);

      if (diffDays === 0) return "Applied Today";
      if (diffDays === 1) return "Applied Yesterday";
      if (diffDays < 7) return `Applied ${diffDays}d ago`;
      return `Applied ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    };

    // Determine match score color based on value using semantic tokens
    const getMatchScoreColor = (score: number) => {
      if (score >= 85) return "text-match-high-fg";
      if (score >= 70) return "text-match-medium-fg";
      if (score >= 50) return "text-foreground-warning";
      return "text-match-low-fg";
    };

    const hasMetaInfo = rating !== undefined || matchScore !== undefined || appliedDate;

    return (
      <div ref={ref} className={cn("flex items-center gap-3", className)} {...props}>
        <Avatar size="default" src={avatarUrl} name={name} alt={name} />
        <div className="min-w-0 flex-1">
          <p className="text-body-sm font-semibold text-foreground truncate">{name}</p>
          {hasMetaInfo && (
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {rating !== undefined && (
                <div className="flex items-center gap-0.5">
                  <svg className="w-3.5 h-3.5 text-rating-filled" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-caption text-foreground-muted">{rating.toFixed(1)}</span>
                </div>
              )}
              {matchScore !== undefined && (
                <>
                  {rating !== undefined && <span className="text-foreground-subtle">•</span>}
                  <span className={cn("text-caption font-medium", getMatchScoreColor(matchScore))}>
                    {matchScore}% match
                  </span>
                </>
              )}
              {appliedDate && (
                <>
                  {(rating !== undefined || matchScore !== undefined) && (
                    <span className="text-foreground-subtle">•</span>
                  )}
                  <div className="flex items-center gap-1 text-caption text-foreground-muted">
                    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="8" cy="8" r="6" />
                    </svg>
                    <span>{formatAppliedDate(appliedDate)}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
CandidateKanbanHeader.displayName = "CandidateKanbanHeader";

/**
 * Reviewers section for candidate card - collapsible list of reviewers
 * Enhanced with collapsed summary showing avatar stack and decision counts
 */
interface CandidateReviewersProps extends React.HTMLAttributes<HTMLDivElement> {
  reviewers: ReviewerData[];
  /** Max reviewers to show before collapsing */
  maxVisible?: number;
  /** Always expanded */
  expanded?: boolean;
  /** Show collapsed summary with avatar stack (default: true when >1 reviewer) */
  showSummary?: boolean;
}

const CandidateReviewers = React.forwardRef<HTMLDivElement, CandidateReviewersProps>(
  ({ className, reviewers, maxVisible = 3, expanded = false, showSummary, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(expanded);

    // Calculate summary metrics
    const reviewedCount = reviewers.filter(
      (r) => r.status !== "in_review" && r.status !== "pending"
    ).length;
    const totalCount = reviewers.length;

    // Count decisions for summary
    const decisionCounts = reviewers.reduce(
      (acc, r) => {
        if (r.status === "strong_yes" || r.status === "yes") acc.yes++;
        else if (r.status === "no") acc.no++;
        else if (r.status === "maybe") acc.maybe++;
        return acc;
      },
      { yes: 0, no: 0, maybe: 0 }
    );

    // Determine if we should show collapsed summary
    const shouldShowSummary = showSummary ?? (totalCount > 1 && !isExpanded);

    // Convert reviewers to AvatarData for AvatarGroup
    const avatarData: AvatarData[] = reviewers.map((r) => ({
      name: r.name,
      src: r.avatarUrl,
      color: r.color,
    }));

    const visibleReviewers = isExpanded ? reviewers : reviewers.slice(0, maxVisible);
    const hiddenCount = reviewers.length - maxVisible;

    return (
      <div ref={ref} className={cn("mt-3 pt-3 border-t border-border-muted", className)} {...props}>
        {/* Collapsed summary view */}
        {shouldShowSummary && !isExpanded ? (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-between py-1 px-1 -mx-1 rounded-md hover:bg-background-subtle transition-colors"
          >
            <div className="flex items-center gap-2">
              {/* Stacked avatars */}
              <AvatarGroup
                avatars={avatarData}
                size="xs"
                max={4}
                variant="ring"
              />
              <span className="text-caption text-foreground-muted">
                {reviewedCount}/{totalCount} reviewed
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Decision counts */}
              {decisionCounts.yes > 0 && (
                <span className="text-caption text-[var(--primitive-green-600)] font-medium">
                  {decisionCounts.yes} yes
                </span>
              )}
              {decisionCounts.maybe > 0 && (
                <span className="text-caption text-[var(--primitive-yellow-600)] font-medium">
                  {decisionCounts.maybe} maybe
                </span>
              )}
              {decisionCounts.no > 0 && (
                <span className="text-caption text-[var(--primitive-red-600)] font-medium">
                  {decisionCounts.no} no
                </span>
              )}
              {/* Expand chevron */}
              <svg
                className="w-4 h-4 text-foreground-muted"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        ) : (
          <>
            {/* Expanded header with collapse button */}
            {totalCount > 1 && isExpanded && (
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="w-full flex items-center justify-between mb-2 text-caption text-foreground-muted hover:text-foreground transition-colors"
              >
                <span>{totalCount} reviewers</span>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 10l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            {/* Reviewer rows */}
            <div className="space-y-1">
              {visibleReviewers.map((reviewer, index) => (
                <ReviewerRow
                  key={index}
                  name={reviewer.name}
                  avatarUrl={reviewer.avatarUrl}
                  status={reviewer.status}
                  rating={reviewer.rating}
                  color={reviewer.color}
                />
              ))}
            </div>
            {hiddenCount > 0 && !isExpanded && (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="mt-1 text-caption text-foreground-link hover:text-foreground-link-hover"
              >
                +{hiddenCount} more reviewer{hiddenCount > 1 ? "s" : ""}
              </button>
            )}
          </>
        )}
      </div>
    );
  }
);
CandidateReviewers.displayName = "CandidateReviewers";

export {
  CandidateCard,
  CandidateCardSkeleton,
  CandidateHeader,
  CandidateMeta,
  CandidateMetaItem,
  CandidateSkills,
  CandidateScore,
  CandidateActions,
  CandidateStage,
  CandidateDate,
  CandidateKanbanHeader,
  CandidateReviewers,
  ReviewerRow,
  StarRating,
  scoreConfig,
  // New components
  DecisionPill,
  decisionConfig,
  DaysInStage,
  CandidateActivity,
  CandidateTags,
  tagVariantClasses,
};

export type {
  ScoreLevel,
  DecisionType,
  ReviewerData,
  CandidateTag,
  TagVariant,
};

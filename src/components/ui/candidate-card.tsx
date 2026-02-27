"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarGroup, type AvatarData } from "./avatar";
import { Badge } from "./badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import {
  ChatCircle,
  Calendar,
  Clock,
  Warning,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Star,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";

/**
 * Candidate Card Components for ATS
 *
 * Clean, minimal cards inspired by modern ATS design.
 * Prioritizes scannability with clear visual hierarchy:
 * - Name + avatar as primary anchor
 * - Rating + meta as compact secondary info
 * - Tags as lightweight colored pills
 * - Reviewer section with collapsed summary / expanded detail
 */

// ============================================
// SCORE CONFIGURATION
// Uses design system --match-* tokens
// ============================================

const scoreConfig = {
  excellent: {
    bg: "bg-[var(--match-high-background)]",
    text: "text-[var(--match-high-foreground)]",
    fill: "bg-[var(--match-high-accent)]",
  },
  good: {
    bg: "bg-[var(--match-high-background)]",
    text: "text-[var(--match-high-foreground)]",
    fill: "bg-[var(--match-high-accent)]",
  },
  average: {
    bg: "bg-[var(--match-medium-background)]",
    text: "text-[var(--match-medium-foreground)]",
    fill: "bg-[var(--match-medium-accent)]",
  },
  poor: {
    bg: "bg-[var(--match-low-background)]",
    text: "text-[var(--match-low-foreground)]",
    fill: "bg-[var(--match-low-accent)]",
  },
} as const;

type ScoreLevel = keyof typeof scoreConfig;

// ============================================
// DECISION PILL
// ============================================

type DecisionType = "strong_yes" | "yes" | "maybe" | "no" | "pending";

const decisionConfig: Record<
  DecisionType,
  {
    bg: string;
    text: string;
    border?: string;
    icon?: React.ElementType;
    label: string;
  }
> = {
  strong_yes: {
    bg: "bg-[var(--primitive-green-500)]",
    text: "text-[var(--foreground-on-emphasis)]",
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

interface DecisionPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  decision: DecisionType;
  showIcon?: boolean;
  size?: "sm" | "default";
}

const DecisionPill = React.forwardRef<HTMLSpanElement, DecisionPillProps>(
  ({ className, decision, showIcon = true, size = "default", ...props }, ref) => {
    const config = decisionConfig[decision];
    const Icon = config.icon;

    return (
      <span
        ref={ref}
        role="status"
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap rounded-full font-medium",
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
            className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")}
          />
        )}
        {config.label}
      </span>
    );
  }
);
DecisionPill.displayName = "DecisionPill";

// ============================================
// DAYS IN STAGE
// ============================================

interface DaysInStageProps extends React.HTMLAttributes<HTMLSpanElement> {
  days: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  showIcon?: boolean;
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
    const status =
      days >= criticalThreshold ? "critical" : days >= warningThreshold ? "warning" : "normal";

    const statusClasses = {
      normal: "text-foreground-muted",
      warning: "text-[var(--primitive-orange-600)]",
      critical: "text-[var(--primitive-red-600)]",
    };

    const Icon = status === "critical" ? Warning : Clock;

    return (
      <span
        ref={ref}
        aria-label={`${days} days in current stage${status === "critical" ? ", needs attention" : ""}`}
        className={cn(
          "inline-flex items-center gap-1 text-caption",
          statusClasses[status],
          className
        )}
        {...props}
      >
        {showIcon && (
          <Icon weight={status === "critical" ? "fill" : "regular"} className="h-3.5 w-3.5" />
        )}
        {compact ? `${days} days in stage` : `${days} days in stage`}
      </span>
    );
  }
);
DaysInStage.displayName = "DaysInStage";

// ============================================
// CANDIDATE ACTIVITY
// ============================================

interface CandidateActivityProps extends React.HTMLAttributes<HTMLDivElement> {
  lastComment?: string;
  scheduledInterview?: string;
  showNotScheduled?: boolean;
}

const CandidateActivity = React.forwardRef<HTMLDivElement, CandidateActivityProps>(
  ({ className, lastComment, scheduledInterview, showNotScheduled = false, ...props }, ref) => {
    const hasActivity = lastComment || scheduledInterview || showNotScheduled;
    if (!hasActivity) return null;

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-3 text-caption text-foreground-muted", className)}
        {...props}
      >
        {lastComment && (
          <span className="inline-flex items-center gap-1">
            <ChatCircle weight="regular" className="h-3.5 w-3.5" />
            {lastComment}
          </span>
        )}
        {scheduledInterview && (
          <span className="inline-flex items-center gap-1 text-[var(--foreground-success)]">
            <Calendar weight="regular" className="h-3.5 w-3.5" />
            {scheduledInterview}
          </span>
        )}
        {!scheduledInterview && showNotScheduled && (
          <span className="inline-flex items-center gap-1 text-foreground-subtle">
            <Calendar weight="regular" className="h-3.5 w-3.5" />
            Not scheduled
          </span>
        )}
      </div>
    );
  }
);
CandidateActivity.displayName = "CandidateActivity";

// ============================================
// CANDIDATE TAGS
// ============================================

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
  tags: CandidateTag[] | string[];
  maxVisible?: number;
}

const CandidateTags = React.forwardRef<HTMLDivElement, CandidateTagsProps>(
  ({ className, tags, maxVisible = 3, ...props }, ref) => {
    const normalizedTags: CandidateTag[] = tags.map((tag) =>
      typeof tag === "string" ? { label: tag, variant: "default" } : tag
    );

    const visibleTags = normalizedTags.slice(0, maxVisible);
    const hiddenTags = normalizedTags.slice(maxVisible);
    const remainingCount = hiddenTags.length;

    return (
      <div ref={ref} className={cn("flex flex-wrap items-center gap-1.5", className)} {...props}>
        {visibleTags.map((tag, index) => (
          <span
            key={index}
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
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
                <span className="inline-flex cursor-help items-center rounded-md bg-[var(--primitive-neutral-200)] px-2 py-0.5 text-xs font-medium text-[var(--primitive-neutral-600)]">
                  +{remainingCount}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="mb-1 font-medium">More tags</p>
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

// ============================================
// CANDIDATE CARD — Main Container
// Clean, minimal card with generous whitespace
// ============================================

interface CandidateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "compact" | "expanded";
  loading?: boolean;
  /** Visual selected state (ring indicator via ⌘-click) */
  selected?: boolean;
  /** Slot for a contextual ••• menu — the only hover-revealed element */
  actions?: React.ReactNode;
}

const CandidateCard = React.forwardRef<HTMLDivElement, CandidateCardProps>(
  (
    {
      className,
      children,
      variant = "compact",
      loading = false,
      selected = false,
      actions,
      ...props
    },
    ref
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            "animate-pulse rounded-xl bg-[var(--card-background)] shadow-card",
            variant === "compact" ? "p-4" : "p-5",
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
        role="article"
        tabIndex={0}
        className={cn(
          // Base
          "group relative rounded-xl bg-[var(--card-background)] text-[var(--card-foreground)]",
          // Shadow only — no border
          "shadow-card",
          // Hover — shadow-only elevation (single property, tactical feel)
          "hover:shadow-card-hover",
          // Transition — single property for responsive, intentional feedback
          "ease-default transition-[shadow,transform] duration-normal",
          // Focus
          "focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none",
          // Active — press feedback
          "active:scale-[0.995] active:shadow-card",
          // Cursor
          "cursor-pointer",
          // Variant sizing
          variant === "compact" ? "px-4 py-3.5" : "p-5",
          // Selected state — ring indicator (⌘-click)
          selected && "bg-[var(--card-background-selected)] ring-2 ring-[var(--border-brand)]",
          className
        )}
        {...props}
      >
        {/* Context menu (•••) — the ONLY hover-revealed element (Asana pattern) */}
        {actions && (
          <div
            className="absolute right-2 top-2 z-10 opacity-0 transition-opacity duration-fast group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {actions}
          </div>
        )}
        {children}
      </div>
    );
  }
);
CandidateCard.displayName = "CandidateCard";

// ============================================
// SKELETON
// ============================================

interface CandidateCardSkeletonProps {
  variant?: "compact" | "expanded";
}

const CandidateCardSkeleton = ({ variant = "compact" }: CandidateCardSkeletonProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-[var(--background-emphasized)]" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 rounded bg-[var(--background-emphasized)]" />
        <div className="h-3 w-24 rounded bg-[var(--background-emphasized)]" />
      </div>
    </div>
    <div className="flex gap-1.5">
      <div className="h-5 w-16 rounded-md bg-[var(--background-emphasized)]" />
      <div className="h-5 w-20 rounded-md bg-[var(--background-emphasized)]" />
    </div>
    {variant === "expanded" && (
      <>
        <div className="flex gap-4">
          <div className="h-3 w-20 rounded bg-[var(--background-emphasized)]" />
          <div className="h-3 w-24 rounded bg-[var(--background-emphasized)]" />
        </div>
        <div className="flex gap-2 border-t border-[var(--border-muted)] pt-3">
          <div className="h-8 w-20 rounded bg-[var(--background-emphasized)]" />
          <div className="h-8 w-20 rounded bg-[var(--background-emphasized)]" />
        </div>
      </>
    )}
  </div>
);

// ============================================
// CANDIDATE HEADER
// ============================================

interface CandidateHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  email?: string;
  avatarUrl?: string;
  avatarFallback?: string;
}

const CandidateHeader = React.forwardRef<HTMLDivElement, CandidateHeaderProps>(
  ({ className, name, email, avatarUrl, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-3", className)} {...props}>
        <Avatar size="default" src={avatarUrl} name={name} alt={name} />
        <div className="min-w-0 flex-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="truncate text-body-sm font-semibold text-foreground">{name}</p>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{name}</p>
                {email && <p className="text-foreground-subtle">{email}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {email && <p className="truncate text-caption text-foreground-subtle">{email}</p>}
        </div>
      </div>
    );
  }
);
CandidateHeader.displayName = "CandidateHeader";

// ============================================
// CANDIDATE META
// ============================================

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

const CandidateMetaItem = React.forwardRef<HTMLSpanElement, CandidateMetaItemProps>(
  ({ className, icon, children, ...props }, ref) => (
    <span ref={ref} className={cn("flex items-center gap-1", className)} {...props}>
      {icon && <span className="text-foreground-subtle">{icon}</span>}
      {children}
    </span>
  )
);
CandidateMetaItem.displayName = "CandidateMetaItem";

// ============================================
// CANDIDATE SKILLS
// ============================================

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
      <div ref={ref} className={cn("flex flex-wrap gap-1.5", className)} {...props}>
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
                <p className="mb-1 font-medium">Additional Skills</p>
                <p className="text-foreground-subtle">{hiddenSkills.join(", ")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }
);
CandidateSkills.displayName = "CandidateSkills";

// ============================================
// CANDIDATE SCORE
// @deprecated Use MatchScoreBadge from match-score.tsx instead
// ============================================

interface CandidateScoreProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  label?: string;
  /** @deprecated Use MatchScoreBadge for proper token support */
  variant?: "auto" | ScoreLevel;
  showProgress?: boolean;
}

/** @deprecated Use MatchScoreBadge from @/components/ui/match-score instead */
const CandidateScore = React.forwardRef<HTMLDivElement, CandidateScoreProps>(
  (
    { className, score, label = "Match", variant = "auto", showProgress = false, ...props },
    ref
  ) => {
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
      <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
        <div
          className={cn("rounded-md px-2 py-1 text-caption font-medium", config.bg, config.text)}
        >
          {score}%
        </div>
        {showProgress && (
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--background-muted)]">
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

// ============================================
// CANDIDATE ACTIONS
// ============================================

interface CandidateActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CandidateActions = React.forwardRef<HTMLDivElement, CandidateActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mt-3 flex items-center gap-2 border-t border-[var(--border-muted)] pt-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
CandidateActions.displayName = "CandidateActions";

// ============================================
// CANDIDATE STAGE
// ============================================

interface CandidateStageProps extends React.HTMLAttributes<HTMLDivElement> {
  stage: string;
  color?: string;
}

const CandidateStage = React.forwardRef<HTMLDivElement, CandidateStageProps>(
  ({ className, stage, color, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-1.5", className)} {...props}>
      <div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color || `var(--border-emphasis)` }}
      />
      <span className="text-caption text-foreground-muted">{stage}</span>
    </div>
  )
);
CandidateStage.displayName = "CandidateStage";

// ============================================
// CANDIDATE DATE
// ============================================

interface CandidateDateProps extends React.HTMLAttributes<HTMLSpanElement> {
  date: Date | string;
  prefix?: string;
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
      : dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              ref={ref}
              className={cn("cursor-help text-caption text-foreground-subtle", className)}
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

// ============================================
// STAR RATING — Uses Phosphor Star icon
// ============================================

interface StarRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const starSizes = {
  sm: 14,
  md: 16,
  lg: 20,
} as const;

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  ({ className, rating, maxStars = 5, size = "sm", showValue = false, ...props }, ref) => {
    const roundedRating = Math.round(rating * 2) / 2;
    const iconSize = starSizes[size];

    return (
      <div
        ref={ref}
        role="img"
        aria-label={`Rating: ${rating.toFixed(1)} out of ${maxStars} stars`}
        className={cn("flex items-center gap-0.5", className)}
        {...props}
      >
        {showValue && (
          <span className="mr-1 text-caption font-medium text-foreground-muted">
            {rating.toFixed(1)}
          </span>
        )}
        {Array.from({ length: maxStars }).map((_, index) => {
          const filled = index < Math.floor(roundedRating);
          const halfFilled = !filled && index < roundedRating;

          return (
            <Star
              key={index}
              size={iconSize}
              weight={filled || halfFilled ? "fill" : "regular"}
              className={cn(filled || halfFilled ? "text-rating-filled" : "text-rating-empty")}
            />
          );
        })}
      </div>
    );
  }
);
StarRating.displayName = "StarRating";

// ============================================
// REVIEWER ROW
// ============================================

interface ReviewerData {
  name: string;
  avatarUrl?: string;
  status: "in_review" | number | DecisionType;
  rating?: number;
  color?: "green" | "blue" | "purple" | "red" | "orange" | "yellow";
}

interface ReviewerRowProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  avatarUrl?: string;
  status: "in_review" | number | DecisionType;
  rating?: number;
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
        <div className="flex min-w-0 items-center gap-2">
          <Avatar size="xs" src={avatarUrl} name={name} alt={name} color={color} />
          <span className="truncate text-caption text-foreground-muted">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          {rating !== undefined && <StarRating rating={rating} maxStars={5} size="sm" />}
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

// ============================================
// KANBAN HEADER
// Clean layout: avatar + name on left, meta below name
// ============================================

interface CandidateKanbanHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  avatarUrl?: string;
  rating?: number;
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

    const hasMetaInfo = rating !== undefined || matchScore !== undefined || appliedDate;

    return (
      <div ref={ref} className={cn("flex items-start gap-3", className)} {...props}>
        <Avatar size="default" src={avatarUrl} name={name} alt={name} />
        <div className="min-w-0 flex-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="truncate text-body-sm font-semibold text-foreground">{name}</p>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {hasMetaInfo && (
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {matchScore !== undefined && (
                <span
                  className={cn(
                    "text-caption font-medium",
                    matchScore >= 75
                      ? "text-[var(--match-high-foreground)]"
                      : matchScore >= 50
                        ? "text-[var(--match-medium-foreground)]"
                        : "text-[var(--match-low-foreground)]"
                  )}
                >
                  {matchScore}% match
                </span>
              )}
              {rating !== undefined && (
                <>
                  {matchScore !== undefined && (
                    <span className="text-xs text-foreground-subtle">·</span>
                  )}
                  <div className="flex items-center gap-1">
                    <Star size={13} weight="fill" className="text-rating-filled" />
                    <span className="text-caption text-foreground-muted">{rating.toFixed(1)}</span>
                  </div>
                </>
              )}
              {appliedDate && (
                <>
                  {(rating !== undefined || matchScore !== undefined) && (
                    <span className="text-xs text-foreground-subtle">·</span>
                  )}
                  <span className="flex items-center gap-1 text-caption text-foreground-muted">
                    <Clock size={12} weight="regular" />
                    {formatAppliedDate(appliedDate)}
                  </span>
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

// ============================================
// CANDIDATE REVIEWERS — Collapsible section
// Collapsed: avatar stack + "X/Y reviewed" + decision summary
// Expanded: individual reviewer rows with stars/decisions
// ============================================

interface CandidateReviewersProps extends React.HTMLAttributes<HTMLDivElement> {
  reviewers: ReviewerData[];
  maxVisible?: number;
  expanded?: boolean;
  showSummary?: boolean;
}

const CandidateReviewers = React.forwardRef<HTMLDivElement, CandidateReviewersProps>(
  ({ className, reviewers, maxVisible = 3, expanded = false, showSummary, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(expanded);

    const reviewedCount = reviewers.filter(
      (r) => r.status !== "in_review" && r.status !== "pending"
    ).length;
    const totalCount = reviewers.length;

    const decisionCounts = reviewers.reduce(
      (acc, r) => {
        if (r.status === "strong_yes" || r.status === "yes") acc.yes++;
        else if (r.status === "no") acc.no++;
        else if (r.status === "maybe") acc.maybe++;
        return acc;
      },
      { yes: 0, no: 0, maybe: 0 }
    );

    const shouldShowSummary = showSummary ?? (totalCount > 1 && !isExpanded);

    const avatarData: AvatarData[] = reviewers.map((r) => ({
      name: r.name,
      src: r.avatarUrl,
      color: r.color,
    }));

    const visibleReviewers = isExpanded ? reviewers : reviewers.slice(0, maxVisible);
    const hiddenCount = reviewers.length - maxVisible;

    return (
      <div
        ref={ref}
        className={cn("mt-3 border-t border-[var(--border-default)] pt-2.5", className)}
        {...props}
      >
        {/* Collapsed summary */}
        {shouldShowSummary && !isExpanded ? (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="-mx-1 flex w-full items-center justify-between rounded-md px-1 py-1.5 transition-colors hover:bg-[var(--background-interactive-hover)]"
          >
            <div className="flex items-center gap-2">
              <AvatarGroup avatars={avatarData} size="xs" max={4} variant="ring" />
              <span className="text-caption text-foreground-muted">
                {reviewedCount}/{totalCount} reviewed
              </span>
            </div>
            <div className="flex items-center gap-2">
              {decisionCounts.yes > 0 && (
                <span className="text-caption font-medium text-[var(--foreground-success)]">
                  {decisionCounts.yes} yes
                </span>
              )}
              {decisionCounts.maybe > 0 && (
                <span className="text-caption font-medium text-[var(--foreground-warning)]">
                  {decisionCounts.maybe} maybe
                </span>
              )}
              {decisionCounts.no > 0 && (
                <span className="text-caption font-medium text-[var(--foreground-error)]">
                  {decisionCounts.no} no
                </span>
              )}
              <CaretDown size={14} weight="bold" className="text-foreground-muted" />
            </div>
          </button>
        ) : (
          <>
            {/* Expanded header */}
            {totalCount > 1 && isExpanded && (
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="mb-2 flex w-full items-center justify-between text-caption text-foreground-muted transition-colors hover:text-foreground"
              >
                <span>{totalCount} reviewers</span>
                <CaretUp size={14} weight="bold" />
              </button>
            )}
            {/* Reviewer rows */}
            <div className="space-y-0.5">
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

// ============================================
// EXPORTS
// ============================================

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
  DecisionPill,
  decisionConfig,
  DaysInStage,
  CandidateActivity,
  CandidateTags,
  tagVariantClasses,
};

export type { ScoreLevel, DecisionType, ReviewerData, CandidateTag, TagVariant };

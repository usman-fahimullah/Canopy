"use client";

/**
 * ATS Helper Components
 *
 * Shared helper components for ATS-specific data display.
 * Used by DataTable, EnhancedDataTable, and CandidateTable.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../../badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../tooltip";
import {
  Lightning,
  Hourglass,
  Eye,
  ChatCircle,
  GraduationCap,
  Briefcase,
  CheckCircle,
  XCircle,
  UserMinus,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from "@phosphor-icons/react";
import type {
  CandidateStage,
  CandidateSource,
  DecisionType,
  StageConfig,
  SourceConfig,
  DecisionConfig,
  CandidateReviewer,
} from "../types";

// ============================================
// Stage Configuration
// ============================================

export const stageConfig: Record<CandidateStage, StageConfig> = {
  new: {
    label: "New",
    variant: "secondary",
    icon: <Lightning className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-muted)",
  },
  applied: {
    label: "Applied",
    variant: "info",
    icon: <Hourglass className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-info)",
  },
  screening: {
    label: "Screening",
    variant: "info",
    icon: <Eye className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-info)",
  },
  interview: {
    label: "Interview",
    variant: "default",
    icon: <ChatCircle className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-brand)",
  },
  assessment: {
    label: "Assessment",
    variant: "default",
    icon: <GraduationCap className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-brand)",
  },
  offer: {
    label: "Offer",
    variant: "warning",
    icon: <Briefcase className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-warning)",
  },
  hired: {
    label: "Hired",
    variant: "success",
    icon: <CheckCircle className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-success)",
  },
  rejected: {
    label: "Rejected",
    variant: "error",
    icon: <XCircle className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-error)",
  },
  withdrawn: {
    label: "Withdrawn",
    variant: "secondary",
    icon: <UserMinus className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-muted)",
  },
};

// Simple stage variant map for basic usage
export const stageVariantMap: Record<string, "secondary" | "info" | "default" | "warning" | "success" | "error"> = {
  applied: "secondary",
  new: "secondary",
  screening: "info",
  interview: "default",
  assessment: "default",
  offer: "warning",
  hired: "success",
  rejected: "error",
  withdrawn: "secondary",
};

// ============================================
// Source Configuration
// ============================================

export const sourceConfig: Record<CandidateSource, SourceConfig> = {
  green_jobs_board: { label: "Green Jobs Board", color: "var(--foreground-brand)" },
  linkedin: { label: "LinkedIn", color: "var(--foreground-info)" },
  indeed: { label: "Indeed", color: "var(--foreground-info)" },
  referral: { label: "Referral", color: "var(--foreground-success)" },
  website: { label: "Website", color: "var(--foreground-info)" },
  other: { label: "Other", color: "var(--foreground-muted)" },
};

// ============================================
// Decision Configuration
// ============================================

export const decisionConfig: Record<DecisionType, DecisionConfig> = {
  strong_yes: {
    label: "Strong Yes",
    icon: <Heart className="h-3.5 w-3.5" weight="fill" />,
    color: "var(--foreground-success)",
    bgColor: "var(--background-success)",
  },
  yes: {
    label: "Yes",
    icon: <ThumbsUp className="h-3.5 w-3.5" weight="fill" />,
    color: "var(--foreground-success)",
    bgColor: "var(--background-success)",
  },
  maybe: {
    label: "Maybe",
    icon: <Minus className="h-3.5 w-3.5" weight="bold" />,
    color: "var(--foreground-warning)",
    bgColor: "var(--background-warning)",
  },
  no: {
    label: "No",
    icon: <ThumbsDown className="h-3.5 w-3.5" weight="fill" />,
    color: "var(--foreground-error)",
    bgColor: "var(--background-error)",
  },
  pending: {
    label: "Pending",
    icon: <Hourglass className="h-3.5 w-3.5" weight="fill" />,
    color: "var(--foreground-muted)",
    bgColor: "var(--background-muted)",
  },
};

// ============================================
// StageBadge Component
// ============================================

export interface StageBadgeProps {
  /** The stage to display */
  stage: CandidateStage | string;
  /** Show icon alongside label */
  showIcon?: boolean;
  /** Additional className */
  className?: string;
}

export function StageBadge({ stage, showIcon = true, className }: StageBadgeProps) {
  const normalizedStage = stage.toLowerCase() as CandidateStage;
  const config = stageConfig[normalizedStage];

  if (!config) {
    // Fallback for unknown stages
    const variant = stageVariantMap[normalizedStage] || "secondary";
    return (
      <Badge variant={variant} className={className}>
        {stage}
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} className={cn("gap-1", className)}>
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
}

// ============================================
// SourceBadge Component
// ============================================

export interface SourceBadgeProps {
  /** The source to display */
  source: CandidateSource | string;
  /** Additional className */
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  const normalizedSource = source.toLowerCase() as CandidateSource;
  const config = sourceConfig[normalizedSource] || { label: source, color: "var(--foreground-muted)" };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        className
      )}
      style={{ color: config.color }}
    >
      {config.label}
    </span>
  );
}

// ============================================
// MatchScore Component
// ============================================

export interface MatchScoreProps {
  /** Score value (0-100) */
  score: number;
  /** Show descriptive label (High/Medium/Low match) */
  showLabel?: boolean;
  /** Size variant */
  size?: "sm" | "default" | "lg";
  /** Additional className */
  className?: string;
}

export function MatchScore({ score, showLabel = false, size = "default", className }: MatchScoreProps) {
  const getScoreColors = (s: number) => {
    if (s >= 80) return { text: "var(--foreground-success)", bg: "var(--background-success)" };
    if (s >= 50) return { text: "var(--foreground-warning)", bg: "var(--background-warning)" };
    return { text: "var(--foreground-error)", bg: "var(--background-error)" };
  };

  const colors = getScoreColors(score);

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    default: "px-2 py-0.5 text-sm",
    lg: "px-2.5 py-1 text-base",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn("rounded-full font-semibold", sizeClasses[size])}
        style={{ color: colors.text, backgroundColor: colors.bg }}
      >
        {score}%
      </div>
      {showLabel && (
        <span className="text-sm text-[var(--foreground-muted)]">
          {score >= 80 ? "High" : score >= 50 ? "Medium" : "Low"} match
        </span>
      )}
    </div>
  );
}

// Alias for backward compatibility
export const MatchScoreDisplay = MatchScore;

// ============================================
// DaysInStage Component
// ============================================

export interface DaysInStageProps {
  /** Date the candidate applied */
  appliedDate: Date | string;
  /** Date the stage was changed (optional, defaults to appliedDate) */
  stageChangedDate?: Date | string;
  /** Days threshold for warning color */
  warningThreshold?: number;
  /** Days threshold for danger/error color */
  dangerThreshold?: number;
  /** Additional className */
  className?: string;
}

export function DaysInStage({
  appliedDate,
  stageChangedDate,
  warningThreshold = 7,
  dangerThreshold = 14,
  className,
}: DaysInStageProps) {
  const referenceDate = stageChangedDate ? new Date(stageChangedDate) : new Date(appliedDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - referenceDate.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const getColor = () => {
    if (days >= dangerThreshold) return "var(--foreground-error)";
    if (days >= warningThreshold) return "var(--foreground-warning)";
    return "var(--foreground-muted)";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn("text-sm font-medium", className)}
            style={{ color: getColor() }}
          >
            {days}d
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{days} days in current stage</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================
// NextAction Component
// ============================================

export interface NextActionProps {
  /** Action text to display */
  action: string;
  /** Whether this action is urgent */
  urgent?: boolean;
  /** Additional className */
  className?: string;
}

export function NextAction({ action, urgent, className }: NextActionProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "w-2 h-2 rounded-full flex-shrink-0",
          urgent ? "bg-[var(--foreground-error)] animate-pulse" : "bg-[var(--foreground-muted)]"
        )}
      />
      <span className={cn("text-sm", urgent && "font-medium text-[var(--foreground-error)]")}>
        {action}
      </span>
    </div>
  );
}

// ============================================
// ReviewersDisplay Component
// ============================================

export interface ReviewersDisplayProps {
  /** Array of reviewers */
  reviewers: CandidateReviewer[];
  /** Maximum number of avatars to show */
  maxDisplay?: number;
  /** Additional className */
  className?: string;
}

export function ReviewersDisplay({ reviewers, maxDisplay = 4, className }: ReviewersDisplayProps) {
  if (!reviewers || reviewers.length === 0) return null;

  return (
    <div className={cn("flex items-center -space-x-1", className)}>
      {reviewers.slice(0, maxDisplay).map((reviewer) => {
        const config = decisionConfig[reviewer.decision];
        return (
          <TooltipProvider key={reviewer.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Avatar className="h-6 w-6 border-2 border-[var(--background-default)]">
                    {reviewer.avatar ? (
                      <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
                    ) : null}
                    <AvatarFallback className="text-xs">
                      {reviewer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: config.bgColor, color: config.color }}
                  >
                    {React.cloneElement(config.icon as React.ReactElement, { className: "h-2 w-2" })}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{reviewer.name}: {config.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
      {reviewers.length > maxDisplay && (
        <span className="text-xs text-[var(--foreground-muted)] pl-2">
          +{reviewers.length - maxDisplay}
        </span>
      )}
    </div>
  );
}

// ============================================
// DecisionPill Component
// ============================================

export interface DecisionPillProps {
  /** The decision type */
  decision: DecisionType;
  /** Show label text */
  showLabel?: boolean;
  /** Additional className */
  className?: string;
}

export function DecisionPill({ decision, showLabel = true, className }: DecisionPillProps) {
  const config = decisionConfig[decision];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        className
      )}
      style={{ backgroundColor: config.bgColor, color: config.color }}
    >
      {config.icon}
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

// ============================================
// Utility Functions
// ============================================

/** Get stage configuration by stage name */
export function getStageConfig(stage: CandidateStage | string): StageConfig | undefined {
  return stageConfig[stage.toLowerCase() as CandidateStage];
}

/** Get source configuration by source name */
export function getSourceConfig(source: CandidateSource | string): SourceConfig | undefined {
  return sourceConfig[source.toLowerCase() as CandidateSource];
}

/** Get decision configuration by decision type */
export function getDecisionConfig(decision: DecisionType): DecisionConfig {
  return decisionConfig[decision];
}

/** Calculate days between a date and now */
export function calculateDaysAgo(date: Date | string): number {
  const referenceDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - referenceDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/** Get color based on match score */
export function getMatchScoreColor(score: number): { text: string; bg: string } {
  if (score >= 80) return { text: "var(--foreground-success)", bg: "var(--background-success)" };
  if (score >= 50) return { text: "var(--foreground-warning)", bg: "var(--background-warning)" };
  return { text: "var(--foreground-error)", bg: "var(--background-error)" };
}

/** Get match score label */
export function getMatchScoreLabel(score: number): string {
  if (score >= 80) return "High";
  if (score >= 50) return "Medium";
  return "Low";
}

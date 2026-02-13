"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  PaperPlaneTilt,
  HourglassSimpleMedium,
  ChatCircleDots,
  SealCheck,
  Trophy,
  Prohibit,
  UsersThree,
  Plus,
} from "@phosphor-icons/react";
import type { PhaseGroup } from "@/lib/pipeline/stage-registry";

/**
 * Kanban Board Components for ATS Pipeline Management
 *
 * These are presentational components - drag-and-drop functionality
 * should be implemented with dnd-kit at the application level.
 */

interface KanbanBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Show loading skeleton */
  loading?: boolean;
  /** Number of skeleton columns to show when loading */
  skeletonColumns?: number;
}

const KanbanBoard = React.forwardRef<HTMLDivElement, KanbanBoardProps>(
  ({ className, children, loading = false, skeletonColumns = 5, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Horizontal scroll container — columns set their own min-width
        "flex overflow-x-auto",
        // Rounded corners on the board container, not individual columns
        "overflow-hidden rounded-xl",
        // Custom scrollbar styling
        "scrollbar-thin scrollbar-track-background-muted scrollbar-thumb-border-emphasis",
        className
      )}
      {...props}
    >
      {loading
        ? Array.from({ length: skeletonColumns }).map((_, i) => (
            <KanbanColumnSkeleton key={i} index={i} />
          ))
        : children}
    </div>
  )
);
KanbanBoard.displayName = "KanbanBoard";

/**
 * Skeleton loading state for KanbanColumn with wave animation
 */
interface KanbanColumnSkeletonProps {
  index?: number;
}

const KanbanColumnSkeleton = ({ index = 0 }: KanbanColumnSkeletonProps) => (
  <div
    className={cn(
      "flex min-w-[280px] flex-1 animate-fade-in flex-col",
      "bg-kanban-column-bg dark:bg-surface-sunken",
      // Vertical divider between columns (not on last) - uses neutral-100
      "border-r border-[var(--primitive-neutral-100)] last:border-r-0 dark:border-[var(--primitive-neutral-800)]"
    )}
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* Header skeleton - no bottom border */}
    <div className="flex items-center gap-2 p-3">
      <div className="h-4 w-4 animate-shimmer rounded bg-background-emphasized" />
      <div
        className="h-4 w-24 animate-shimmer rounded bg-background-emphasized"
        style={{ animationDelay: "50ms" }}
      />
      <div
        className="ml-auto h-5 w-6 animate-shimmer rounded-full bg-background-emphasized"
        style={{ animationDelay: "100ms" }}
      />
    </div>
    {/* Cards skeleton with staggered wave animation */}
    <div className="min-h-[200px] flex-1 space-y-2 p-2">
      <KanbanCardSkeleton index={0} />
      <KanbanCardSkeleton index={1} />
      <KanbanCardSkeleton index={2} />
    </div>
  </div>
);

/**
 * Skeleton loading state for kanban column cards with shimmer effect
 */
interface KanbanCardSkeletonProps {
  index?: number;
}

const KanbanCardSkeleton = ({ index = 0 }: KanbanCardSkeletonProps) => (
  <div
    className="animate-fade-in space-y-3 rounded-lg bg-surface p-3 shadow-card"
    style={{ animationDelay: `${index * 75}ms` }}
  >
    {/* Avatar + Name */}
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 animate-shimmer rounded-full bg-background-emphasized" />
      <div className="flex-1 space-y-1.5">
        <div
          className="h-3.5 w-28 animate-shimmer rounded bg-background-emphasized"
          style={{ animationDelay: "50ms" }}
        />
        <div
          className="h-3 w-20 animate-shimmer rounded bg-background-emphasized"
          style={{ animationDelay: "100ms" }}
        />
      </div>
    </div>
    {/* Tags */}
    <div className="flex gap-1">
      <div
        className="h-5 w-14 animate-shimmer rounded-full bg-background-emphasized"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="h-5 w-16 animate-shimmer rounded-full bg-background-emphasized"
        style={{ animationDelay: "200ms" }}
      />
    </div>
  </div>
);

/** Stage type for semantic column icons */
type KanbanStageType =
  | "applied"
  | "screening"
  | "qualified"
  | "interview"
  | "offer"
  | "hired"
  | "rejected"
  | "talent-pool";

/**
 * Map KanbanStageType to PhaseGroup for registry lookups.
 * "screening" and "qualified" both map to the "review" phase group.
 */
const KANBAN_TO_PHASE: Record<KanbanStageType, PhaseGroup> = {
  applied: "applied",
  screening: "review",
  qualified: "review",
  interview: "interview",
  offer: "offer",
  hired: "hired",
  rejected: "rejected",
  "talent-pool": "talent-pool",
};

/** Phosphor icon components for each phase group */
const PHASE_ICONS: Record<PhaseGroup, React.ElementType> = {
  applied: PaperPlaneTilt,
  review: HourglassSimpleMedium,
  interview: ChatCircleDots,
  offer: SealCheck,
  hired: Trophy,
  rejected: Prohibit,
  withdrawn: Prohibit,
  "talent-pool": UsersThree,
};

/** Phosphor icon weights for each phase group (fill for most, bold for prohibit/users) */
const PHASE_ICON_WEIGHTS: Record<PhaseGroup, "fill" | "bold" | "regular"> = {
  applied: "fill",
  review: "fill",
  interview: "fill",
  offer: "fill",
  hired: "fill",
  rejected: "bold",
  withdrawn: "bold",
  "talent-pool": "bold",
};

/** Kanban column color classes for each phase group */
const PHASE_COLORS: Record<PhaseGroup, string> = {
  applied: "text-[var(--primitive-purple-500)]",
  review: "text-[var(--primitive-blue-500)]",
  interview: "text-[var(--primitive-orange-500)]",
  offer: "text-[var(--primitive-green-500)]",
  hired: "text-[var(--primitive-green-600)]",
  rejected: "text-[var(--primitive-red-500)]",
  withdrawn: "text-[var(--foreground-muted)]",
  "talent-pool": "text-[var(--primitive-yellow-500)]",
};

/** Stage icon configuration derived from the pipeline stage registry */
const stageIcons: Record<KanbanStageType, { icon: React.ReactNode; colorClass: string }> =
  Object.fromEntries(
    (Object.keys(KANBAN_TO_PHASE) as KanbanStageType[]).map((stage) => {
      const phase = KANBAN_TO_PHASE[stage];
      const Icon = PHASE_ICONS[phase];
      return [
        stage,
        {
          colorClass: PHASE_COLORS[phase],
          icon: <Icon size={16} weight={PHASE_ICON_WEIGHTS[phase]} />,
        },
      ];
    })
  ) as Record<KanbanStageType, { icon: React.ReactNode; colorClass: string }>;

interface KanbanColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Column title */
  title: string;
  /** Item count */
  count?: number;
  /** Column color indicator (legacy - use stage instead for icons) */
  color?: string;
  /** Stage type for semantic icon (applied, qualified, interview, offer, hired, rejected) */
  stage?: KanbanStageType;
  /** Custom icon to display instead of stage icon */
  icon?: React.ReactNode;
  /** Whether to show the column header actions slot */
  headerActions?: React.ReactNode;
}

const KanbanColumn = React.forwardRef<HTMLDivElement, KanbanColumnProps>(
  ({ className, children, title, count, color, stage, icon, headerActions, ...props }, ref) => {
    // Determine icon and color from stage or use provided values
    const stageConfig = stage ? stageIcons[stage] : null;
    const displayIcon = icon || stageConfig?.icon;
    const colorClass = stageConfig?.colorClass;

    return (
      <div
        ref={ref}
        className={cn(
          "flex min-w-[280px] flex-1 flex-shrink-0 flex-col",
          "bg-kanban-column-bg dark:bg-surface-sunken",
          // Vertical divider between columns - uses neutral-100 (lighter)
          "border-r border-[var(--primitive-neutral-100)] last:border-r-0 dark:border-[var(--primitive-neutral-800)]",
          "transition-colors duration-fast",
          className
        )}
        {...props}
      >
        {/* Header - no bottom border, flows into cards area */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2">
            {displayIcon ? (
              <span className={colorClass}>{displayIcon}</span>
            ) : color ? (
              <div
                className="h-2.5 w-2.5 rounded-full transition-transform duration-fast hover:scale-125"
                style={{ backgroundColor: color }}
              />
            ) : null}
            <h3 className="text-body-sm font-semibold text-foreground">{title}</h3>
            {count !== undefined && (
              <span className="rounded-full bg-background-emphasized px-1.5 py-0.5 text-caption tabular-nums text-foreground-subtle transition-all duration-fast">
                {count}
              </span>
            )}
          </div>
          {headerActions}
        </div>
        <div className="min-h-[120px] flex-1 space-y-2.5 overflow-y-auto p-2.5">{children}</div>
      </div>
    );
  }
);
KanbanColumn.displayName = "KanbanColumn";

/**
 * Empty state for Kanban columns
 */
interface KanbanEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

const KanbanEmpty = React.forwardRef<HTMLDivElement, KanbanEmptyProps>(
  ({ className, message = "No candidates", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center py-8",
        "text-caption text-foreground-muted",
        className
      )}
      {...props}
    >
      {message}
    </div>
  )
);
KanbanEmpty.displayName = "KanbanEmpty";

/**
 * Drop placeholder shown during drag with pulse animation
 */
interface KanbanDropPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number;
}

const KanbanDropPlaceholder = React.forwardRef<HTMLDivElement, KanbanDropPlaceholderProps>(
  ({ className, height = 72, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-primary-50/30 rounded-lg border border-dashed border-primary-400",
        "transition-all duration-fast",
        className
      )}
      style={{ height }}
      {...props}
    />
  )
);
KanbanDropPlaceholder.displayName = "KanbanDropPlaceholder";

/**
 * Add card button at bottom of column
 */
interface KanbanAddCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

const KanbanAddCard = React.forwardRef<HTMLButtonElement, KanbanAddCardProps>(
  ({ className, label = "Add candidate", ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex w-full items-center gap-2 px-2 py-1.5",
        "text-caption text-foreground-muted",
        "transition-colors duration-fast hover:text-foreground",
        "focus-visible:text-foreground focus-visible:outline-none",
        className
      )}
      {...props}
    >
      <Plus size={16} weight="bold" />
      {label}
    </button>
  )
);
KanbanAddCard.displayName = "KanbanAddCard";

export {
  KanbanBoard,
  KanbanColumn,
  KanbanColumnSkeleton,
  KanbanCardSkeleton,
  KanbanEmpty,
  KanbanDropPlaceholder,
  KanbanAddCard,
  stageIcons,
};

export type { KanbanStageType };

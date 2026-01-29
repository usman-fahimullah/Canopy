"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
        // Flush columns with no gap - columns handle their own dividers
        "flex overflow-x-auto pb-4",
        // Rounded corners on the board container, not individual columns
        "rounded-xl overflow-hidden",
        // No outer border - columns handle dividers internally
        "scrollbar-thin scrollbar-track-background-muted scrollbar-thumb-border-emphasis",
        className
      )}
      {...props}
    >
      {loading ? (
        Array.from({ length: skeletonColumns }).map((_, i) => (
          <KanbanColumnSkeleton key={i} index={i} />
        ))
      ) : (
        children
      )}
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
      "flex-shrink-0 w-72 flex flex-col animate-fade-in",
      "bg-kanban-column-bg dark:bg-surface-sunken",
      // Vertical divider between columns (not on last) - uses neutral-100
      "border-r border-[var(--primitive-neutral-100)] dark:border-[var(--primitive-neutral-800)] last:border-r-0"
    )}
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* Header skeleton - no bottom border */}
    <div className="flex items-center gap-2 p-3">
      <div className="w-4 h-4 rounded bg-background-emphasized animate-shimmer" />
      <div className="h-4 w-24 bg-background-emphasized rounded animate-shimmer" style={{ animationDelay: '50ms' }} />
      <div className="h-5 w-6 bg-background-emphasized rounded-full ml-auto animate-shimmer" style={{ animationDelay: '100ms' }} />
    </div>
    {/* Cards skeleton with staggered wave animation */}
    <div className="flex-1 p-2 space-y-2 min-h-[200px]">
      <KanbanCardSkeleton index={0} />
      <KanbanCardSkeleton index={1} />
      <KanbanCardSkeleton index={2} />
    </div>
  </div>
);

/**
 * Skeleton loading state for KanbanCard with shimmer effect
 */
interface KanbanCardSkeletonProps {
  index?: number;
}

const KanbanCardSkeleton = ({ index = 0 }: KanbanCardSkeletonProps) => (
  <div
    className="bg-surface rounded-lg p-3 shadow-card space-y-3 animate-fade-in"
    style={{ animationDelay: `${index * 75}ms` }}
  >
    {/* Avatar + Name */}
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-background-emphasized animate-shimmer" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-28 bg-background-emphasized rounded animate-shimmer" style={{ animationDelay: '50ms' }} />
        <div className="h-3 w-20 bg-background-emphasized rounded animate-shimmer" style={{ animationDelay: '100ms' }} />
      </div>
    </div>
    {/* Tags */}
    <div className="flex gap-1">
      <div className="h-5 w-14 bg-background-emphasized rounded-full animate-shimmer" style={{ animationDelay: '150ms' }} />
      <div className="h-5 w-16 bg-background-emphasized rounded-full animate-shimmer" style={{ animationDelay: '200ms' }} />
    </div>
  </div>
);

/** Stage type for semantic column icons */
type KanbanStageType =
  | "applied"
  | "qualified"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

/** Stage icon configuration using design system tokens */
const stageIcons: Record<KanbanStageType, { icon: React.ReactNode; colorClass: string }> = {
  applied: {
    colorClass: "text-[var(--primitive-purple-500)]",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
      </svg>
    ),
  },
  qualified: {
    colorClass: "text-[var(--primitive-blue-500)]",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  interview: {
    colorClass: "text-[var(--primitive-orange-500)]",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
      </svg>
    ),
  },
  offer: {
    colorClass: "text-[var(--primitive-green-500)]",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  hired: {
    colorClass: "text-[var(--primitive-green-500)]",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  rejected: {
    colorClass: "text-[var(--primitive-red-500)]",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  },
};

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
  (
    { className, children, title, count, color, stage, icon, headerActions, ...props },
    ref
  ) => {
    // Determine icon and color from stage or use provided values
    const stageConfig = stage ? stageIcons[stage] : null;
    const displayIcon = icon || stageConfig?.icon;
    const colorClass = stageConfig?.colorClass;

    return (
      <div
        ref={ref}
        className={cn(
          "flex-shrink-0 w-72 flex flex-col",
          "bg-kanban-column-bg dark:bg-surface-sunken",
          // No rounded corners - board container handles rounding
          // Vertical divider between columns - uses neutral-100 (lighter)
          "border-r border-[var(--primitive-neutral-100)] dark:border-[var(--primitive-neutral-800)] last:border-r-0",
          "transition-colors duration-fast",
          className
        )}
        {...props}
      >
        {/* Header - no bottom border, flows into cards area */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            {displayIcon ? (
              <span className={colorClass}>{displayIcon}</span>
            ) : color ? (
              <div
                className="w-2.5 h-2.5 rounded-full transition-transform duration-fast hover:scale-125"
                style={{ backgroundColor: color }}
              />
            ) : null}
            <h3 className="text-body-sm font-semibold text-foreground">
              {title}
            </h3>
            {count !== undefined && (
              <span className="text-caption text-foreground-subtle bg-background-emphasized px-1.5 py-0.5 rounded-full tabular-nums transition-all duration-fast">
                {count}
              </span>
            )}
          </div>
          {headerActions}
        </div>
        <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[200px] max-h-[calc(100vh-200px)]">
          {children}
        </div>
      </div>
    );
  }
);
KanbanColumn.displayName = "KanbanColumn";

interface KanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Whether the card is being dragged */
  isDragging?: boolean;
  /** Whether the card is the drop target */
  isDropTarget?: boolean;
  /** Whether the card is selected */
  isSelected?: boolean;
}

const KanbanCard = React.forwardRef<HTMLDivElement, KanbanCardProps>(
  (
    { className, children, isDragging, isDropTarget, isSelected, onKeyDown, ...props },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Allow parent to override
      onKeyDown?.(e);

      // Only handle if not already handled
      if (e.defaultPrevented) return;

      // Support basic keyboard navigation
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        (e.target as HTMLElement).click();
      }
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={cn(
          "group relative bg-surface rounded-lg p-3 shadow-card cursor-grab",
          "transition-all duration-fast ease-out",
          "hover:shadow-md hover:border-border-emphasis hover:-translate-y-0.5",
          "active:cursor-grabbing active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          isDragging && "opacity-75 shadow-elevated rotate-[3deg] scale-105 z-50",
          isDropTarget && "ring-2 ring-primary-500 ring-offset-2 bg-primary-50/50 scale-[1.02]",
          isSelected && "ring-2 ring-primary-600 bg-primary-50/30",
          className
        )}
        {...props}
      >
        {/* Drag handle indicator */}
        <div className={cn(
          "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-fast",
          "text-foreground-muted",
          isDragging && "opacity-100"
        )}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="3" cy="3" r="1.5" />
            <circle cx="9" cy="3" r="1.5" />
            <circle cx="3" cy="9" r="1.5" />
            <circle cx="9" cy="9" r="1.5" />
          </svg>
        </div>
        {children}
      </div>
    );
  }
);
KanbanCard.displayName = "KanbanCard";

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
interface KanbanDropPlaceholderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  height?: number;
}

const KanbanDropPlaceholder = React.forwardRef<
  HTMLDivElement,
  KanbanDropPlaceholderProps
>(({ className, height = 72, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border border-dashed border-primary-400 bg-primary-50/30 rounded-lg",
      "transition-all duration-fast",
      className
    )}
    style={{ height }}
    {...props}
  />
));
KanbanDropPlaceholder.displayName = "KanbanDropPlaceholder";

/**
 * Add card button at bottom of column
 */
interface KanbanAddCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

const KanbanAddCard = React.forwardRef<HTMLButtonElement, KanbanAddCardProps>(
  ({ className, label = "Add candidate", ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5",
        "text-caption text-foreground-muted",
        "hover:text-foreground transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:text-foreground",
        className
      )}
      {...props}
    >
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 3v10M3 8h10" strokeLinecap="round" />
      </svg>
      {label}
    </button>
  )
);
KanbanAddCard.displayName = "KanbanAddCard";

export {
  KanbanBoard,
  KanbanColumn,
  KanbanColumnSkeleton,
  KanbanCard,
  KanbanCardSkeleton,
  KanbanEmpty,
  KanbanDropPlaceholder,
  KanbanAddCard,
  stageIcons,
};

export type { KanbanStageType };

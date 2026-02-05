"use client";

import { Fire, Trophy, Confetti } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { SimpleTooltip } from "@/components/ui";

// =============================================================================
// TYPES
// =============================================================================

interface StreakBadgeProps {
  /** Current streak in days */
  streak: number;
  /** Whether the streak is active today */
  isActiveToday?: boolean;
  /** Callback when milestone is reached (7, 14, 30 days) */
  onMilestoneReached?: (days: number) => void;
  /** Size variant */
  size?: "sm" | "md";
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MILESTONES = [7, 14, 30, 60, 100];

function getMilestoneInfo(streak: number): { reached: number | null; next: number | null } {
  let reached: number | null = null;
  let next: number | null = null;

  for (const milestone of MILESTONES) {
    if (streak >= milestone) {
      reached = milestone;
    } else {
      next = milestone;
      break;
    }
  }

  return { reached, next };
}

function getStreakMessage(streak: number, isActiveToday: boolean): string {
  if (streak === 0) {
    return "Complete a task to start your streak!";
  }
  if (!isActiveToday) {
    return `${streak} day streak! Complete a task today to keep it going.`;
  }
  if (streak === 1) {
    return "Great start! Keep going tomorrow.";
  }
  if (streak < 7) {
    return `${streak} day streak! ${7 - streak} more days to your first milestone.`;
  }
  if (streak < 14) {
    return `${streak} day streak! You're on fire!`;
  }
  if (streak < 30) {
    return `${streak} day streak! Amazing consistency!`;
  }
  return `${streak} day streak! You're unstoppable!`;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function StreakBadge({ streak, isActiveToday = false, size = "md" }: StreakBadgeProps) {
  const { reached, next } = getMilestoneInfo(streak);
  const message = getStreakMessage(streak, isActiveToday);

  // Determine icon based on streak status
  const Icon = reached && reached >= 30 ? Trophy : Fire;

  // Color based on streak status
  const getColors = () => {
    if (streak === 0) {
      return {
        bg: "bg-[var(--background-muted)]",
        text: "text-[var(--foreground-subtle)]",
        icon: "text-[var(--foreground-subtle)]",
      };
    }
    if (!isActiveToday) {
      return {
        bg: "bg-[var(--background-warning)]",
        text: "text-[var(--foreground-warning)]",
        icon: "text-[var(--foreground-warning)]",
      };
    }
    if (streak >= 30) {
      return {
        bg: "bg-gradient-to-r from-[var(--primitive-orange-100)] to-[var(--primitive-yellow-100)]",
        text: "text-[var(--primitive-orange-700)]",
        icon: "text-[var(--primitive-orange-500)]",
      };
    }
    if (streak >= 7) {
      return {
        bg: "bg-[var(--primitive-orange-100)]",
        text: "text-[var(--primitive-orange-700)]",
        icon: "text-[var(--primitive-orange-500)]",
      };
    }
    return {
      bg: "bg-[var(--primitive-red-100)]",
      text: "text-[var(--primitive-red-700)]",
      icon: "text-[var(--primitive-red-500)]",
    };
  };

  const colors = getColors();

  const sizeClasses = {
    sm: "px-2 py-0.5 text-caption-sm gap-1",
    md: "px-3 py-1 text-caption gap-1.5",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
  };

  return (
    <SimpleTooltip content={message}>
      <div
        className={cn(
          "inline-flex items-center rounded-full font-medium transition-all",
          colors.bg,
          colors.text,
          sizeClasses[size],
          !isActiveToday && streak > 0 && "animate-pulse"
        )}
        role="status"
        aria-label={`${streak} day streak`}
      >
        <Icon
          size={iconSizes[size]}
          weight={streak > 0 ? "fill" : "regular"}
          className={colors.icon}
        />
        <span>{streak}</span>
        {next && streak > 0 && <span className="text-[var(--foreground-subtle)]">/ {next}</span>}
      </div>
    </SimpleTooltip>
  );
}

// =============================================================================
// MILESTONE CELEBRATION COMPONENT
// =============================================================================

interface StreakMilestoneCelebrationProps {
  days: number;
  onClose: () => void;
}

export function StreakMilestoneCelebration({ days, onClose }: StreakMilestoneCelebrationProps) {
  const messages: Record<number, { title: string; description: string }> = {
    7: {
      title: "One Week Streak! 🔥",
      description: "You've completed tasks for 7 days straight. Amazing dedication!",
    },
    14: {
      title: "Two Week Streak! 🔥🔥",
      description: "14 days of consistent progress. You're building real momentum!",
    },
    30: {
      title: "One Month Streak! 🏆",
      description: "30 days of dedication! You're on track to achieve your goals.",
    },
    60: {
      title: "Two Month Streak! 🏆🏆",
      description: "60 days! Your commitment is truly inspiring.",
    },
    100: {
      title: "100 Day Streak! 👑",
      description: "Incredible! 100 days of consistent effort. You're a champion!",
    },
  };

  const content = messages[days] ?? {
    title: `${days} Day Streak!`,
    description: "Keep up the great work!",
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="mb-4 flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-gradient-to-br from-[var(--primitive-orange-200)] to-[var(--primitive-yellow-200)]">
        <Confetti size={32} weight="fill" className="text-[var(--primitive-orange-600)]" />
      </div>
      <h3 className="mb-2 text-heading-sm font-bold text-[var(--foreground-default)]">
        {content.title}
      </h3>
      <p className="mb-6 max-w-xs text-body text-[var(--foreground-muted)]">
        {content.description}
      </p>
      <button
        onClick={onClose}
        className="rounded-lg bg-[var(--button-primary-background)] px-6 py-2 text-body font-medium text-[var(--button-primary-foreground)] transition-colors hover:bg-[var(--button-primary-background-hover)]"
      >
        Keep Going!
      </button>
    </div>
  );
}

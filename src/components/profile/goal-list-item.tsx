"use client";

import {
  Button,
  Badge,
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemTitle,
  ListItemTrailing,
} from "@/components/ui";
import { getGoalCategory } from "@/lib/profile/goal-categories";
import { cn } from "@/lib/utils";
import { CalendarBlank, Warning } from "@phosphor-icons/react";

interface GoalListItemProps {
  id: string;
  title: string;
  progress: number;
  category: string | null;
  targetDate?: Date | string | null;
  onView: (id: string) => void;
}

/**
 * Formats the due date for display with relative time
 */
function formatDueDate(date: Date | string): {
  text: string;
  isOverdue: boolean;
  isDueSoon: boolean;
} {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  // Reset time to compare just dates
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      text: overdueDays === 1 ? "1 day overdue" : `${overdueDays} days overdue`,
      isOverdue: true,
      isDueSoon: false,
    };
  }
  if (diffDays === 0) {
    return { text: "Due today", isOverdue: false, isDueSoon: true };
  }
  if (diffDays === 1) {
    return { text: "Due tomorrow", isOverdue: false, isDueSoon: true };
  }
  if (diffDays <= 7) {
    return { text: `Due in ${diffDays} days`, isOverdue: false, isDueSoon: true };
  }
  if (diffDays <= 14) {
    return { text: `Due in ${diffDays} days`, isOverdue: false, isDueSoon: false };
  }

  // More than 2 weeks away - show formatted date
  return {
    text: `Due ${targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    isOverdue: false,
    isDueSoon: false,
  };
}

export function GoalListItem({
  id,
  title,
  progress,
  category,
  targetDate,
  onView,
}: GoalListItemProps) {
  const cat = getGoalCategory(category);
  const IconComponent = cat.icon;

  const dueDateInfo = targetDate ? formatDueDate(targetDate) : null;

  return (
    <ListItem size="md" className="border-b border-[var(--border-muted)] last:border-0">
      {/* Category icon circle */}
      <ListItemLeading size="md">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", cat.bg)}>
          <IconComponent size={20} weight="fill" className={cat.text} />
        </div>
      </ListItemLeading>

      {/* Title + progress + due date */}
      <ListItemContent>
        <div className="flex items-center gap-2">
          <ListItemTitle>{title}</ListItemTitle>
          {/* Overdue badge */}
          {dueDateInfo?.isOverdue && (
            <Badge variant="error" size="sm">
              <Warning size={12} weight="fill" className="mr-1" />
              Overdue
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className={cn("text-caption", cat.text)}>{progress}% Ready</p>
          {/* Due date display */}
          {dueDateInfo && !dueDateInfo.isOverdue && (
            <span
              className={cn(
                "flex items-center gap-1 text-caption",
                dueDateInfo.isDueSoon
                  ? "text-[var(--foreground-warning)]"
                  : "text-[var(--foreground-subtle)]"
              )}
            >
              <CalendarBlank size={12} />
              {dueDateInfo.text}
            </span>
          )}
        </div>
      </ListItemContent>

      {/* View button */}
      <ListItemTrailing>
        <Button variant="outline" size="sm" onClick={() => onView(id)}>
          View Goal
        </Button>
      </ListItemTrailing>
    </ListItem>
  );
}

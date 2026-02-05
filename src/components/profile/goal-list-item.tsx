"use client";

import { Button } from "@/components/ui/button";
import { getGoalCategory } from "@/lib/profile/goal-categories";
import { cn } from "@/lib/utils";

interface GoalListItemProps {
  id: string;
  title: string;
  progress: number;
  category: string | null;
  onView: (id: string) => void;
}

export function GoalListItem({ id, title, progress, category, onView }: GoalListItemProps) {
  const cat = getGoalCategory(category);
  const IconComponent = cat.icon;

  return (
    <div className="flex items-center gap-4 border-b border-[var(--border-muted)] py-4 last:border-0">
      {/* Category icon circle */}
      <div
        className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", cat.bg)}
      >
        <IconComponent size={20} weight="fill" className={cat.text} />
      </div>

      {/* Title + progress */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-body font-medium text-[var(--foreground-default)]">{title}</p>
        <p className={cn("text-caption", cat.text)}>{progress}% Ready</p>
      </div>

      {/* View button */}
      <Button variant="outline" size="sm" onClick={() => onView(id)}>
        View Goal
      </Button>
    </div>
  );
}

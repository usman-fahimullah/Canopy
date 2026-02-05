"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProgressMeterSteps } from "@/components/ui/progress-meter";
import {
  CheckCircle,
  CircleDashed,
  Flag,
  CaretUp,
  CaretDown,
  CaretRight,
} from "@phosphor-icons/react";
import { CHECKLIST_ITEMS, SHELL_DISPLAY_NAMES } from "@/lib/checklist";
import type { Shell } from "@/lib/onboarding/types";

// ─── Types ───────────────────────────────────────────────────────

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  href: string;
  completed: boolean;
}

// ─── Component ───────────────────────────────────────────────────

interface DashboardChecklistProps {
  shell: Shell;
  className?: string;
}

export function DashboardChecklist({ shell, className }: DashboardChecklistProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>(
    CHECKLIST_ITEMS[shell].map((item) => ({ ...item, completed: false }))
  );

  const storageKeyCollapsed = `${shell}-checklist-collapsed`;
  const storageKeyCompleted = `${shell}-checklist-completed`;

  useEffect(() => {
    // Restore collapsed state
    const collapsed = localStorage.getItem(storageKeyCollapsed);
    if (collapsed === "true") {
      setIsCollapsed(true);
    }

    // Load completion data: API first, localStorage fallback
    const loadCompletion = async () => {
      try {
        const response = await fetch(`/api/checklist?shell=${shell}`);
        if (response.ok) {
          const data = await response.json();
          const apiCompletedIds = (data.items || [])
            .filter((item: { completed: boolean }) => item.completed)
            .map((item: { id: string }) => item.id);

          // Merge API auto-detection with localStorage manual completions
          const localRaw = localStorage.getItem(storageKeyCompleted);
          const localIds: string[] = localRaw ? (JSON.parse(localRaw) as string[]) : [];

          const allCompletedIds = new Set([...apiCompletedIds, ...localIds]);

          if (allCompletedIds.size > 0) {
            setItems((prev) =>
              prev.map((item) => ({
                ...item,
                completed: allCompletedIds.has(item.id),
              }))
            );
            return;
          }
        }
      } catch {
        // API unavailable, fallback below
      }

      // Pure localStorage fallback
      const completedItems = localStorage.getItem(storageKeyCompleted);
      if (completedItems) {
        const completed = JSON.parse(completedItems) as string[];
        setItems((prev) =>
          prev.map((item) => ({
            ...item,
            completed: completed.includes(item.id),
          }))
        );
      }
    };

    loadCompletion();
  }, [shell, storageKeyCollapsed, storageKeyCompleted]);

  const handleToggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem(storageKeyCollapsed, String(next));
  };

  const handleItemClick = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, completed: true } : item))
    );

    const completed = items
      .filter((item) => item.completed || item.id === itemId)
      .map((item) => item.id);
    localStorage.setItem(storageKeyCompleted, JSON.stringify(completed));
  };

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const allComplete = completedCount === totalCount;

  // Auto-hide when all items are complete
  if (allComplete) return null;

  const displayName = SHELL_DISPLAY_NAMES[shell];
  const CaretIcon = isCollapsed ? CaretDown : CaretUp;

  return (
    <div
      className={cn(
        "overflow-clip rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pb-2 pt-4">
        <Flag size={24} weight="fill" className="shrink-0 text-[var(--foreground-default)]" />
        <p className="min-w-0 flex-1 text-body font-medium text-[var(--foreground-default)]">
          Get Started with {displayName}
        </p>
        <button
          type="button"
          onClick={handleToggleCollapse}
          className="shrink-0 rounded-[var(--radius-2xl)] bg-[var(--card-background)] p-2.5 transition-colors hover:bg-[var(--background-subtle)]"
          aria-label={isCollapsed ? "Expand checklist" : "Collapse checklist"}
        >
          <CaretIcon size={20} className="text-[var(--foreground-default)]" />
        </button>
      </div>

      {/* Progress bar — always visible */}
      <div className="px-6 pb-2 pt-4">
        <ProgressMeterSteps
          goal="networking"
          totalSteps={totalCount}
          currentStep={completedCount}
          showLabel
          labelText="Complete"
        />
      </div>

      {/* Checklist items — hidden when collapsed */}
      {!isCollapsed && (
        <div>
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => handleItemClick(item.id)}
              className={cn(
                "flex items-center gap-3 border-b border-[var(--border-muted)] px-6 py-6 transition-colors",
                !item.completed && "hover:bg-[var(--background-subtle)]"
              )}
            >
              {/* Status icon */}
              {item.completed ? (
                <CheckCircle
                  size={24}
                  weight="fill"
                  className="shrink-0 text-[var(--primitive-blue-500)]"
                />
              ) : (
                <CircleDashed size={24} className="shrink-0 text-[var(--foreground-default)]" />
              )}

              {/* Text content */}
              {item.completed ? (
                <p className="min-w-0 flex-1 truncate text-body text-[var(--primitive-neutral-500)]">
                  {item.label}
                </p>
              ) : (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body text-[var(--foreground-default)]">
                    {item.label}
                  </p>
                  <p className="truncate text-caption text-[var(--foreground-default)]">
                    {item.description}
                  </p>
                </div>
              )}

              {/* Action chevron — only for incomplete items */}
              {!item.completed && (
                <div className="shrink-0 rounded-[var(--radius-2xl)] bg-[var(--primitive-neutral-200)] p-2.5">
                  <CaretRight size={20} className="text-[var(--foreground-default)]" />
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

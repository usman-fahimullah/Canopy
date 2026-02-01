"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressMeterLinear } from "@/components/ui/progress-meter";
import { CheckCircle, Circle, Rocket, CaretRight, X } from "@phosphor-icons/react";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  href: string;
  completed: boolean;
}

interface GettingStartedChecklistProps {
  className?: string;
  /** Whether to allow dismissing the checklist */
  dismissible?: boolean;
  onDismiss?: () => void;
}

/**
 * GettingStartedChecklist guides new users through initial setup.
 * Shows progress and links to complete each step.
 */
export function GettingStartedChecklist({
  className,
  dismissible = true,
  onDismiss,
}: GettingStartedChecklistProps) {
  const [dismissed, setDismissed] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "profile",
      label: "Complete your profile",
      description: "Add your background and climate career goals",
      href: "/candid/profile",
      completed: false,
    },
    {
      id: "sectors",
      label: "Select target sectors",
      description: "Choose the climate sectors that interest you",
      href: "/candid/settings",
      completed: false,
    },
    {
      id: "session",
      label: "Book your first coaching session",
      description: "Connect with Saathe Studio to start your journey",
      href: "/candid/sessions/schedule",
      completed: false,
    },
    {
      id: "mentors",
      label: "Browse climate mentors",
      description: "Find mentors in your target sector",
      href: "/candid/mentors",
      completed: false,
    },
    {
      id: "jobs",
      label: "Save jobs that interest you",
      description: "Explore climate job opportunities",
      href: "/candid/jobs",
      completed: false,
    },
  ]);

  // Check completion status from API with localStorage fallback
  useEffect(() => {
    const checkCompletion = async () => {
      // Check localStorage for dismissed state
      const isDismissed = localStorage.getItem("candid-checklist-dismissed");
      if (isDismissed === "true") {
        setDismissed(true);
        return;
      }

      try {
        // Fetch actual completion status from API
        const response = await fetch("/api/checklist");
        if (response.ok) {
          const data = await response.json();
          // Map API response to our items
          const apiCompletedIds = data.items
            .filter((item: { completed: boolean }) => item.completed)
            .map((item: { id: string }) => {
              // Map API IDs to our component IDs
              const idMapping: Record<string, string> = {
                complete_profile: "profile",
                set_goals: "sectors",
                book_session: "session",
                browse_jobs: "jobs",
                connect_mentor: "mentors",
              };
              return idMapping[item.id] || item.id;
            });

          setItems((prev) =>
            prev.map((item) => ({
              ...item,
              completed: apiCompletedIds.includes(item.id),
            }))
          );
          return;
        }
      } catch (error) {
        console.error("Error fetching checklist from API:", error);
      }

      // Fallback to localStorage if API fails
      const completedItems = localStorage.getItem("candid-checklist-completed");
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

    checkCompletion();
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("candid-checklist-dismissed", "true");
    setDismissed(true);
    onDismiss?.();
  };

  const handleItemClick = (itemId: string) => {
    // Mark item as completed when clicked
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, completed: true } : item))
    );

    // Save to localStorage
    const completed = items
      .filter((item) => item.completed || item.id === itemId)
      .map((item) => item.id);
    localStorage.setItem("candid-checklist-completed", JSON.stringify(completed));
  };

  if (dismissed) {
    return null;
  }

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progressPercent = (completedCount / totalCount) * 100;
  const allComplete = completedCount === totalCount;

  // Hide if all complete (or show completion celebration)
  if (allComplete) {
    return (
      <Card className={cn("border-emerald-200 bg-emerald-50 p-4", className)}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle size={24} className="text-emerald-600" weight="fill" />
          </div>
          <div className="flex-1">
            <p className="text-body-strong font-medium text-emerald-800">You&apos;re all set!</p>
            <p className="text-caption text-emerald-600">
              You&apos;ve completed all getting started steps.
            </p>
          </div>
          {dismissible && (
            <Button variant="ghost" size="icon-sm" onClick={handleDismiss}>
              <X size={16} />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100">
            <Rocket size={16} className="text-emerald-700" weight="fill" />
          </div>
          <div>
            <h3 className="text-foreground-default text-body-strong font-medium">Get Started</h3>
            <p className="text-caption text-foreground-muted">
              {completedCount} of {totalCount} completed
            </p>
          </div>
        </div>
        {dismissible && (
          <Button variant="ghost" size="icon-sm" onClick={handleDismiss}>
            <X size={16} />
          </Button>
        )}
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-4">
        <ProgressMeterLinear value={progressPercent} showLabel={false} />
      </div>

      {/* Checklist items */}
      <div className="p-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-3 transition-all",
              item.completed ? "opacity-60" : "hover:bg-[var(--background-subtle)]"
            )}
          >
            {/* Check icon */}
            {item.completed ? (
              <CheckCircle size={20} className="flex-shrink-0 text-emerald-600" weight="fill" />
            ) : (
              <Circle size={20} className="flex-shrink-0 text-foreground-muted" weight="regular" />
            )}

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-body-sm font-medium",
                  item.completed ? "text-foreground-muted line-through" : "text-foreground-default"
                )}
              >
                {item.label}
              </p>
              {!item.completed && (
                <p className="truncate text-caption text-foreground-muted">{item.description}</p>
              )}
            </div>

            {/* Arrow */}
            {!item.completed && (
              <CaretRight size={16} className="flex-shrink-0 text-foreground-muted" />
            )}
          </Link>
        ))}
      </div>
    </Card>
  );
}

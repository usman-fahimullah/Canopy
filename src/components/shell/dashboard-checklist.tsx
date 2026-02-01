"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressMeterLinear } from "@/components/ui/progress-meter";
import { CheckCircle, Circle, Rocket, CaretRight, X } from "@phosphor-icons/react";
import type { Shell } from "@/lib/onboarding/types";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  href: string;
  completed: boolean;
}

const CHECKLIST_ITEMS: Record<Shell, ChecklistItem[]> = {
  talent: [
    {
      id: "profile",
      label: "Complete your profile",
      description: "Add your background and climate career goals",
      href: "/jobs/profile",
      completed: false,
    },
    {
      id: "skills",
      label: "Add skills & sectors",
      description: "Help us find the best job matches for you",
      href: "/jobs/profile",
      completed: false,
    },
    {
      id: "preferences",
      label: "Set job preferences",
      description: "Choose role types, locations, and salary range",
      href: "/jobs/profile",
      completed: false,
    },
    {
      id: "browse",
      label: "Browse job listings",
      description: "Explore climate roles that match your profile",
      href: "/jobs/search",
      completed: false,
    },
    {
      id: "save",
      label: "Save your first job",
      description: "Bookmark roles you're interested in",
      href: "/jobs/search",
      completed: false,
    },
  ],
  coach: [
    {
      id: "profile",
      label: "Set up your coach profile",
      description: "Add your headline, bio, and expertise",
      href: "/candid/coach/settings",
      completed: false,
    },
    {
      id: "availability",
      label: "Set your availability",
      description: "Choose when you're available for sessions",
      href: "/candid/coach/schedule",
      completed: false,
    },
    {
      id: "rate",
      label: "Set your hourly rate",
      description: "Configure your session pricing",
      href: "/candid/coach/settings",
      completed: false,
    },
    {
      id: "stripe",
      label: "Connect Stripe for payments",
      description: "Set up payouts to receive earnings",
      href: "/candid/coach/settings",
      completed: false,
    },
    {
      id: "verified",
      label: "Get verified",
      description: "Complete verification to start accepting clients",
      href: "/candid/coach/settings",
      completed: false,
    },
  ],
  employer: [
    {
      id: "company",
      label: "Add company information",
      description: "Set up your company profile and brand",
      href: "/canopy/settings",
      completed: false,
    },
    {
      id: "role",
      label: "Post your first role",
      description: "Create a job listing to start receiving applications",
      href: "/canopy/roles",
      completed: false,
    },
    {
      id: "team",
      label: "Invite a team member",
      description: "Collaborate on hiring with your colleagues",
      href: "/canopy/team",
      completed: false,
    },
    {
      id: "pipeline",
      label: "Set up your pipeline",
      description: "Customize hiring stages for your roles",
      href: "/canopy/roles",
      completed: false,
    },
    {
      id: "candidates",
      label: "Review candidates",
      description: "Browse and evaluate applicants",
      href: "/canopy/candidates",
      completed: false,
    },
  ],
};

interface DashboardChecklistProps {
  shell: Shell;
  className?: string;
}

export function DashboardChecklist({ shell, className }: DashboardChecklistProps) {
  const [dismissed, setDismissed] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>(
    CHECKLIST_ITEMS[shell].map((item) => ({ ...item }))
  );

  const storageKeyDismissed = `${shell}-checklist-dismissed`;
  const storageKeyCompleted = `${shell}-checklist-completed`;

  useEffect(() => {
    const isDismissed = localStorage.getItem(storageKeyDismissed);
    if (isDismissed === "true") {
      setDismissed(true);
      return;
    }

    // Try API first, fallback to localStorage
    const loadCompletion = async () => {
      try {
        const response = await fetch("/api/checklist");
        if (response.ok) {
          const data = await response.json();
          const apiCompletedIds = (data.items || [])
            .filter((item: { completed: boolean }) => item.completed)
            .map((item: { id: string }) => item.id);

          if (apiCompletedIds.length > 0) {
            setItems((prev) =>
              prev.map((item) => ({
                ...item,
                completed: apiCompletedIds.includes(item.id),
              }))
            );
            return;
          }
        }
      } catch {
        // API unavailable, fallback below
      }

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
  }, [storageKeyDismissed, storageKeyCompleted]);

  const handleDismiss = () => {
    localStorage.setItem(storageKeyDismissed, "true");
    setDismissed(true);
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

  if (dismissed) return null;

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progressPercent = (completedCount / totalCount) * 100;
  const allComplete = completedCount === totalCount;

  if (allComplete) {
    return (
      <Card
        className={cn(
          "border-[var(--primitive-green-200)] bg-[var(--primitive-green-100)] p-4",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primitive-green-200)]">
            <CheckCircle size={24} className="text-[var(--primitive-green-600)]" weight="fill" />
          </div>
          <div className="flex-1">
            <p className="text-body-strong font-medium text-[var(--primitive-green-800)]">
              You&apos;re all set!
            </p>
            <p className="text-caption text-[var(--primitive-green-600)]">
              You&apos;ve completed all getting started steps.
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={handleDismiss}>
            <X size={16} />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primitive-green-100)]">
            <Rocket size={16} className="text-[var(--primitive-green-700)]" weight="fill" />
          </div>
          <div>
            <h3 className="text-foreground-default text-body-strong font-medium">Get Started</h3>
            <p className="text-caption text-foreground-muted">
              {completedCount} of {totalCount} completed
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={handleDismiss}>
          <X size={16} />
        </Button>
      </div>

      <div className="px-4 pt-4">
        <ProgressMeterLinear value={progressPercent} showLabel={false} />
      </div>

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
            {item.completed ? (
              <CheckCircle
                size={20}
                className="flex-shrink-0 text-[var(--primitive-green-600)]"
                weight="fill"
              />
            ) : (
              <Circle size={20} className="flex-shrink-0 text-foreground-muted" weight="regular" />
            )}

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

            {!item.completed && (
              <CaretRight size={16} className="flex-shrink-0 text-foreground-muted" />
            )}
          </Link>
        ))}
      </div>
    </Card>
  );
}

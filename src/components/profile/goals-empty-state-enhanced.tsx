"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Target, Lightbulb, Users, ArrowRight } from "@phosphor-icons/react";
import { GoalsIllustration } from "@/components/profile/illustrations";
import { GOAL_CATEGORIES, type GoalCategoryKey } from "@/lib/profile/goal-categories";
import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

interface QuickStartGoal {
  id: string;
  title: string;
  description: string;
  category: GoalCategoryKey;
  taskCount: number;
  timeEstimate: string;
  popularity: number;
}

interface GoalsEmptyStateEnhancedProps {
  onCreateGoal: () => void;
  onBrowseTemplates: () => void;
  onSelectQuickStart: (goalId: string) => void;
}

// =============================================================================
// DATA
// =============================================================================

const QUICK_START_GOALS: QuickStartGoal[] = [
  {
    id: "job-search-organize",
    title: "Organize My Job Search",
    description: "Create a structured approach to finding opportunities",
    category: "ORGANIZATION",
    taskCount: 4,
    timeEstimate: "1 week",
    popularity: 89,
  },
  {
    id: "resume-refresh",
    title: "Update My Resume",
    description: "Polish your resume to stand out to employers",
    category: "ORGANIZATION",
    taskCount: 5,
    timeEstimate: "3-5 days",
    popularity: 94,
  },
  {
    id: "networking",
    title: "Expand My Network",
    description: "Connect with professionals in climate tech",
    category: "NETWORKING",
    taskCount: 5,
    timeEstimate: "2-3 weeks",
    popularity: 82,
  },
  {
    id: "interview-prep",
    title: "Prepare for Interviews",
    description: "Build confidence for upcoming interviews",
    category: "INTERVIEWING",
    taskCount: 4,
    timeEstimate: "1-2 weeks",
    popularity: 91,
  },
];

const SUCCESS_STAT = {
  percentage: 42,
  text: "Job seekers who set goals are 42% more likely to land interviews",
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function QuickStartCard({ goal, onSelect }: { goal: QuickStartGoal; onSelect: () => void }) {
  const cat = GOAL_CATEGORIES[goal.category];
  const IconComponent = cat.icon;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex flex-col items-start rounded-xl border p-4 text-left transition-all",
        "border-[var(--border-muted)] bg-[var(--background-default)]",
        "hover:border-[var(--border-brand)] hover:shadow-card",
        "focus:ring-[var(--ring-color)]/20 focus:border-[var(--border-brand)] focus:outline-none focus:ring-2"
      )}
    >
      <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-full", cat.bg)}>
        <IconComponent size={20} weight="fill" className={cat.text} />
      </div>
      <h4 className="mb-1 text-body-strong text-[var(--foreground-default)]">{goal.title}</h4>
      <p className="mb-3 text-caption text-[var(--foreground-muted)]">{goal.description}</p>
      <div className="flex items-center gap-3 text-caption text-[var(--foreground-subtle)]">
        <span>{goal.taskCount} tasks</span>
        <span>·</span>
        <span>{goal.timeEstimate}</span>
      </div>
    </button>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function GoalsEmptyStateEnhanced({
  onCreateGoal,
  onBrowseTemplates,
  onSelectQuickStart,
}: GoalsEmptyStateEnhancedProps) {
  const [showQuickStart, setShowQuickStart] = useState(true);

  return (
    <div className="py-8">
      {/* Hero section */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-6">
          <GoalsIllustration />
        </div>
        <h3 className="mb-2 text-heading-sm font-bold text-[var(--foreground-default)]">
          What are your goals?
        </h3>
        <p className="mb-4 max-w-md text-body text-[var(--foreground-muted)]">
          Set career goals and track your progress towards your dream climate job.
        </p>

        {/* Success stat */}
        <div className="mb-6 flex items-center gap-2 rounded-full bg-[var(--background-brand-subtle)] px-4 py-2">
          <Lightbulb size={16} weight="fill" className="text-[var(--foreground-brand)]" />
          <span className="text-caption text-[var(--foreground-brand)]">{SUCCESS_STAT.text}</span>
        </div>

        {/* Primary CTAs */}
        <div className="flex gap-3">
          <Button variant="primary" onClick={onCreateGoal}>
            Create a Goal
          </Button>
          <Button variant="outline" onClick={onBrowseTemplates}>
            Browse Templates
          </Button>
        </div>
      </div>

      {/* Quick start section */}
      {showQuickStart && (
        <div className="border-t border-[var(--border-muted)] pt-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={18} weight="fill" className="text-[var(--foreground-brand)]" />
              <h4 className="text-body-strong text-[var(--foreground-default)]">
                Quick start with a popular goal
              </h4>
            </div>
            <button
              onClick={() => setShowQuickStart(false)}
              className="text-caption text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
            >
              Hide
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {QUICK_START_GOALS.map((goal) => (
              <QuickStartCard
                key={goal.id}
                goal={goal}
                onSelect={() => onSelectQuickStart(goal.id)}
              />
            ))}
          </div>

          <div className="mt-4 text-center">
            <Button variant="link" rightIcon={<ArrowRight size={14} />} onClick={onBrowseTemplates}>
              View all templates
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightning, Lightbulb, X, ArrowRight, Target, CalendarBlank } from "@phosphor-icons/react";
import { GOAL_CATEGORIES, type GoalCategoryKey } from "@/lib/profile/goal-categories";
import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

type SuggestionPriority = "urgent" | "recommended" | "insight";

interface GoalSuggestion {
  id: string;
  priority: SuggestionPriority;
  title: string;
  description: string;
  category: GoalCategoryKey;
  reason: string;
  estimatedTime: string;
  templateId?: string;
}

interface GoalSuggestionsCardProps {
  suggestions: GoalSuggestion[];
  onAcceptSuggestion: (suggestion: GoalSuggestion) => void;
  onDismissSuggestion: (suggestionId: string) => void;
  onViewAllTemplates: () => void;
}

// =============================================================================
// CONFIG
// =============================================================================

const PRIORITY_CONFIG: Record<
  SuggestionPriority,
  { label: string; icon: React.ElementType; color: string; bg: string; border: string }
> = {
  urgent: {
    label: "Act Now",
    icon: Lightning,
    color: "text-[var(--primitive-red-600)]",
    bg: "bg-[var(--primitive-red-50)]",
    border: "border-l-[var(--primitive-red-500)]",
  },
  recommended: {
    label: "Recommended",
    icon: Target,
    color: "text-[var(--foreground-brand)]",
    bg: "bg-[var(--background-brand-subtle)]",
    border: "border-l-[var(--primitive-green-500)]",
  },
  insight: {
    label: "Based on your activity",
    icon: Lightbulb,
    color: "text-[var(--primitive-orange-600)]",
    bg: "bg-[var(--primitive-orange-50)]",
    border: "border-l-[var(--primitive-orange-500)]",
  },
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function SuggestionItem({
  suggestion,
  onAccept,
  onDismiss,
}: {
  suggestion: GoalSuggestion;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  const priority = PRIORITY_CONFIG[suggestion.priority];
  const PriorityIcon = priority.icon;
  const category = GOAL_CATEGORIES[suggestion.category];
  const CategoryIcon = category.icon;

  return (
    <div
      className={cn(
        "relative rounded-lg border-l-4 p-4 transition-all",
        priority.border,
        priority.bg
      )}
    >
      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="absolute right-2 top-2 rounded p-1 text-[var(--foreground-subtle)] hover:bg-[var(--background-muted)] hover:text-[var(--foreground-muted)]"
        aria-label="Dismiss suggestion"
      >
        <X size={14} />
      </button>

      {/* Priority badge */}
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-caption-sm font-medium",
            priority.color
          )}
        >
          <PriorityIcon size={12} weight="fill" />
          {priority.label}
        </span>
        <span className={cn("flex items-center gap-1 text-caption", category.text)}>
          <CategoryIcon size={12} weight="fill" />
          {category.label}
        </span>
      </div>

      {/* Content */}
      <h4 className="mb-1 pr-6 text-body-strong text-[var(--foreground-default)]">
        {suggestion.title}
      </h4>
      <p className="mb-2 text-caption text-[var(--foreground-muted)]">{suggestion.description}</p>

      {/* Reason & meta */}
      <div className="mb-3 flex items-center gap-3 text-caption text-[var(--foreground-subtle)]">
        <span className="italic">{suggestion.reason}</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <CalendarBlank size={12} />
          {suggestion.estimatedTime}
        </span>
      </div>

      {/* Action */}
      <Button variant="primary" size="sm" onClick={onAccept} rightIcon={<ArrowRight size={14} />}>
        Start This Goal
      </Button>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function GoalSuggestionsCard({
  suggestions,
  onAcceptSuggestion,
  onDismissSuggestion,
  onViewAllTemplates,
}: GoalSuggestionsCardProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visibleSuggestions = suggestions.filter((s) => !dismissed.has(s.id));

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(Array.from(prev).concat(id)));
    onDismissSuggestion(id);
  };

  if (visibleSuggestions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb size={20} weight="fill" className="text-[var(--primitive-yellow-500)]" />
            <h3 className="text-body-strong text-[var(--foreground-default)]">Suggested for You</h3>
          </div>
          <Button variant="link" onClick={onViewAllTemplates}>
            Browse all templates
          </Button>
        </div>

        <div className="space-y-3">
          {visibleSuggestions.slice(0, 3).map((suggestion) => (
            <SuggestionItem
              key={suggestion.id}
              suggestion={suggestion}
              onAccept={() => onAcceptSuggestion(suggestion)}
              onDismiss={() => handleDismiss(suggestion.id)}
            />
          ))}
        </div>

        {visibleSuggestions.length > 3 && (
          <p className="mt-3 text-center text-caption text-[var(--foreground-subtle)]">
            +{visibleSuggestions.length - 3} more suggestions
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// HELPER: Generate suggestions based on user context
// =============================================================================

export function generateGoalSuggestions(context: {
  hasGoals: boolean;
  goalCount: number;
  hasResume: boolean;
  applicationCount: number;
  interviewCount: number;
  daysSearching: number;
}): GoalSuggestion[] {
  const suggestions: GoalSuggestion[] = [];

  // New user - no goals
  if (!context.hasGoals) {
    suggestions.push({
      id: "first-goal",
      priority: "recommended",
      title: "Organize Your Job Search",
      description: "Create a structured approach to finding your dream climate job",
      category: "ORGANIZATION",
      reason: "Great first goal for new job seekers",
      estimatedTime: "1 week",
      templateId: "job-search-organize",
    });
  }

  // No resume uploaded
  if (!context.hasResume) {
    suggestions.push({
      id: "resume-goal",
      priority: "recommended",
      title: "Update Your Resume",
      description: "Polish your resume to stand out to climate employers",
      category: "ORGANIZATION",
      reason: "Required for most applications",
      estimatedTime: "3-5 days",
      templateId: "resume-refresh",
    });
  }

  // Applied but no interviews
  if (context.applicationCount > 5 && context.interviewCount === 0) {
    suggestions.push({
      id: "improve-apps",
      priority: "insight",
      title: "Improve Your Application Strategy",
      description: "Refine your approach to get more interview callbacks",
      category: "ORGANIZATION",
      reason: `${context.applicationCount} applications sent`,
      estimatedTime: "1-2 weeks",
      templateId: "resume-refresh",
    });
  }

  // Has interviews coming up
  if (context.interviewCount > 0) {
    suggestions.push({
      id: "interview-prep",
      priority: "urgent",
      title: "Prepare for Your Interviews",
      description: "Systematic preparation to ace your upcoming interviews",
      category: "INTERVIEWING",
      reason: `${context.interviewCount} interview(s) scheduled`,
      estimatedTime: "1-2 weeks",
      templateId: "interview-prep-behavioral",
    });
  }

  // Been searching a while - networking
  if (context.daysSearching > 14 && context.applicationCount > 0) {
    suggestions.push({
      id: "networking",
      priority: "insight",
      title: "Expand Your Network",
      description: "80% of jobs are filled through connections",
      category: "NETWORKING",
      reason: "Networking increases interview chances by 40%",
      estimatedTime: "2-3 weeks",
      templateId: "networking-expand",
    });
  }

  return suggestions;
}

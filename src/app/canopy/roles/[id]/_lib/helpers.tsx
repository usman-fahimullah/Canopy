import * as React from "react";
import { ListBullets, Circle, CheckSquare, Upload } from "@phosphor-icons/react";
import type { KanbanStageType } from "@/components/ui/kanban";

// ============================================
// HELPERS — Role Edit Page
// ============================================

/**
 * Returns a colored icon badge for a question type.
 * Used in both the sortable question list and the add-question dropdown.
 */
export function getQuestionIconWithBg(type: string): React.ReactNode {
  switch (type) {
    case "text":
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
          <ListBullets weight="regular" className="h-5 w-5 text-[var(--primitive-blue-500)]" />
        </div>
      );
    case "yes-no":
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-red-100)]">
          <Circle weight="regular" className="h-5 w-5 text-[var(--primitive-red-500)]" />
        </div>
      );
    case "multiple-choice":
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-yellow-100)]">
          <CheckSquare weight="regular" className="h-5 w-5 text-[var(--primitive-yellow-600)]" />
        </div>
      );
    case "file-upload":
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
          <Upload weight="regular" className="h-5 w-5 text-[var(--primitive-blue-500)]" />
        </div>
      );
    default:
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
          <ListBullets weight="regular" className="h-5 w-5 text-[var(--primitive-blue-500)]" />
        </div>
      );
  }
}

/** Map stage IDs to KanbanStageType for semantic icons */
export function mapStageToKanbanType(stageId: string): KanbanStageType {
  const mapping: Record<string, KanbanStageType> = {
    applied: "applied",
    screening: "screening",
    qualified: "qualified",
    interview: "interview",
    offer: "offer",
    hired: "hired",
    rejected: "rejected",
  };
  return mapping[stageId] || "applied";
}

/** Format relative time for application dates */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

/** Get badge variant for match score */
export function getMatchScoreBadgeVariant(score: number | null): "success" | "warning" | "neutral" {
  if (score === null) return "neutral";
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "neutral";
}

/** Get badge variant for application stage */
export function getStageBadgeVariant(
  stage: string
): "neutral" | "info" | "success" | "warning" | "error" {
  switch (stage) {
    case "applied":
      return "info";
    case "screening":
      return "info";
    case "interview":
      return "warning";
    case "offer":
      return "success";
    case "hired":
      return "success";
    case "rejected":
      return "error";
    default:
      return "neutral";
  }
}

/** Format stage name for display (capitalize first letter) */
export function formatStageName(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

/** Format years of experience to range string */
export function formatExperience(years: number | null): string {
  if (years === null) return "—";
  if (years < 3) return "0-2 years";
  if (years < 6) return "3-5 years";
  if (years < 11) return "5-10 years";
  return "10+ years";
}

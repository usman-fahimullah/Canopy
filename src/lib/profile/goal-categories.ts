import { Handshake, ChatCircle, FolderSimple, CurrencyCircleDollar } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

export type GoalCategoryKey = "NETWORKING" | "INTERVIEWING" | "ORGANIZATION" | "COMPENSATION";

export interface GoalCategoryConfig {
  label: string;
  icon: Icon;
  bg: string;
  tint: string;
  progress: string;
  text: string;
}

export const GOAL_CATEGORIES: Record<GoalCategoryKey, GoalCategoryConfig> = {
  NETWORKING: {
    label: "Networking",
    icon: Handshake,
    bg: "bg-[var(--primitive-blue-100)]",
    tint: "bg-[var(--primitive-blue-200)]",
    progress: "bg-[var(--primitive-blue-500)]",
    text: "text-[var(--primitive-blue-700)]",
  },
  INTERVIEWING: {
    label: "Interviewing",
    icon: ChatCircle,
    bg: "bg-[var(--primitive-orange-100)]",
    tint: "bg-[var(--primitive-orange-200)]",
    progress: "bg-[var(--primitive-orange-500)]",
    text: "text-[var(--primitive-orange-700)]",
  },
  ORGANIZATION: {
    label: "Organization",
    icon: FolderSimple,
    bg: "bg-[var(--primitive-purple-100)]",
    tint: "bg-[var(--primitive-purple-200)]",
    progress: "bg-[var(--primitive-purple-500)]",
    text: "text-[var(--primitive-purple-700)]",
  },
  COMPENSATION: {
    label: "Compensation",
    icon: CurrencyCircleDollar,
    bg: "bg-[var(--primitive-green-100)]",
    tint: "bg-[var(--primitive-green-200)]",
    progress: "bg-[var(--primitive-green-500)]",
    text: "text-[var(--primitive-green-700)]",
  },
};

export function getGoalCategory(category: string | null | undefined): GoalCategoryConfig {
  if (category && category in GOAL_CATEGORIES) {
    return GOAL_CATEGORIES[category as GoalCategoryKey];
  }
  return GOAL_CATEGORIES.NETWORKING;
}

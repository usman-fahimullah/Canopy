/**
 * Pipeline Stage Registry — UI / Visual Config
 *
 * Client-safe visual configuration for phase groups (icons, colors, classes).
 * This file imports Phosphor icon components and must only be used in
 * client components or "use client" files.
 *
 * For server-safe data/logic, import from `stage-registry.ts` instead.
 */

import type { ElementType } from "react";
import {
  PaperPlaneTilt,
  HourglassSimpleMedium,
  ChatCircleDots,
  SealCheck,
  Trophy,
  Prohibit,
  UsersThree,
  ArrowUUpLeft,
} from "@phosphor-icons/react";
import { getPhaseGroup, type PhaseGroup, type PhaseGroupColorKey } from "./stage-registry";

// Re-export types that consumers frequently need alongside visual config
export type { PhaseGroup, PhaseGroupColorKey } from "./stage-registry";

// ============================================
// PHASE GROUP VISUAL CONFIG
// ============================================

/**
 * Visual configuration for a phase group — shared by Kanban, StageBadge,
 * and job-application-table components.
 */
export interface PhaseGroupConfig {
  /** Phosphor icon component */
  icon: ElementType;
  /** Phosphor icon weight (default: "fill") */
  iconWeight: "fill" | "bold" | "regular";
  /** Color key from the primitive palette */
  colorKey: PhaseGroupColorKey;
  /** Seeker-facing label for this group (e.g., "Interviews") */
  seekerLabel: string;
  /** Tailwind class for kanban column icon color */
  kanbanColorClass: string;
  /** StageBadge background token class */
  badgeBg: string;
  badgeBgDark: string;
  /** StageBadge text token class */
  badgeText: string;
  badgeTextDark: string;
  /** StageBadge dot color class */
  badgeDot: string;
  /** Section icon color class (seeker side) */
  sectionIconColor: string;
  /** Empty state icon bg class (seeker side) */
  sectionIconBg: string;
  /** Stage color pill classes (seeker side) */
  pillBg: string;
  pillText: string;
  pillIconColor: string;
  pillHoverBorder: string;
  pillSelectedBg: string;
  pillSelectedText: string;
  pillIconBg: string;
}

const PHASE_GROUP_CONFIGS: Record<PhaseGroup, PhaseGroupConfig> = {
  applied: {
    icon: PaperPlaneTilt,
    iconWeight: "fill",
    colorKey: "purple",
    seekerLabel: "Applied",
    kanbanColorClass: "text-[var(--primitive-purple-500)]",
    badgeBg: "bg-[var(--primitive-purple-100)]",
    badgeBgDark: "dark:bg-[var(--primitive-purple-500)]/15",
    badgeText: "text-[var(--primitive-purple-700)]",
    badgeTextDark: "dark:text-[var(--primitive-purple-300)]",
    badgeDot: "bg-[var(--primitive-purple-500)]",
    sectionIconColor: "text-[var(--primitive-purple-500)]",
    sectionIconBg: "bg-[var(--primitive-purple-500)]",
    pillBg: "bg-[var(--primitive-purple-200)]",
    pillText: "text-[var(--primitive-purple-600)]",
    pillIconColor: "text-[var(--primitive-purple-600)]",
    pillHoverBorder: "border-[var(--primitive-purple-300)]",
    pillSelectedBg: "bg-[var(--primitive-purple-100)]",
    pillSelectedText: "text-[var(--primitive-purple-500)]",
    pillIconBg: "bg-[var(--primitive-purple-500)]",
  },
  review: {
    icon: HourglassSimpleMedium,
    iconWeight: "fill",
    colorKey: "blue",
    seekerLabel: "In Review",
    kanbanColorClass: "text-[var(--primitive-blue-500)]",
    badgeBg: "bg-[var(--primitive-blue-100)]",
    badgeBgDark: "dark:bg-[var(--primitive-blue-500)]/15",
    badgeText: "text-[var(--primitive-blue-700)]",
    badgeTextDark: "dark:text-[var(--primitive-blue-300)]",
    badgeDot: "bg-[var(--primitive-blue-500)]",
    sectionIconColor: "text-[var(--primitive-blue-500)]",
    sectionIconBg: "bg-[var(--primitive-blue-500)]",
    pillBg: "bg-[var(--primitive-blue-200)]",
    pillText: "text-[var(--primitive-blue-600)]",
    pillIconColor: "text-[var(--primitive-blue-600)]",
    pillHoverBorder: "border-[var(--primitive-blue-300)]",
    pillSelectedBg: "bg-[var(--primitive-blue-100)]",
    pillSelectedText: "text-[var(--primitive-blue-500)]",
    pillIconBg: "bg-[var(--primitive-blue-500)]",
  },
  interview: {
    icon: ChatCircleDots,
    iconWeight: "fill",
    colorKey: "orange",
    seekerLabel: "Interviews",
    kanbanColorClass: "text-[var(--primitive-orange-500)]",
    badgeBg: "bg-[var(--primitive-orange-100)]",
    badgeBgDark: "dark:bg-[var(--primitive-orange-500)]/15",
    badgeText: "text-[var(--primitive-orange-700)]",
    badgeTextDark: "dark:text-[var(--primitive-orange-300)]",
    badgeDot: "bg-[var(--primitive-orange-500)]",
    sectionIconColor: "text-[var(--primitive-orange-500)]",
    sectionIconBg: "bg-[var(--primitive-orange-500)]",
    pillBg: "bg-[var(--primitive-orange-200)]",
    pillText: "text-[var(--primitive-orange-600)]",
    pillIconColor: "text-[var(--primitive-orange-600)]",
    pillHoverBorder: "border-[var(--primitive-orange-300)]",
    pillSelectedBg: "bg-[var(--primitive-orange-100)]",
    pillSelectedText: "text-[var(--primitive-orange-500)]",
    pillIconBg: "bg-[var(--primitive-orange-500)]",
  },
  offer: {
    icon: SealCheck,
    iconWeight: "fill",
    colorKey: "green",
    seekerLabel: "Offers",
    kanbanColorClass: "text-[var(--primitive-green-500)]",
    badgeBg: "bg-[var(--primitive-green-100)]",
    badgeBgDark: "dark:bg-[var(--primitive-green-500)]/15",
    badgeText: "text-[var(--primitive-green-700)]",
    badgeTextDark: "dark:text-[var(--primitive-green-300)]",
    badgeDot: "bg-[var(--primitive-green-500)]",
    sectionIconColor: "text-[var(--primitive-green-500)]",
    sectionIconBg: "bg-[var(--primitive-green-500)]",
    pillBg: "bg-[var(--primitive-green-200)]",
    pillText: "text-[var(--primitive-green-600)]",
    pillIconColor: "text-[var(--primitive-green-600)]",
    pillHoverBorder: "border-[var(--primitive-green-300)]",
    pillSelectedBg: "bg-[var(--primitive-green-100)]",
    pillSelectedText: "text-[var(--primitive-green-500)]",
    pillIconBg: "bg-[var(--primitive-green-500)]",
  },
  hired: {
    icon: Trophy,
    iconWeight: "fill",
    colorKey: "green",
    seekerLabel: "Hired",
    kanbanColorClass: "text-[var(--primitive-green-600)]",
    badgeBg: "bg-[var(--primitive-green-100)]",
    badgeBgDark: "dark:bg-[var(--primitive-green-500)]/15",
    badgeText: "text-[var(--primitive-green-700)]",
    badgeTextDark: "dark:text-[var(--primitive-green-300)]",
    badgeDot: "bg-[var(--primitive-green-600)]",
    sectionIconColor: "text-[var(--primitive-green-500)]",
    sectionIconBg: "bg-[var(--primitive-green-500)]",
    pillBg: "bg-[var(--primitive-green-200)]",
    pillText: "text-[var(--primitive-green-600)]",
    pillIconColor: "text-[var(--primitive-green-600)]",
    pillHoverBorder: "border-[var(--primitive-green-300)]",
    pillSelectedBg: "bg-[var(--primitive-green-100)]",
    pillSelectedText: "text-[var(--primitive-green-500)]",
    pillIconBg: "bg-[var(--primitive-green-500)]",
  },
  rejected: {
    icon: Prohibit,
    iconWeight: "bold",
    colorKey: "red",
    seekerLabel: "Ineligible",
    kanbanColorClass: "text-[var(--primitive-red-500)]",
    badgeBg: "bg-[var(--primitive-red-100)]",
    badgeBgDark: "dark:bg-[var(--primitive-red-500)]/15",
    badgeText: "text-[var(--primitive-red-700)]",
    badgeTextDark: "dark:text-[var(--primitive-red-300)]",
    badgeDot: "bg-[var(--primitive-red-500)]",
    sectionIconColor: "text-[var(--primitive-red-500)]",
    sectionIconBg: "bg-[var(--primitive-red-500)]",
    pillBg: "bg-[var(--primitive-red-200)]",
    pillText: "text-[var(--primitive-red-600)]",
    pillIconColor: "text-[var(--primitive-red-600)]",
    pillHoverBorder: "border-[var(--primitive-red-300)]",
    pillSelectedBg: "bg-[var(--primitive-red-100)]",
    pillSelectedText: "text-[var(--primitive-red-500)]",
    pillIconBg: "bg-[var(--primitive-red-500)]",
  },
  withdrawn: {
    icon: ArrowUUpLeft,
    iconWeight: "bold",
    colorKey: "neutral",
    seekerLabel: "Ineligible",
    kanbanColorClass: "text-[var(--foreground-muted)]",
    badgeBg: "bg-background-muted",
    badgeBgDark: "",
    badgeText: "text-foreground-muted",
    badgeTextDark: "",
    badgeDot: "bg-border-emphasis",
    sectionIconColor: "text-[var(--foreground-muted)]",
    sectionIconBg: "bg-[var(--foreground-muted)]",
    pillBg: "bg-[var(--primitive-neutral-200)]",
    pillText: "text-[var(--primitive-neutral-600)]",
    pillIconColor: "text-[var(--primitive-neutral-600)]",
    pillHoverBorder: "border-[var(--primitive-neutral-300)]",
    pillSelectedBg: "bg-[var(--primitive-neutral-100)]",
    pillSelectedText: "text-[var(--primitive-neutral-500)]",
    pillIconBg: "bg-[var(--primitive-neutral-500)]",
  },
  "talent-pool": {
    icon: UsersThree,
    iconWeight: "bold",
    colorKey: "yellow",
    seekerLabel: "Talent Pool",
    kanbanColorClass: "text-[var(--primitive-yellow-500)]",
    badgeBg: "bg-[var(--primitive-yellow-100)]",
    badgeBgDark: "dark:bg-[var(--primitive-yellow-500)]/15",
    badgeText: "text-[var(--primitive-yellow-700)]",
    badgeTextDark: "dark:text-[var(--primitive-yellow-300)]",
    badgeDot: "bg-[var(--primitive-yellow-500)]",
    sectionIconColor: "text-[var(--primitive-yellow-600)]",
    sectionIconBg: "bg-[var(--primitive-yellow-500)]",
    pillBg: "bg-[var(--primitive-yellow-200)]",
    pillText: "text-[var(--primitive-yellow-600)]",
    pillIconColor: "text-[var(--primitive-yellow-600)]",
    pillHoverBorder: "border-[var(--primitive-yellow-300)]",
    pillSelectedBg: "bg-[var(--primitive-yellow-100)]",
    pillSelectedText: "text-[var(--primitive-yellow-500)]",
    pillIconBg: "bg-[var(--primitive-yellow-500)]",
  },
};

// ============================================
// PUBLIC API
// ============================================

/**
 * Get visual configuration for a phase group.
 * Client-only — imports Phosphor icon components.
 */
export function getPhaseGroupConfig(group: PhaseGroup): PhaseGroupConfig {
  return PHASE_GROUP_CONFIGS[group];
}

/**
 * Get visual configuration for a specific stage (by looking up its phase group).
 * Client-only — imports Phosphor icon components.
 */
export function getStageVisualConfig(stageId: string): PhaseGroupConfig {
  const group = getPhaseGroup(stageId);
  return PHASE_GROUP_CONFIGS[group];
}

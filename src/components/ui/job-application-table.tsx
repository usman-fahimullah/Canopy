"use client";

/**
 * JobApplicationTable - Collapsible table for tracking job applications
 *
 * @figma https://www.figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System?node-id=4643-18073
 *
 * This component is designed for the job seeker portal (Green Jobs Board)
 * to help candidates track their applications across different pipeline stages.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CaretDown,
  CaretRight,
  Bookmark,
  Star,
  SmileyNervous,
  SmileyWink,
  Smiley,
  SmileyMeh,
  SmileySad,
  SmileyXEyes,
  Check,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { getPhaseGroupConfig, type PhaseGroup } from "@/lib/pipeline/stage-registry-ui";
import { Avatar } from "./avatar";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

// ============================================
// TYPES
// ============================================

export type ApplicationSection =
  | "saved"
  | "applied"
  | "interview"
  | "offer"
  | "hired"
  | "ineligible";

export type EmojiReaction = "excited" | "happy" | "meh" | "nervous" | "shocked" | "none";

export interface PhaseProgress {
  current: number;
  total: number;
  stages: string[];
}

export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  companyInitials?: string;
  companyLogo?: string;
  stage: ApplicationSection;
  /** Employer's actual stage name (e.g., "Phone Screen") */
  stageName?: string;
  /** Phase progress within the current seeker section */
  phaseProgress?: PhaseProgress;
  activity: Date | string;
  reaction?: EmojiReaction;
  isFavorite?: boolean;
}

export interface JobApplicationTableProps {
  section: ApplicationSection;
  applications: JobApplication[];
  isOpen?: boolean;
  onToggle?: () => void;
  onStageChange?: (applicationId: string, newStage: ApplicationSection) => void;
  onReactionChange?: (applicationId: string, reaction: EmojiReaction) => void;
  onFavoriteToggle?: (applicationId: string) => void;
  onRowClick?: (applicationId: string) => void;
  onExploreJobs?: () => void;
  className?: string;
}

// ============================================
// SECTION CONFIG (derived from pipeline stage registry)
// ============================================

interface SectionConfig {
  label: string;
  icon: React.ElementType;
  iconWeight: "fill" | "bold" | "regular";
  iconColor: string;
  emptyIconBg: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyCta: string;
}

/**
 * Map ApplicationSection → PhaseGroup for registry lookups.
 * "saved" has no phase group equivalent — uses Bookmark icon with blue color.
 * "ineligible" maps to "rejected".
 */
const SECTION_TO_PHASE: Record<ApplicationSection, PhaseGroup | null> = {
  saved: null, // No phase group — "saved" is seeker-only
  applied: "applied",
  interview: "interview",
  offer: "offer",
  hired: "hired",
  ineligible: "rejected",
};

/** Section-specific labels and empty states */
const SECTION_META: Record<
  ApplicationSection,
  { label: string; emptyTitle: string; emptyDescription: string; emptyCta: string }
> = {
  saved: {
    label: "Saved",
    emptyTitle: "No saved jobs yet!",
    emptyDescription:
      "Discover and find hundreds of jobs in Pathways! Save it and don't forget it!",
    emptyCta: "Explore Jobs",
  },
  applied: {
    label: "Applied",
    emptyTitle: "No applied jobs yet!",
    emptyDescription:
      "When you apply for a job make sure to migrate your saved job to this section",
    emptyCta: "",
  },
  interview: {
    label: "Interviews",
    emptyTitle: "No interviews here yet!",
    emptyDescription: "When have a job interview make sure to migrate it to this section",
    emptyCta: "",
  },
  offer: {
    label: "Offers",
    emptyTitle: "No offers yet!",
    emptyDescription: "When have an offer make sure to migrate it to this section",
    emptyCta: "",
  },
  hired: {
    label: "Hired",
    emptyTitle: "No hired positions yet!",
    emptyDescription: "When you accept an offer, it will appear here.",
    emptyCta: "",
  },
  ineligible: {
    label: "Ineligible",
    emptyTitle: "No ineligible applications!",
    emptyDescription: "Applications that didn't proceed will show up here.",
    emptyCta: "",
  },
};

/** Build sectionConfig by deriving icons/colors from the pipeline registry */
export const sectionConfig: Record<ApplicationSection, SectionConfig> = Object.fromEntries(
  (Object.keys(SECTION_TO_PHASE) as ApplicationSection[]).map((section) => {
    const phase = SECTION_TO_PHASE[section];
    const meta = SECTION_META[section];

    if (phase) {
      const phaseConfig = getPhaseGroupConfig(phase);
      return [
        section,
        {
          ...meta,
          icon: phaseConfig.icon,
          iconWeight: phaseConfig.iconWeight,
          iconColor: phaseConfig.sectionIconColor,
          emptyIconBg: phaseConfig.sectionIconBg,
        },
      ];
    }

    // "saved" — seeker-only section, uses Bookmark icon with blue
    return [
      section,
      {
        ...meta,
        icon: Bookmark,
        iconWeight: "fill" as const,
        iconColor: "text-[var(--primitive-blue-500)]",
        emptyIconBg: "bg-[var(--primitive-blue-500)]",
      },
    ];
  })
) as Record<ApplicationSection, SectionConfig>;

// ============================================
// STAGE COLORS (for dropdown pills)
// Based on Figma: node-id=3145-16691 (MigrateToFilterPill)
// Derived from the pipeline stage registry where possible.
// ============================================

export const stageColors: Record<
  ApplicationSection,
  {
    bg: string;
    text: string;
    iconColor: string;
    hoverBorder: string;
    selectedBg: string;
    selectedText: string;
    iconBg: string;
  }
> = Object.fromEntries(
  (Object.keys(SECTION_TO_PHASE) as ApplicationSection[]).map((section) => {
    const phase = SECTION_TO_PHASE[section];

    // "hired" has a special gradient treatment that can't come from the registry
    if (section === "hired") {
      return [
        section,
        {
          bg: "bg-[var(--primitive-neutral-100)]",
          text: "text-[var(--primitive-green-800)]",
          iconColor: "text-[var(--primitive-green-800)]",
          hoverBorder: "border-[var(--primitive-neutral-300)]",
          selectedBg:
            "bg-gradient-to-r from-[var(--primitive-red-200)] via-[var(--primitive-yellow-200)] to-[var(--primitive-green-200)]",
          selectedText: "text-[var(--primitive-green-800)]",
          iconBg:
            "bg-gradient-to-br from-[var(--primitive-red-400)] via-[var(--primitive-yellow-400)] to-[var(--primitive-green-400)]",
        },
      ];
    }

    // "saved" uses blue from registry lookup (no phase group)
    if (!phase) {
      const blueConfig = getPhaseGroupConfig("review"); // blue color family
      return [
        section,
        {
          bg: blueConfig.pillBg,
          text: blueConfig.pillText,
          iconColor: blueConfig.pillIconColor,
          hoverBorder: blueConfig.pillHoverBorder,
          selectedBg: blueConfig.pillSelectedBg,
          selectedText: blueConfig.pillSelectedText,
          iconBg: blueConfig.pillIconBg,
        },
      ];
    }

    // All other sections derive from their phase group
    const phaseConfig = getPhaseGroupConfig(phase);
    return [
      section,
      {
        bg: phaseConfig.pillBg,
        text: phaseConfig.pillText,
        iconColor: phaseConfig.pillIconColor,
        hoverBorder: phaseConfig.pillHoverBorder,
        selectedBg: phaseConfig.pillSelectedBg,
        selectedText: phaseConfig.pillSelectedText,
        iconBg: phaseConfig.pillIconBg,
      },
    ];
  })
) as Record<
  ApplicationSection,
  {
    bg: string;
    text: string;
    iconColor: string;
    hoverBorder: string;
    selectedBg: string;
    selectedText: string;
    iconBg: string;
  }
>;

// Stage order for determining past/future states in dropdown
export const stageOrder: ApplicationSection[] = [
  "saved",
  "applied",
  "interview",
  "offer",
  "hired",
  "ineligible",
];

// ============================================
// EMOJI CONFIG
// ============================================

export const emojiConfig: Record<
  Exclude<EmojiReaction, "none">,
  { icon: React.ElementType; label: string }
> = {
  excited: { icon: SmileyWink, label: "Excited" },
  happy: { icon: Smiley, label: "Happy" },
  meh: { icon: SmileyMeh, label: "Meh" },
  nervous: { icon: SmileyNervous, label: "Nervous" },
  shocked: { icon: SmileyXEyes, label: "Shocked" },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatActivityTime(activity: Date | string): string {
  const date = typeof activity === "string" ? new Date(activity) : activity;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}mins ago`;
  if (diffHours === 1) return "An hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "Last week";

  return date.toLocaleDateString();
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ============================================
// SUB-COMPONENTS
// ============================================

/** Section Header */
interface SectionHeaderProps {
  section: ApplicationSection;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
}

function SectionHeader({ section, count, isOpen, onToggle }: SectionHeaderProps) {
  const config = sectionConfig[section];
  const Icon = config.icon;
  const CaretIcon = isOpen ? CaretDown : CaretRight;

  return (
    <div className="flex items-center gap-3 bg-[var(--primitive-neutral-0)] px-3 pb-2 pt-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-center rounded-[var(--radius-md)] p-2.5 transition-colors hover:bg-[var(--background-interactive-hover)]"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Collapse section" : "Expand section"}
      >
        <CaretIcon size={18} weight="bold" className="text-[var(--primitive-green-800)]" />
      </button>
      <div className="flex items-center gap-2.5">
        <Icon size={24} weight={config.iconWeight} className={config.iconColor} />
        <span className="text-body-strong text-[var(--primitive-neutral-800)]">{config.label}</span>
        <div className="flex items-center rounded bg-[var(--primitive-neutral-200)] px-0.5">
          <span className="w-5 text-center text-caption-strong text-[var(--primitive-neutral-800)]">
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Table Header Row */
interface TableHeaderRowProps {
  onSort?: (column: string, direction: "asc" | "desc") => void;
}

function TableHeaderRow({ onSort }: TableHeaderRowProps) {
  const sortableColumns = ["jobTitle", "company", "activity"];

  const renderSortButton = (label: string, column: string, width?: string) => {
    const isSortable = sortableColumns.includes(column);

    return (
      <div
        className={cn(
          "flex items-center justify-between border-r border-[var(--primitive-neutral-300)] px-3 py-1",
          width || "flex-1"
        )}
      >
        <span className="flex-1 truncate text-caption text-[var(--primitive-neutral-900)]">
          {label}
        </span>
        {isSortable && (
          <button
            onClick={() => onSort?.(column, "asc")}
            className="rounded-full p-2 transition-colors hover:bg-[var(--background-interactive-hover)]"
          >
            <CaretDown size={24} className="text-[var(--primitive-neutral-800)]" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="hidden items-center border-b border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-0)] pb-2 md:flex">
      {renderSortButton("Job Title", "jobTitle", "w-[250px] pl-6")}
      {renderSortButton("Company", "company", "w-[250px]")}
      <div className="flex flex-1 items-center border-r border-[var(--primitive-neutral-300)] px-3 py-1">
        <span className="flex-1 truncate text-caption text-[var(--primitive-neutral-900)]">
          Stage
        </span>
      </div>
      {renderSortButton("Activity", "activity")}
      <div className="flex flex-1 items-center justify-center px-3 py-1">
        <span className="flex-1 truncate text-center text-caption text-[var(--primitive-neutral-900)]">
          Reaction
        </span>
      </div>
    </div>
  );
}

/** Stage Dropdown Pill
 * @figma https://www.figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System?node-id=3145-16691
 * @figma https://www.figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System?node-id=4663-4359
 *
 * Features:
 * - Stage-colored pill with hover border effect
 * - Dropdown with "Migrate to:" header
 * - List items show Past/Selected/Default states based on pipeline position
 */
interface StagePillProps {
  currentStage: ApplicationSection;
  onStageChange?: (newStage: ApplicationSection) => void;
}

/** Determine the visual state of a stage option in the dropdown */
export type StageItemState = "past" | "selected" | "default";

export function getStageItemState(
  optionStage: ApplicationSection,
  currentStage: ApplicationSection
): StageItemState {
  const currentIndex = stageOrder.indexOf(currentStage);
  const optionIndex = stageOrder.indexOf(optionStage);

  if (optionStage === currentStage) return "selected";
  if (optionIndex < currentIndex) return "past";
  return "default";
}

function StagePill({ currentStage, onStageChange }: StagePillProps) {
  const colors = stageColors[currentStage];
  const config = sectionConfig[currentStage];

  // Map stage to hover border color CSS variable
  const hoverBorderColorVar: Record<ApplicationSection, string> = {
    saved: "var(--primitive-blue-300)",
    applied: "var(--primitive-purple-300)",
    interview: "var(--primitive-orange-300)",
    offer: "var(--primitive-green-300)",
    hired: "var(--primitive-neutral-300)",
    ineligible: "var(--primitive-red-300)",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-[140px] items-center justify-between gap-2 rounded-lg border-2 border-transparent p-2 transition-all",
            colors.bg,
            "cursor-pointer"
          )}
          style={
            {
              "--hover-border-color": hoverBorderColorVar[currentStage],
            } as React.CSSProperties
          }
          // Using a hover style via inline CSS custom property
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = hoverBorderColorVar[currentStage];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <span className={cn("text-caption-strong", colors.text)}>{config.label}</span>
          <CaretDown size={24} className={colors.iconColor} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[198px] p-4 shadow-[2px_4px_16px_rgba(31,29,28,0.12)]"
      >
        {/* Header */}
        <div className="mb-2 px-2 text-caption text-[var(--primitive-neutral-600)]">
          Migrate to:
        </div>

        {/* Stage options with visual state progression */}
        <div className="flex flex-col gap-2">
          {stageOrder.map((stage) => {
            const stageConfig = sectionConfig[stage];
            const stageColorConfig = stageColors[stage];
            const itemState = getStageItemState(stage, currentStage);

            return (
              <button
                key={stage}
                onClick={() => onStageChange?.(stage)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors",
                  // Background based on state
                  itemState === "selected" && stageColorConfig.selectedBg,
                  itemState === "past" && "bg-[var(--primitive-neutral-100)]",
                  itemState === "default" &&
                    "bg-[var(--primitive-neutral-0)] hover:bg-[var(--background-interactive-hover)]"
                )}
              >
                {/* Icon box */}
                <div
                  className={cn(
                    "flex size-6 items-center justify-center rounded",
                    // Icon background based on state
                    itemState === "selected" && stageColorConfig.iconBg,
                    itemState === "past" &&
                      "border border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-0)]",
                    itemState === "default" &&
                      "border border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-0)]"
                  )}
                >
                  {itemState === "selected" ? (
                    <Check size={16} weight="bold" className="text-white" />
                  ) : itemState === "past" ? (
                    <Check
                      size={16}
                      weight="bold"
                      className="text-[var(--primitive-neutral-300)]"
                    />
                  ) : null}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-caption-strong",
                    itemState === "selected" && stageColorConfig.selectedText,
                    itemState === "past" && "text-[var(--primitive-neutral-500)]",
                    itemState === "default" && "text-[var(--primitive-green-800)]"
                  )}
                >
                  {stageConfig.label}
                </span>
              </button>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Emoji Reaction Button */
interface EmojiReactionButtonProps {
  reaction?: EmojiReaction;
  onReactionChange?: (reaction: EmojiReaction) => void;
}

function EmojiReactionButton({ reaction = "none", onReactionChange }: EmojiReactionButtonProps) {
  const currentEmoji = reaction !== "none" ? emojiConfig[reaction] : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-[100px] items-center justify-center gap-1 rounded-full border border-[var(--primitive-neutral-300)] px-2 py-1",
            "cursor-pointer transition-colors hover:bg-[var(--background-interactive-hover)]"
          )}
        >
          {currentEmoji ? (
            <>
              <currentEmoji.icon
                size={16}
                weight="fill"
                className="text-[var(--primitive-purple-500)]"
              />
              <span className="text-caption-strong text-[var(--primitive-purple-500)]">
                {currentEmoji.label}
              </span>
            </>
          ) : (
            <span className="text-caption text-[var(--primitive-neutral-600)]">Add</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[140px]">
        {(
          Object.entries(emojiConfig) as [
            Exclude<EmojiReaction, "none">,
            typeof emojiConfig.excited,
          ][]
        ).map(([key, config]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onReactionChange?.(key as EmojiReaction)}
            className={cn(key === reaction && "bg-[var(--primitive-purple-100)]")}
          >
            <config.icon
              size={16}
              weight="fill"
              className="mr-2 text-[var(--primitive-purple-500)]"
            />
            {config.label}
          </DropdownMenuItem>
        ))}
        {reaction !== "none" && (
          <DropdownMenuItem
            onClick={() => onReactionChange?.("none")}
            className="text-[var(--primitive-neutral-600)]"
          >
            Remove
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Table Row */
interface TableRowProps {
  application: JobApplication;
  onStageChange?: (applicationId: string, newStage: ApplicationSection) => void;
  onReactionChange?: (applicationId: string, reaction: EmojiReaction) => void;
  onFavoriteToggle?: (applicationId: string) => void;
  onRowClick?: (applicationId: string) => void;
}

function TableRow({
  application,
  onStageChange,
  onReactionChange,
  onFavoriteToggle,
  onRowClick,
}: TableRowProps) {
  const rowInteraction = onRowClick
    ? {
        onClick: () => onRowClick(application.id),
        role: "button" as const,
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onRowClick(application.id);
          }
        },
      }
    : {};

  return (
    <>
      {/* ── Mobile Card Layout (below md) ── */}
      <div
        className={cn(
          "flex flex-col gap-3 border-b border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-0)] p-4 md:hidden",
          onRowClick &&
            "cursor-pointer transition-colors hover:bg-[var(--background-interactive-hover)]"
        )}
        {...rowInteraction}
      >
        {/* Top row: star + avatar + title */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle?.(application.id);
            }}
            className="shrink-0 transition-colors"
            aria-label={application.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              size={20}
              weight={application.isFavorite ? "fill" : "regular"}
              className={
                application.isFavorite
                  ? "text-[var(--primitive-yellow-500)]"
                  : "text-[var(--primitive-neutral-200)]"
              }
            />
          </button>
          <Avatar
            name={application.company}
            src={application.companyLogo}
            size="sm"
            className="shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="block truncate text-caption text-[var(--primitive-neutral-800)]">
              {application.jobTitle}
            </span>
            <span className="block truncate text-caption-sm text-[var(--primitive-neutral-600)]">
              {application.company}
            </span>
          </div>
        </div>

        {/* Bottom row: stage pill + activity time */}
        <div className="flex items-center justify-between gap-3 pl-8">
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div onClick={(e) => e.stopPropagation()}>
            <StagePill
              currentStage={application.stage}
              onStageChange={(stage) => onStageChange?.(application.id, stage)}
            />
          </div>
          <span className="shrink-0 text-caption text-[var(--primitive-neutral-600)]">
            {formatActivityTime(application.activity)}
          </span>
        </div>
      </div>

      {/* ── Desktop Table Row (md and above) ── */}
      <div
        className={cn(
          "hidden h-[80px] items-center border-b border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-0)] md:flex",
          onRowClick &&
            "cursor-pointer transition-colors hover:bg-[var(--background-interactive-hover)]"
        )}
        {...rowInteraction}
      >
        {/* Job Title Cell */}
        <div className="flex w-[250px] items-center gap-3 overflow-hidden py-6 pl-6 pr-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle?.(application.id);
            }}
            className="shrink-0 transition-colors"
            aria-label={application.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              size={24}
              weight={application.isFavorite ? "fill" : "regular"}
              className={
                application.isFavorite
                  ? "text-[var(--primitive-yellow-500)]"
                  : "text-[var(--primitive-neutral-200)]"
              }
            />
          </button>
          <Avatar
            name={application.company}
            src={application.companyLogo}
            size="sm"
            className="shrink-0"
          />
          <span className="truncate text-caption text-[var(--primitive-neutral-800)]">
            {application.jobTitle}
          </span>
        </div>

        {/* Company Cell */}
        <div className="flex h-[80px] w-[250px] items-center px-3 py-6">
          <div className="min-w-0 flex-1">
            <span className="block truncate text-caption text-[var(--primitive-neutral-600)]">
              {application.company}
            </span>
            {application.stageName && (
              <span className="block truncate text-caption-sm text-[var(--primitive-neutral-500)]">
                {application.stageName}
                {application.phaseProgress && application.phaseProgress.total > 1 && (
                  <>
                    {" "}
                    &middot; Step {application.phaseProgress.current} of{" "}
                    {application.phaseProgress.total}
                  </>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Stage Cell */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div className="relative h-[80px] min-w-0 flex-1 px-3" onClick={(e) => e.stopPropagation()}>
          <div className="absolute left-3 top-5">
            <StagePill
              currentStage={application.stage}
              onStageChange={(stage) => onStageChange?.(application.id, stage)}
            />
          </div>
        </div>

        {/* Activity Cell */}
        <div className="flex h-[80px] min-w-0 flex-1 items-center px-3 py-6">
          <span className="w-full truncate text-center text-caption text-[var(--primitive-neutral-600)]">
            {formatActivityTime(application.activity)}
          </span>
        </div>

        {/* Reaction Cell */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className="flex h-[80px] min-w-0 flex-1 items-center justify-center py-6"
          onClick={(e) => e.stopPropagation()}
        >
          <EmojiReactionButton
            reaction={application.reaction}
            onReactionChange={(reaction) => onReactionChange?.(application.id, reaction)}
          />
        </div>
      </div>
    </>
  );
}

/** Empty State */
interface EmptyStateProps {
  section: ApplicationSection;
  onAction?: () => void;
}

function EmptyState({ section, onAction }: EmptyStateProps) {
  const config = sectionConfig[section];
  const Icon = config.icon;

  return (
    <div className="flex h-[204px] flex-col items-center justify-center gap-4 overflow-hidden p-6">
      <div className={cn("flex size-6 items-center justify-center rounded", config.emptyIconBg)}>
        <Icon size={18} weight={config.iconWeight} className="text-white" />
      </div>
      <div className="flex w-full max-w-[492px] flex-col items-center justify-center">
        <span className="text-body-strong text-[var(--primitive-neutral-900)]">
          {config.emptyTitle}
        </span>
        <p className="w-full max-w-[300px] text-center text-caption text-[var(--primitive-neutral-600)]">
          {config.emptyDescription}
        </p>
      </div>
      {section === "saved" && config.emptyCta && (
        <Button variant="tertiary" size="default" className="rounded-full" onClick={onAction}>
          {config.emptyCta}
        </Button>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function JobApplicationTable({
  section,
  applications,
  isOpen = true,
  onToggle,
  onStageChange,
  onReactionChange,
  onFavoriteToggle,
  onRowClick,
  onExploreJobs,
  className,
}: JobApplicationTableProps) {
  const [internalOpen, setInternalOpen] = React.useState(isOpen);
  const isControlled = onToggle !== undefined;
  const open = isControlled ? isOpen : internalOpen;

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  const filteredApplications = applications.filter((app) => app.stage === section);
  const isEmpty = filteredApplications.length === 0;

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)]",
        className
      )}
    >
      <SectionHeader
        section={section}
        count={filteredApplications.length}
        isOpen={open}
        onToggle={handleToggle}
      />

      {open && (
        <>
          {isEmpty ? (
            <EmptyState section={section} onAction={onExploreJobs} />
          ) : (
            <>
              <TableHeaderRow />
              {filteredApplications.map((application) => (
                <TableRow
                  key={application.id}
                  application={application}
                  onStageChange={onStageChange}
                  onReactionChange={onReactionChange}
                  onFavoriteToggle={onFavoriteToggle}
                  onRowClick={onRowClick}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

// ============================================
// COMPOSITE COMPONENT: ApplicationTracker
// ============================================

export interface ApplicationTrackerProps {
  applications: JobApplication[];
  onStageChange?: (applicationId: string, newStage: ApplicationSection) => void;
  onReactionChange?: (applicationId: string, reaction: EmojiReaction) => void;
  onFavoriteToggle?: (applicationId: string) => void;
  onRowClick?: (applicationId: string) => void;
  onExploreJobs?: () => void;
  defaultOpenSections?: ApplicationSection[];
  className?: string;
}

/**
 * ApplicationTracker - Full application tracking dashboard
 *
 * Renders all sections (Saved, Applied, Interview, Offer, Hired, Ineligible)
 * with their respective applications.
 */
export function ApplicationTracker({
  applications,
  onStageChange,
  onReactionChange,
  onFavoriteToggle,
  onRowClick,
  onExploreJobs,
  defaultOpenSections = ["saved", "applied", "interview"],
  className,
}: ApplicationTrackerProps) {
  const [openSections, setOpenSections] = React.useState<Set<ApplicationSection>>(
    new Set(defaultOpenSections)
  );

  const toggleSection = (section: ApplicationSection) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const sections: ApplicationSection[] = [
    "saved",
    "applied",
    "interview",
    "offer",
    "hired",
    "ineligible",
  ];

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {sections.map((section) => (
        <JobApplicationTable
          key={section}
          section={section}
          applications={applications}
          isOpen={openSections.has(section)}
          onToggle={() => toggleSection(section)}
          onStageChange={onStageChange}
          onReactionChange={onReactionChange}
          onFavoriteToggle={onFavoriteToggle}
          onRowClick={onRowClick}
          onExploreJobs={onExploreJobs}
        />
      ))}
    </div>
  );
}

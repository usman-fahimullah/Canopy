"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BookmarkSimple } from "@phosphor-icons/react";
import { Avatar } from "./avatar";

/**
 * JobNoteCard component based on Trails Design System
 * Figma: Node 1633:10882
 *
 * Displays career guidance/advice cards with colorful backgrounds
 * representing different note types (Building Paths, Prep Talk, etc.)
 *
 * Figma Specs:
 * - Sizes: Default (350x416), Medium (350x200), Skinny (350x124), Small (171x200)
 * - Border radius: 12px
 * - Padding: 24px (large) for Default, 16px (medium) for others
 * - Tag: 8px radius, bold 14px text, white on colored bg
 * - Title: 48px (Default), 24px (others) medium weight
 * - Author: 32px avatar, 14px text
 */

/** Note type determines the background color */
export type JobNoteType =
  | "building-paths"
  | "prep-talk"
  | "the-search"
  | "write-your-story"
  | "skill-building"
  | "growth-mindset";

/** Color configuration for each note type */
const noteTypeConfig: Record<JobNoteType, { bg: string; tagBg: string; label: string }> = {
  "building-paths": {
    bg: "bg-[var(--primitive-green-200)]",
    tagBg: "bg-[var(--primitive-green-500)]",
    label: "Building Paths",
  },
  "prep-talk": {
    bg: "bg-[var(--primitive-red-200)]",
    tagBg: "bg-[var(--primitive-red-500)]",
    label: "Prep Talk",
  },
  "the-search": {
    bg: "bg-[var(--primitive-blue-200)]",
    tagBg: "bg-[var(--primitive-blue-500)]",
    label: "The Search",
  },
  "write-your-story": {
    bg: "bg-[var(--primitive-purple-200)]",
    tagBg: "bg-[var(--primitive-purple-500)]",
    label: "Write Your Story",
  },
  "skill-building": {
    bg: "bg-[var(--primitive-orange-200)]",
    tagBg: "bg-[var(--primitive-orange-500)]",
    label: "Skill Building",
  },
  "growth-mindset": {
    bg: "bg-[var(--primitive-yellow-200)]",
    tagBg: "bg-[var(--primitive-yellow-500)]",
    label: "Growth Mindset",
  },
};

const jobNoteCardVariants = cva(
  ["relative flex flex-col", "rounded-[12px]", "transition-all duration-200 ease-out"],
  {
    variants: {
      size: {
        // Default (Large): 350x416, 24px padding, 48px title
        default: "w-[350px] h-[416px] p-6",
        // Medium: 350x200, 16px padding
        medium: "w-[350px] h-[200px] p-4",
        // Skinny: 350x124, 16px padding
        skinny: "w-[350px] h-[124px] p-4",
        // Small: 171x200, 16px padding
        small: "w-[171px] h-[200px] p-4",
        // Flexible width versions
        "full-default": "w-full h-[416px] p-6",
        "full-medium": "w-full h-[200px] p-4",
        "full-skinny": "w-full h-[124px] p-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface JobNoteCardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof jobNoteCardVariants> {
  /** Type of note - determines background color */
  type: JobNoteType;
  /** Title/content of the note */
  title: string;
  /** Author name */
  authorName?: string;
  /** Author avatar URL */
  authorAvatar?: string;
  /** Whether to show the action button (bookmark) */
  showAction?: boolean;
  /** Callback when bookmark button is clicked */
  onBookmark?: () => void;
  /** Whether the note is bookmarked */
  bookmarked?: boolean;
  /** Callback when card is clicked */
  onClick?: () => void;
  /** Custom tag label (overrides default) */
  tagLabel?: string;
}

const JobNoteCard = React.forwardRef<HTMLDivElement, JobNoteCardProps>(
  (
    {
      className,
      size = "default",
      type,
      title,
      authorName,
      authorAvatar,
      showAction = true,
      onBookmark,
      bookmarked = false,
      onClick,
      tagLabel,
      ...props
    },
    ref
  ) => {
    const config = noteTypeConfig[type];
    const isCompact = size === "skinny" || size === "full-skinny";
    const isSmall = size === "small";
    const isDefault = size === "default" || size === "full-default";

    // Determine title text size based on card size
    const titleSizeClass = isDefault
      ? "text-5xl leading-[48px]" // 48px for default
      : "text-2xl leading-8"; // 24px for others

    return (
      <div
        ref={ref}
        className={cn(
          jobNoteCardVariants({ size }),
          config.bg,
          onClick && "cursor-pointer hover:shadow-lg",
          className
        )}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {/* Top Section: Tag + Title */}
        <div className={cn("flex flex-1 flex-col", isCompact ? "gap-2" : "gap-1")}>
          {/* Note Type Tag */}
          <div
            className={cn(
              "inline-flex items-center self-start",
              "rounded-lg px-2 py-1",
              config.tagBg
            )}
          >
            <span className="text-sm font-bold leading-5 text-white">
              {tagLabel || config.label}
            </span>
          </div>

          {/* Title */}
          <h3
            className={cn(
              "font-medium text-[var(--primitive-neutral-800)]",
              titleSizeClass,
              // Line clamping based on size
              isCompact ? "line-clamp-2" : isSmall ? "line-clamp-4" : "line-clamp-3"
            )}
          >
            {title}
          </h3>
        </div>

        {/* Bottom Section: Author + Action Button */}
        <div className="mt-auto flex items-end justify-between">
          {/* Author */}
          {authorName && (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Avatar
                size="sm"
                src={authorAvatar}
                name={authorName}
                alt={authorName}
                className="shrink-0 border-[var(--primitive-neutral-200)]"
              />
              <span className="truncate text-sm text-[var(--primitive-neutral-800)]">
                {authorName}
              </span>
            </div>
          )}

          {/* Bookmark Action Button */}
          {showAction && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBookmark?.();
              }}
              className={cn(
                "flex items-center justify-center",
                "rounded-2xl p-3",
                "bg-[var(--primitive-neutral-200)]",
                "transition-colors duration-150",
                "hover:bg-[var(--background-interactive-hover)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2",
                // Move to end if no author
                !authorName && "ml-auto"
              )}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <BookmarkSimple
                size={24}
                weight={bookmarked ? "fill" : "regular"}
                className="text-[var(--primitive-neutral-800)]"
              />
            </button>
          )}
        </div>
      </div>
    );
  }
);

JobNoteCard.displayName = "JobNoteCard";

export { JobNoteCard, jobNoteCardVariants, noteTypeConfig };

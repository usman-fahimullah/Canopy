/**
 * Shared constants for scheduling components.
 *
 * Only plain data constants live here. Constants that reference
 * React components (e.g., VIDEO_PROVIDER_OPTIONS with icon components)
 * stay in their respective component files.
 */

import type { Attendee } from "./types";

/* ============================================
   Timezone Options
   ============================================ */

export const COMMON_TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona (MST)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Central European (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Tokyo", label: "Japan (JST)" },
  { value: "Asia/Shanghai", label: "China (CST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
] as const;

/* ============================================
   Interview Duration Options
   ============================================ */

export const DURATION_OPTIONS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1h 30m" },
  { value: "120", label: "2 hours" },
] as const;

/* ============================================
   Attendee Role Display
   ============================================ */

export const ROLE_LABELS: Record<Attendee["role"], string> = {
  candidate: "Candidate",
  interviewer: "Interviewer",
  "hiring-manager": "Hiring Manager",
  recruiter: "Recruiter",
};

export const ROLE_COLORS: Record<Attendee["role"], string> = {
  candidate: "text-[var(--primitive-blue-600)]",
  interviewer: "text-[var(--foreground-muted)]",
  "hiring-manager": "text-[var(--primitive-purple-600)]",
  recruiter: "text-[var(--primitive-green-700)]",
};

/* ============================================
   Calendar Grid Constants
   ============================================ */

/** Height per hour in pixels for calendar grids */
export const HOUR_HEIGHT = 48;

/** Default scroll position (8am) — sensible starting point for most work schedules */
export const DEFAULT_SCROLL_HOUR = 8;

/* ============================================
   Calendar Event Styles
   ============================================ */

/** CSS pattern for tentative/optional events (diagonal stripes) */
export const TENTATIVE_PATTERN = `repeating-linear-gradient(
  -45deg,
  transparent,
  transparent 3px,
  rgba(0, 0, 0, 0.08) 3px,
  rgba(0, 0, 0, 0.08) 6px
)`;

/** Attendee calendar overlay colors — uses CSS custom properties from globals.css */
export const ATTENDEE_COLORS = [
  {
    bg: "var(--calendar-attendee-1-background)",
    border: "var(--calendar-attendee-1-border)",
    text: "var(--calendar-attendee-1-foreground)",
  }, // Sage
  {
    bg: "var(--calendar-attendee-2-background)",
    border: "var(--calendar-attendee-2-border)",
    text: "var(--calendar-attendee-2-foreground)",
  }, // Terracotta
  {
    bg: "var(--calendar-attendee-3-background)",
    border: "var(--calendar-attendee-3-border)",
    text: "var(--calendar-attendee-3-foreground)",
  }, // Slate
  {
    bg: "var(--calendar-attendee-4-background)",
    border: "var(--calendar-attendee-4-border)",
    text: "var(--calendar-attendee-4-foreground)",
  }, // Orchid
  {
    bg: "var(--calendar-attendee-5-background)",
    border: "var(--calendar-attendee-5-border)",
    text: "var(--calendar-attendee-5-foreground)",
  }, // Rose
  {
    bg: "var(--calendar-attendee-6-background)",
    border: "var(--calendar-attendee-6-border)",
    text: "var(--calendar-attendee-6-foreground)",
  }, // Fern
  {
    bg: "var(--calendar-attendee-7-background)",
    border: "var(--calendar-attendee-7-border)",
    text: "var(--calendar-attendee-7-foreground)",
  }, // Wheat
  {
    bg: "var(--calendar-attendee-8-background)",
    border: "var(--calendar-attendee-8-border)",
    text: "var(--calendar-attendee-8-foreground)",
  }, // Steel
] as const;

/* ============================================
   Recruiter Calendar Constants
   ============================================ */

export const VIEW_OPTIONS = [
  { value: "day", label: "Day", shortcut: "D" },
  { value: "week", label: "Week", shortcut: "W" },
  { value: "month", label: "Month", shortcut: "M" },
] as const;

export const KEYBOARD_SHORTCUTS = [
  { keys: ["T"], action: "Go to today" },
  { keys: ["J"], action: "Previous period" },
  { keys: ["K"], action: "Next period" },
  { keys: ["D"], action: "Day view" },
  { keys: ["W"], action: "Week view" },
  { keys: ["M"], action: "Month view" },
  { keys: ["N"], action: "New event" },
  { keys: ["\u2318", "K"], action: "Quick search" },
  { keys: ["?"], action: "Keyboard shortcuts" },
] as const;

/**
 * Shared utility functions for scheduling components.
 *
 * These functions are deduplicated from scheduler.tsx,
 * interview-scheduling-modal.tsx, and recruiter-calendar.tsx.
 */

import { parseISO } from "date-fns";

/**
 * Get the user's local timezone in IANA format.
 * Falls back to "America/New_York" if detection fails.
 */
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/New_York";
  }
};

/**
 * Get the abbreviated timezone name (e.g., "EST", "PST").
 *
 * @param timezone - IANA timezone string (e.g., "America/New_York")
 * @returns Short timezone abbreviation
 */
export const getTimezoneAbbr = (timezone?: string): string => {
  if (!timezone) return "";
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart?.value || timezone.split("/").pop()?.replace(/_/g, " ") || "";
  } catch {
    return timezone.split("/").pop()?.replace(/_/g, " ") || "";
  }
};

/** Alias for backward compatibility with scheduler.tsx */
export const getTimezoneAbbreviation = getTimezoneAbbr;

/**
 * Calculate the CSS position (top/height as percentages) for a calendar event
 * within a day column.
 *
 * @param event - Object with start/end as Date or ISO string
 * @param startHour - First visible hour (0-23)
 * @param endHour - Last visible hour (0-23)
 * @returns CSS position with top and height as percentage strings
 */
export const getEventPosition = (
  event: { start: Date | string; end: Date | string },
  startHour: number,
  endHour: number
): { top: string; height: string } => {
  const start = typeof event.start === "string" ? parseISO(event.start) : event.start;
  const end = typeof event.end === "string" ? parseISO(event.end) : event.end;

  const dayStartMinutes = startHour * 60;
  const dayEndMinutes = endHour * 60;
  const totalMinutes = dayEndMinutes - dayStartMinutes;

  const eventStartMinutes = start.getHours() * 60 + start.getMinutes();
  const eventEndMinutes = end.getHours() * 60 + end.getMinutes();

  const topPercent = ((eventStartMinutes - dayStartMinutes) / totalMinutes) * 100;
  const heightPercent = ((eventEndMinutes - eventStartMinutes) / totalMinutes) * 100;

  return {
    top: `${Math.max(0, topPercent)}%`,
    height: `${Math.min(100 - topPercent, Math.max(2, heightPercent))}%`,
  };
};

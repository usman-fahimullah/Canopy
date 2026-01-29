/**
 * Calendar Attendee Color Palette
 *
 * A dedicated color palette for multi-person scheduling views.
 * These colors are muted and harmonious, avoiding semantic meanings
 * (no red=error, green=success associations).
 *
 * Each color has background, foreground, and border variants defined
 * as CSS custom properties in globals.css.
 */

export const CALENDAR_ATTENDEE_COLORS = [
  { id: 1, name: "Sage", cssVar: "calendar-attendee-1" },
  { id: 2, name: "Terracotta", cssVar: "calendar-attendee-2" },
  { id: 3, name: "Slate", cssVar: "calendar-attendee-3" },
  { id: 4, name: "Orchid", cssVar: "calendar-attendee-4" },
  { id: 5, name: "Rose", cssVar: "calendar-attendee-5" },
  { id: 6, name: "Fern", cssVar: "calendar-attendee-6" },
  { id: 7, name: "Wheat", cssVar: "calendar-attendee-7" },
  { id: 8, name: "Steel", cssVar: "calendar-attendee-8" },
] as const;

export type CalendarColorName =
  (typeof CALENDAR_ATTENDEE_COLORS)[number]["name"];
export type CalendarColorId = (typeof CALENDAR_ATTENDEE_COLORS)[number]["id"];

/**
 * Get the color assignment for an attendee based on their index.
 * Colors cycle through the 8-color palette.
 *
 * @param index - The attendee's index (0-based)
 * @returns The color configuration with CSS variable name and color name
 */
export function getAttendeeColor(index: number) {
  const colorIndex = index % CALENDAR_ATTENDEE_COLORS.length;
  return CALENDAR_ATTENDEE_COLORS[colorIndex];
}

/**
 * Get CSS classes for an attendee's calendar events.
 *
 * @param index - The attendee's index (0-based)
 * @returns Object with Tailwind-compatible CSS variable classes
 */
export function getAttendeeColorClasses(index: number) {
  const color = getAttendeeColor(index);
  return {
    background: `bg-[var(--${color.cssVar}-background)]`,
    foreground: `text-[var(--${color.cssVar}-foreground)]`,
    border: `border-[var(--${color.cssVar}-border)]`,
    // Combined class for event cards
    eventCard: `bg-[var(--${color.cssVar}-background)] text-[var(--${color.cssVar}-foreground)] border-[var(--${color.cssVar}-border)]`,
  };
}

/**
 * Get inline styles for an attendee's calendar events.
 * Useful when you need style objects instead of classes.
 *
 * @param index - The attendee's index (0-based)
 * @returns Object with CSS custom property references
 */
export function getAttendeeColorStyles(index: number): React.CSSProperties {
  const color = getAttendeeColor(index);
  return {
    backgroundColor: `var(--${color.cssVar}-background)`,
    color: `var(--${color.cssVar}-foreground)`,
    borderColor: `var(--${color.cssVar}-border)`,
  };
}

/**
 * Create a stable color assignment map for a list of attendees.
 * This ensures consistent colors across re-renders.
 *
 * @param attendeeIds - Array of unique attendee identifiers
 * @returns Map of attendee ID to color configuration
 */
export function createAttendeeColorMap<T extends string | number>(
  attendeeIds: T[]
): Map<T, (typeof CALENDAR_ATTENDEE_COLORS)[number]> {
  const colorMap = new Map<T, (typeof CALENDAR_ATTENDEE_COLORS)[number]>();

  attendeeIds.forEach((id, index) => {
    colorMap.set(id, getAttendeeColor(index));
  });

  return colorMap;
}

/**
 * Get the dot/chip color for the calendar legend.
 * Returns just the background color for simple indicators.
 *
 * @param index - The attendee's index (0-based)
 * @returns CSS variable reference for the background color
 */
export function getAttendeeDotColor(index: number): string {
  const color = getAttendeeColor(index);
  return `var(--${color.cssVar}-background)`;
}

/**
 * Get the border color for legend chips with better visibility.
 *
 * @param index - The attendee's index (0-based)
 * @returns CSS variable reference for the border color
 */
export function getAttendeeBorderColor(index: number): string {
  const color = getAttendeeColor(index);
  return `var(--${color.cssVar}-border)`;
}

/**
 * Get the foreground color for text on attendee-colored backgrounds.
 *
 * @param index - The attendee's index (0-based)
 * @returns CSS variable reference for the foreground color
 */
export function getAttendeeForegroundColor(index: number): string {
  const color = getAttendeeColor(index);
  return `var(--${color.cssVar}-foreground)`;
}

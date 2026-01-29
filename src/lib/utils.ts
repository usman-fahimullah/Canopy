import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Extended tailwind-merge that recognizes our custom typography classes
 * as font-size utilities (not text-color utilities)
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // Tell tailwind-merge that these text-* classes are font sizes, not colors
      "font-size": [
        "text-display",
        "text-heading-lg",
        "text-heading-md",
        "text-heading-sm",
        "text-body-strong",
        "text-body",
        "text-body-sm",
        "text-caption-strong",
        "text-caption",
        "text-caption-sm",
      ],
    },
  },
});

/**
 * Merges class names with Tailwind CSS classes, handling conflicts properly.
 * Uses clsx for conditional classes and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Format a date string
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
  locale: string = "en-US"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(dateObj);
}

/**
 * Truncate a string to a specified length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Generate initials from a name
 *
 * Handles various name formats:
 * - Standard names: "John Doe" → "JD"
 * - Single names: "Madonna" → "MA" (takes first two letters)
 * - Multiple names: "John Michael Doe" → "JD" (first + last)
 * - Reversed format: "Doe, John" → "JD"
 * - With prefixes: "Dr. John Doe" → "JD" (skips common prefixes)
 * - With suffixes: "John Doe Jr." → "JD" (skips common suffixes)
 * - Empty/whitespace: "" → "?"
 * - Unicode/special chars: Handled gracefully
 *
 * @param name - The full name to extract initials from
 * @param maxLength - Maximum number of initials to return (default: 2)
 * @returns Uppercase initials or "?" if name is empty
 */
export function getInitials(name: string, maxLength: number = 2): string {
  // Handle empty/whitespace names
  if (!name?.trim()) return "?";

  // Common prefixes and suffixes to ignore
  const prefixes = ["dr", "dr.", "mr", "mr.", "mrs", "mrs.", "ms", "ms.", "prof", "prof."];
  const suffixes = ["jr", "jr.", "sr", "sr.", "ii", "iii", "iv", "phd", "md", "esq"];

  // Normalize the name: trim, collapse whitespace
  let normalized = name.trim().replace(/\s+/g, " ");

  // Handle "Last, First" format
  if (normalized.includes(",")) {
    const [last, first] = normalized.split(",").map((s) => s.trim());
    if (first && last) {
      normalized = `${first} ${last}`;
    }
  }

  // Split into parts and filter out empty strings
  let parts = normalized.split(" ").filter(Boolean);

  // Remove prefixes from the beginning
  while (parts.length > 1 && prefixes.includes(parts[0].toLowerCase())) {
    parts.shift();
  }

  // Remove suffixes from the end
  while (parts.length > 1 && suffixes.includes(parts[parts.length - 1].toLowerCase())) {
    parts.pop();
  }

  // Handle single word names - take first N characters
  if (parts.length === 1) {
    const word = parts[0];
    // Get first characters, handling unicode properly
    const chars = Array.from(word).slice(0, maxLength);
    return chars.join("").toUpperCase();
  }

  // For multiple words: take first letter of first and last (or first N words)
  if (parts.length === 2) {
    return parts
      .map((part) => Array.from(part)[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, maxLength);
  }

  // For 3+ words: first + last name initials
  const firstInitial = Array.from(parts[0])[0] || "";
  const lastInitial = Array.from(parts[parts.length - 1])[0] || "";
  return (firstInitial + lastInitial).toUpperCase().slice(0, maxLength);
}

/**
 * Slugify a string for URLs
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Delay execution for a specified time
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Generate a random ID
 */
export function generateId(prefix: string = ""): string {
  const id = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${id}` : id;
}

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

/**
 * Sanitize HTML to prevent XSS attacks.
 *
 * Allows a safe subset of HTML tags and attributes commonly used in
 * rich-text content (headings, paragraphs, lists, links, emphasis).
 * Strips everything else — including <script>, event handlers, and
 * dangerous protocols like javascript:.
 */
const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "b",
  "i",
  "u",
  "em",
  "strong",
  "s",
  "del",
  "mark",
  "sub",
  "sup",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "pre",
  "code",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "hr",
  "span",
  "div",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "width", "height"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan"]),
  "*": new Set(["class", "id"]),
};

const SAFE_URL_PATTERN = /^(?:https?|mailto):/i;

export function sanitizeHtml(dirty: string): string {
  // Strip <script>, <style>, <iframe>, <object>, <embed>, <form> blocks entirely
  let clean = dirty.replace(/<(script|style|iframe|object|embed|form)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  // Strip self-closing dangerous tags
  clean = clean.replace(/<(script|style|iframe|object|embed|form)\b[^>]*\/?>/gi, "");

  // Process remaining tags
  clean = clean.replace(
    /<\/?([a-z][a-z0-9]*)\b([^>]*)?\/?>/gi,
    (match, tag: string, attrs: string) => {
      const lower = tag.toLowerCase();
      const isClosing = match.startsWith("</");

      if (!ALLOWED_TAGS.has(lower)) return "";
      if (isClosing) return `</${lower}>`;

      // Filter attributes
      const safeAttrs: string[] = [];
      const allowedForTag = ALLOWED_ATTRS[lower];
      const allowedGlobal = ALLOWED_ATTRS["*"];

      if (attrs) {
        const attrRegex = /([a-z][a-z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(attrs)) !== null) {
          const attrName = attrMatch[1].toLowerCase();
          const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";

          // Block event handlers
          if (attrName.startsWith("on")) continue;

          const isAllowed = allowedForTag?.has(attrName) || allowedGlobal?.has(attrName);
          if (!isAllowed) continue;

          // Validate URLs
          if (attrName === "href" || attrName === "src") {
            if (!SAFE_URL_PATTERN.test(attrValue)) continue;
          }

          safeAttrs.push(`${attrName}="${attrValue.replace(/"/g, "&quot;")}"`);
        }
      }

      // Force rel="noopener noreferrer" on links with target
      if (lower === "a" && safeAttrs.some((a) => a.startsWith("target="))) {
        if (!safeAttrs.some((a) => a.startsWith("rel="))) {
          safeAttrs.push('rel="noopener noreferrer"');
        }
      }

      const attrStr = safeAttrs.length > 0 ? " " + safeAttrs.join(" ") : "";
      return `<${lower}${attrStr}>`;
    }
  );

  return clean;
}

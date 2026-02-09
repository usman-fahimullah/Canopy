/**
 * Helper functions for the Job Detail Page
 *
 * formatSalary and getExperienceLevelLabel are re-exported from
 * the shared canonical source at @/lib/jobs/helpers.
 */

// Re-export shared helpers so existing `./helpers` imports keep working
export { formatSalary, getExperienceLevelLabel, getEducationLevelLabel } from "@/lib/jobs/helpers";

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Not specified";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Returns the ordinal-suffix version e.g. "February 25th, 2026" */
export function formatDateWithOrdinal(dateStr: string | null): string {
  if (!dateStr) return "Not specified";
  const d = new Date(dateStr);
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const day = d.getDate();
  const year = d.getFullYear();
  const suffix =
    day >= 11 && day <= 13
      ? "th"
      : day % 10 === 1
        ? "st"
        : day % 10 === 2
          ? "nd"
          : day % 10 === 3
            ? "rd"
            : "th";
  return `${month} ${day}${suffix}, ${year}`;
}

export function isClosingSoon(closesAt: string | null): boolean {
  if (!closesAt) return false;
  const daysLeft = (new Date(closesAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return daysLeft > 0 && daysLeft <= 14;
}

/**
 * Converts plain text job descriptions into basic HTML for rendering.
 * Handles line breaks, bullet points, and basic formatting.
 */
export function formatDescription(description: string): string {
  // If already HTML, return as-is
  if (description.includes("<") && description.includes(">")) {
    return description;
  }

  const lines = description.split("\n");
  let html = "";
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      continue;
    }

    // Check for bullet points
    if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${trimmed.replace(/^[•\-*]\s*/, "")}</li>`;
      continue;
    }

    if (inList) {
      html += "</ul>";
      inList = false;
    }

    // Check for headers (ALL CAPS lines)
    if (
      trimmed === trimmed.toUpperCase() &&
      trimmed.length > 3 &&
      trimmed.length < 100 &&
      !trimmed.includes(".")
    ) {
      html += `<h3>${trimmed}</h3>`;
      continue;
    }

    html += `<p>${trimmed}</p>`;
  }

  if (inList) {
    html += "</ul>";
  }

  return html;
}

/**
 * Format a date as relative time: "Just now", "5 min ago", "2 hours ago", etc.
 * Returns "Never" if null/undefined.
 */
export function formatRelativeTime(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "Never";

  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffDays < 30) return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""} ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffDays < 365) return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;
}

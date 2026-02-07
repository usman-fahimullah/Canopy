/**
 * Safe JSON parsing utilities.
 *
 * Use these instead of bare `JSON.parse()` in API routes to prevent
 * crashes on malformed data stored in database text/JSON fields.
 */

/**
 * Safely parse a JSON string, returning a fallback value on failure.
 *
 * Handles null, undefined, empty strings, and invalid JSON gracefully.
 *
 * @example
 *   safeJsonParse(coach.availability, {})
 *   safeJsonParse(milestone.resources, null)
 *   safeJsonParse(job.stages, [])
 */
export function safeJsonParse<T = unknown>(value: string | null | undefined, fallback: T): T {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

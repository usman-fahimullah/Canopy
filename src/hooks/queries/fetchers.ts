/**
 * Shared API Fetch Utilities for React Query
 *
 * Typed fetch wrapper that throws on non-OK responses,
 * which React Query catches and surfaces as `error`.
 */

/** Error shape returned by our API routes */
interface ApiErrorBody {
  error?: string;
  details?: unknown;
}

/** Custom error class that preserves HTTP status */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Typed fetch wrapper for API calls.
 *
 * - Throws `ApiError` on non-OK responses so React Query can handle it.
 * - Parses JSON response and returns typed data.
 *
 * @example
 * ```ts
 * const data = await apiFetch<{ jobs: Job[] }>("/api/canopy/roles?skip=0&take=100");
 * ```
 */
export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);

  if (!res.ok) {
    const body: ApiErrorBody = await res.json().catch(() => ({}));
    throw new ApiError(body.error ?? `Request failed (${res.status})`, res.status, body.details);
  }

  return res.json() as Promise<T>;
}

/**
 * Convenience for JSON POST/PATCH/DELETE mutations.
 *
 * @example
 * ```ts
 * const result = await apiMutate<{ success: true }>("/api/canopy/roles/123", {
 *   method: "PATCH",
 *   body: { title: "New Title" },
 * });
 * ```
 */
export async function apiMutate<T>(
  url: string,
  options: {
    method: "POST" | "PATCH" | "PUT" | "DELETE";
    body?: unknown;
  }
): Promise<T> {
  return apiFetch<T>(url, {
    method: options.method,
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
}

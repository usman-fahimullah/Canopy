import { NextResponse } from "next/server";
import type { ZodError } from "zod";

/**
 * Standardized API response helpers.
 *
 * These work alongside the existing bare-data pattern — they don't
 * force an envelope wrapper. Use them in new routes and gradually
 * migrate existing routes for consistency.
 */

/**
 * Return a success JSON response.
 *
 * @example
 *   return apiSuccess({ goals });
 *   return apiSuccess({ goal }, 201);
 */
export function apiSuccess<T extends Record<string, unknown>>(
  data: T,
  status = 200
): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * Return an error JSON response.
 *
 * @example
 *   return apiError("Coach not found", 404);
 *   return apiError("Validation failed", 422, result.error.flatten());
 */
export function apiError(
  message: string,
  status: number,
  details?: unknown
): NextResponse {
  const body: Record<string, unknown> = { error: message };
  if (details !== undefined) {
    body.details = details;
  }
  return NextResponse.json(body, { status });
}

/**
 * Return a 422 validation error from a Zod parse failure.
 *
 * @example
 *   const result = schema.safeParse(body);
 *   if (!result.success) return apiValidationError(result.error);
 */
export function apiValidationError(zodError: ZodError): NextResponse {
  return NextResponse.json(
    { error: "Validation failed", details: zodError.flatten() },
    { status: 422 }
  );
}

/**
 * Return a 404 not-found error.
 *
 * @example
 *   return apiNotFound("Coach");
 *   return apiNotFound(); // "Resource not found"
 */
export function apiNotFound(entity = "Resource"): NextResponse {
  return NextResponse.json(
    { error: `${entity} not found` },
    { status: 404 }
  );
}

/**
 * Return a 429 rate-limit exceeded error.
 *
 * @example
 *   if (!rateLimitResult.success) return apiRateLimited();
 */
export function apiRateLimited(): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please try again shortly." },
    { status: 429 }
  );
}

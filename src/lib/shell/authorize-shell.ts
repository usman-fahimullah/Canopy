import { redirect } from "next/navigation";
import { getCachedAuthContext } from "@/lib/access-control";
import type { Shell } from "@/lib/onboarding/types";

/**
 * Server-side authorization guard for shell layouts.
 * Verifies the authenticated user has the appropriate role/profile
 * for the shell they are accessing.
 *
 * Uses getCachedAuthContext() which is request-scoped via React cache().
 * If a child page also calls getCachedAuthContext(), the auth check
 * is deduplicated — Supabase and DB are only hit once per request.
 *
 * Redirects to /onboarding if the user lacks the required role.
 * Redirects to /login if the user is not authenticated.
 */
export async function authorizeShell(shell: Shell): Promise<void> {
  const ctx = await getCachedAuthContext();

  if (!ctx) {
    redirect("/login");
  }

  let authorized = false;

  switch (shell) {
    case "talent":
      authorized = ctx.hasTalentRole;
      break;
    case "coach":
      authorized = ctx.hasCoachRole;
      break;
    case "employer":
      authorized = ctx.hasEmployerRole;
      break;
  }

  if (!authorized) {
    redirect("/onboarding");
  }
}

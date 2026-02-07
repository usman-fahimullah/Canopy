import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

/**
 * Platform admin email allowlist.
 * In production, this should be moved to a database flag or environment variable
 * (PLATFORM_ADMIN_EMAILS as a comma-separated list).
 */
const PLATFORM_ADMIN_EMAILS: string[] = [
  // Add platform admin emails here, e.g.:
  // "admin@greenjobsboard.us",
];

/**
 * Get the authenticated user's account from Supabase auth.
 * Returns null if not authenticated.
 */
export async function getAuthenticatedAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const account = await prisma.account.findUnique({
    where: { supabaseId: user.id },
    include: {
      orgMemberships: { select: { role: true, organizationId: true } },
      seekerProfile: { select: { id: true } },
      coachProfile: { select: { id: true } },
    },
  });

  return account;
}

/**
 * Check if the authenticated account has platform admin privileges.
 *
 * Admin access is determined exclusively by the PLATFORM_ADMIN_EMAILS
 * environment variable (comma-separated list) or the hardcoded constant.
 * No org-role fallback — only explicitly listed emails get admin access.
 */
export function isAdminAccount(
  account: { email?: string | null; orgMemberships: { role: string }[] } | null
): boolean {
  if (!account) return false;

  // Check platform admin email list (env var takes priority)
  const envEmails = process.env.PLATFORM_ADMIN_EMAILS;
  const adminEmails = envEmails
    ? envEmails.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
    : PLATFORM_ADMIN_EMAILS.map((e) => e.toLowerCase());

  if (adminEmails.length === 0) {
    // No admin emails configured — no one has platform admin access
    return false;
  }

  return Boolean(account.email && adminEmails.includes(account.email.toLowerCase()));
}

/**
 * Return a 401 Unauthorized JSON response.
 */
export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * Return a 403 Forbidden JSON response.
 */
export function forbiddenResponse(message = "Admin access required") {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Get the current organization for an authenticated user.
 * Returns the first organization the user is a member of.
 * Use this in API routes to scope data by organization.
 *
 * @param accountId - The Account ID (not Supabase user ID)
 * @returns The Organization object or null if user has no memberships
 */
export async function getCurrentOrganization(accountId: string) {
  const member = await prisma.organizationMember.findFirst({
    where: {
      accountId,
    },
    include: {
      organization: true,
    },
  });

  return member?.organization || null;
}

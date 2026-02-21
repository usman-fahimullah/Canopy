import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

// =================================================================
// Impersonation Cookie Management
// =================================================================

const IMPERSONATION_COOKIE = "admin_impersonate_org";
const IMPERSONATION_MAX_AGE = 60 * 60 * 4; // 4 hours

/**
 * Set the impersonation cookie for a super-admin to view a target org.
 * Also logs the action in AdminAccessLog.
 */
export async function setImpersonation(
  adminAccountId: string,
  targetOrganizationId: string
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(IMPERSONATION_COOKIE, targetOrganizationId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: IMPERSONATION_MAX_AGE,
  });

  await prisma.adminAccessLog.create({
    data: {
      adminAccountId,
      action: "impersonate_start",
      targetOrganizationId,
    },
  });

  logger.info("Admin impersonation started", {
    adminAccountId,
    targetOrganizationId,
  });
}

/**
 * Clear the impersonation cookie and log the end of the session.
 */
export async function clearImpersonation(adminAccountId: string): Promise<void> {
  const cookieStore = await cookies();
  const targetOrgId = cookieStore.get(IMPERSONATION_COOKIE)?.value;

  cookieStore.delete(IMPERSONATION_COOKIE);

  if (targetOrgId) {
    await prisma.adminAccessLog.create({
      data: {
        adminAccountId,
        action: "impersonate_end",
        targetOrganizationId: targetOrgId,
      },
    });

    logger.info("Admin impersonation ended", {
      adminAccountId,
      targetOrganizationId: targetOrgId,
    });
  }
}

/**
 * Read the impersonation cookie value.
 * Returns the target organization ID or null.
 */
export async function getImpersonatedOrgId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(IMPERSONATION_COOKIE)?.value ?? null;
}

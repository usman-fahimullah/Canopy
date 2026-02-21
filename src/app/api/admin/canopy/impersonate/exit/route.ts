import { NextResponse } from "next/server";
import {
  getAuthenticatedAccount,
  isAdminAccount,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";
import { clearImpersonation } from "@/lib/admin/impersonation";
import { logger, formatError } from "@/lib/logger";

/**
 * POST /api/admin/canopy/impersonate/exit
 *
 * End impersonation session (exit god mode).
 * Clears the impersonation cookie and logs the action.
 */
export async function POST() {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return unauthorizedResponse();
    if (!isAdminAccount(account)) return forbiddenResponse();

    // Clear impersonation cookie + log to AdminAccessLog
    await clearImpersonation(account.id);

    logger.info("Admin impersonation ended via API", {
      adminAccountId: account.id,
      adminEmail: account.email,
    });

    return NextResponse.json({
      data: { impersonating: false },
    });
  } catch (error) {
    logger.error("Admin impersonation exit error", {
      error: formatError(error),
      endpoint: "/api/admin/canopy/impersonate/exit",
    });
    return NextResponse.json({ error: "Failed to exit impersonation" }, { status: 500 });
  }
}

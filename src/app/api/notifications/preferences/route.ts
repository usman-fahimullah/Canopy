import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { NotificationPreferencesSchema } from "@/lib/validators/notifications";
import { createAuditLog } from "@/lib/audit";

// Default preferences — all notifications enabled
const DEFAULT_PREFS = {
  inAppPrefs: {} as Record<string, boolean>,
  emailPrefs: {} as Record<string, boolean>,
  emailFrequency: "immediate",
};

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 403 });
    }

    const prefs = await (prisma as any).notificationPreference.findUnique({
      where: { accountId: account.id },
    });

    return NextResponse.json({
      preferences: prefs || { ...DEFAULT_PREFS, accountId: account.id },
    });
  } catch (error) {
    logger.error("Error fetching notification preferences", {
      error: formatError(error),
      endpoint: "/api/notifications/preferences",
    });
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 403 });
    }

    const body = await request.json();
    const result = NotificationPreferencesSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (result.data.inAppPrefs !== undefined) updateData.inAppPrefs = result.data.inAppPrefs;
    if (result.data.emailPrefs !== undefined) updateData.emailPrefs = result.data.emailPrefs;
    if (result.data.emailFrequency !== undefined)
      updateData.emailFrequency = result.data.emailFrequency;

    const prefs = await (prisma as any).notificationPreference.upsert({
      where: { accountId: account.id },
      create: {
        accountId: account.id,
        ...DEFAULT_PREFS,
        ...updateData,
      },
      update: updateData,
    });

    // Convert updateData to audit changes format { from, to }
    const auditChanges: Record<string, { from: unknown; to: unknown }> = {};
    for (const [key, value] of Object.entries(updateData)) {
      auditChanges[key] = { from: null, to: value };
    }

    await createAuditLog({
      action: "UPDATE",
      entityType: "NotificationPreference",
      entityId: prefs.id,
      userId: account.id,
      changes: auditChanges,
    }).catch((err) => {
      logger.error("Failed to create audit log", { error: formatError(err) });
    });

    return NextResponse.json({ preferences: prefs });
  } catch (error) {
    logger.error("Error updating notification preferences", {
      error: formatError(error),
      endpoint: "/api/notifications/preferences",
    });
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}

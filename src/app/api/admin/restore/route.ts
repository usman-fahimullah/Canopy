import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { restoreRecord } from "@/lib/soft-delete";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { z } from "zod";

const RestoreSchema = z.object({
  model: z.enum(["application", "review", "session"]),
  id: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(10, `admin-restore:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin check
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: {
        id: true,
        orgMemberships: { select: { role: true } },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 403 });
    }

    const isAdmin = account.orgMemberships.some((m) => m.role === "OWNER" || m.role === "ADMIN");

    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const result = RestoreSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { model, id } = result.data;

    await restoreRecord(model, id, account.id);

    return NextResponse.json({ success: true, restored: { model, id } });
  } catch (error) {
    logger.error("Error restoring record", {
      error: formatError(error),
      endpoint: "/api/admin/restore",
    });
    return NextResponse.json({ error: "Failed to restore record" }, { status: 500 });
  }
}

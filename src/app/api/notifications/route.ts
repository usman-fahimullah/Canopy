import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { readLimiter, standardLimiter } from "@/lib/rate-limit";

// GET — list notifications for current user
export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success: rlSuccess } = await readLimiter.check(30, `notifications-get:${ip}`);
    if (!rlSuccess) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

    const notifications = await prisma.notification.findMany({
      where: {
        accountId: account.id,
        ...(unreadOnly ? { readAt: null } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Also get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        accountId: account.id,
        readAt: null,
      },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PUT — mark all notifications as read
export async function PUT(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success: rlSuccess } = await standardLimiter.check(10, `notifications-put:${ip}`);
    if (!rlSuccess) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    await prisma.notification.updateMany({
      where: {
        accountId: account.id,
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark all read error:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}

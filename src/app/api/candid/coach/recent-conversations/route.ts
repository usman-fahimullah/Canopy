import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

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
      include: { coachProfile: { select: { id: true } } },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (!account.coachProfile) {
      return NextResponse.json({ error: "Forbidden: coach profile required" }, { status: 403 });
    }

    // In production, fetch from database for the authenticated coach
    // For now, return mock data matching the RecentItem interface
    const recentConversations = [
      {
        id: "conv_001",
        title: "Alex Johnson",
        subtitle: "Last message 1h ago",
        href: "/candid/coach/messages/conv_001",
      },
      {
        id: "conv_002",
        title: "Priya Patel",
        subtitle: "Last message 3h ago",
        href: "/candid/coach/messages/conv_002",
      },
      {
        id: "conv_003",
        title: "Marcus Lee",
        subtitle: "Last message 1d ago",
        href: "/candid/coach/messages/conv_003",
      },
    ];

    return NextResponse.json(recentConversations);
  } catch (error) {
    console.error("Error fetching recent conversations:", error);
    return NextResponse.json([], { status: 500 });
  }
}

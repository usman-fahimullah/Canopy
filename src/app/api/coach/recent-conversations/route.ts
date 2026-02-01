import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Fetch from database for the authenticated coach
    // For now, return mock data matching the RecentItem interface
    const recentConversations = [
      {
        id: "conv_001",
        title: "Alex Johnson",
        subtitle: "Last message 1h ago",
        href: "/coach/messages/conv_001",
      },
      {
        id: "conv_002",
        title: "Priya Patel",
        subtitle: "Last message 3h ago",
        href: "/coach/messages/conv_002",
      },
      {
        id: "conv_003",
        title: "Marcus Lee",
        subtitle: "Last message 1d ago",
        href: "/coach/messages/conv_003",
      },
    ];

    return NextResponse.json(recentConversations);
  } catch (error) {
    console.error("Error fetching recent conversations:", error);
    return NextResponse.json([], { status: 500 });
  }
}

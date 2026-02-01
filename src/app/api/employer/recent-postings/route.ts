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

    // TODO: Fetch from database for the authenticated employer org
    // For now, return mock data matching the RecentItem interface
    const recentPostings = [
      {
        id: "role_001",
        title: "ESG Analyst",
        subtitle: "12 applications",
        href: "/employer/roles/role_001",
      },
      {
        id: "role_002",
        title: "Solar Installation Lead",
        subtitle: "8 applications",
        href: "/employer/roles/role_002",
      },
      {
        id: "role_003",
        title: "Climate Data Scientist",
        subtitle: "5 applications",
        href: "/employer/roles/role_003",
      },
    ];

    return NextResponse.json(recentPostings);
  } catch (error) {
    console.error("Error fetching recent postings:", error);
    return NextResponse.json([], { status: 500 });
  }
}

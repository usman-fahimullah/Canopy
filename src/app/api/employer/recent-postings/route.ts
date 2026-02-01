import { NextResponse } from "next/server";

export async function GET() {
  try {
    // In production, fetch from database for the authenticated employer org
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

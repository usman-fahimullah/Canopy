import { NextResponse } from "next/server";

export async function GET() {
  try {
    // In production, fetch from database for the authenticated user
    // For now, return mock data matching the RecentItem interface
    const recentApplications = [
      {
        id: "app_001",
        title: "Solar Project Engineer at Solaris Energy",
        subtitle: "Applied 2d ago",
        href: "/talent/applications/app_001",
      },
      {
        id: "app_002",
        title: "ESG Analyst at GreenLeaf Analytics",
        subtitle: "Applied 5d ago",
        href: "/talent/applications/app_002",
      },
      {
        id: "app_003",
        title: "Climate Policy Advisor at Verdant Systems",
        subtitle: "Applied 1w ago",
        href: "/talent/applications/app_003",
      },
    ];

    return NextResponse.json(recentApplications);
  } catch (error) {
    console.error("Error fetching recent applications:", error);
    return NextResponse.json([], { status: 500 });
  }
}

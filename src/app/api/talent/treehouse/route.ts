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

    // TODO: Fetch from database for the authenticated user
    // For now, return mock data for the Treehouse learning hub
    const pathways = [
      {
        id: "pathway_001",
        title: "Solar Energy Fundamentals",
        description:
          "Learn the science and business of solar PV and thermal systems",
        courseCount: 8,
        progress: 0,
        icon: "\u2600\uFE0F",
      },
      {
        id: "pathway_002",
        title: "ESG & Sustainable Finance",
        description:
          "Master environmental, social, and governance reporting",
        courseCount: 6,
        progress: 0,
        icon: "\uD83D\uDCC8",
      },
      {
        id: "pathway_003",
        title: "Circular Economy",
        description: "Design for reuse, repair, and recycling",
        courseCount: 5,
        progress: 0,
        icon: "\u267B\uFE0F",
      },
      {
        id: "pathway_004",
        title: "Climate Policy & Advocacy",
        description:
          "Navigate climate legislation and policy frameworks",
        courseCount: 4,
        progress: 0,
        icon: "\uD83C\uDFDB\uFE0F",
      },
      {
        id: "pathway_005",
        title: "Green Building & LEED",
        description:
          "Sustainable design, construction, and certification",
        courseCount: 7,
        progress: 0,
        icon: "\uD83C\uDFE2",
      },
    ];

    const courses = [
      {
        id: "course_001",
        title: "Introduction to Solar PV Systems",
        provider: "Solar Academy",
        duration: "4 hours",
        difficulty: "Beginner" as const,
        progress: 0,
      },
      {
        id: "course_002",
        title: "Carbon Accounting 101",
        provider: "Climate Institute",
        duration: "6 hours",
        difficulty: "Beginner" as const,
        progress: 0,
      },
      {
        id: "course_003",
        title: "Sustainability Reporting Frameworks",
        provider: "GRI Foundation",
        duration: "8 hours",
        difficulty: "Intermediate" as const,
        progress: 0,
      },
      {
        id: "course_004",
        title: "Climate Risk Assessment",
        provider: "TCFD Training",
        duration: "10 hours",
        difficulty: "Advanced" as const,
        progress: 0,
      },
      {
        id: "course_005",
        title: "Circular Design Principles",
        provider: "Ellen MacArthur Foundation",
        duration: "5 hours",
        difficulty: "Intermediate" as const,
        progress: 0,
      },
      {
        id: "course_006",
        title: "LEED Green Associate Prep",
        provider: "USGBC",
        duration: "12 hours",
        difficulty: "Intermediate" as const,
        progress: 0,
      },
    ];

    const certifications = [
      {
        id: "cert_001",
        name: "NABCEP PV Associate",
        issuer: "NABCEP",
        status: "not_started" as const,
        earnedDate: null,
        expiresDate: null,
      },
      {
        id: "cert_002",
        name: "LEED Green Associate",
        issuer: "U.S. Green Building Council",
        status: "in_progress" as const,
        earnedDate: null,
        expiresDate: null,
      },
      {
        id: "cert_003",
        name: "GRI Sustainability Reporting",
        issuer: "Global Reporting Initiative",
        status: "not_started" as const,
        earnedDate: null,
        expiresDate: null,
      },
      {
        id: "cert_004",
        name: "Certified Energy Manager (CEM)",
        issuer: "Association of Energy Engineers",
        status: "not_started" as const,
        earnedDate: null,
        expiresDate: null,
      },
    ];

    return NextResponse.json({ pathways, courses, certifications });
  } catch (error) {
    console.error("Error fetching treehouse data:", error);
    return NextResponse.json(
      { pathways: [], courses: [], certifications: [] },
      { status: 500 }
    );
  }
}

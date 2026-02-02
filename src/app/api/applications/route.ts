import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { SubmitApplicationSchema } from "@/lib/validators/api";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    // Safely parse questionAnswers JSON
    let questionAnswers: Record<string, string> = {};
    try {
      const rawAnswers = formData.get("questionAnswers") as string;
      if (rawAnswers) {
        questionAnswers = JSON.parse(rawAnswers);
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid question answers format" },
        { status: 400 }
      );
    }

    // Extract form data into object for validation
    const applicationData = {
      jobId: (formData.get("jobId") as string) || "",
      name: (formData.get("name") as string) || "",
      email: (formData.get("email") as string) || "",
      dateOfBirth: (formData.get("dateOfBirth") as string) || undefined,
      pronouns: (formData.get("pronouns") as string) || undefined,
      location: (formData.get("location") as string) || undefined,
      currentRole: (formData.get("currentRole") as string) || undefined,
      currentCompany: (formData.get("currentCompany") as string) || undefined,
      yearsExperience: (formData.get("yearsExperience") as string) || undefined,
      linkedIn: (formData.get("linkedIn") as string) || undefined,
      portfolio: (formData.get("portfolio") as string) || undefined,
      questionAnswers,
    };

    const result = SubmitApplicationSchema.safeParse(applicationData);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    // Extract files (for future storage integration)
    const resumeFile = formData.get("resume") as File | null;
    const coverLetterFile = formData.get("coverLetter") as File | null;
    const portfolioFile = formData.get("portfolioFile") as File | null;

    // TODO: Upload files to storage, save to database, send confirmation email, notify recruiter
    void resumeFile;
    void coverLetterFile;
    void portfolioFile;

    return NextResponse.json(
      {
        success: true,
        applicationId: `app_${Date.now()}`,
        message: "Application submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Error submitting application", {
      error: formatError(error),
      endpoint: "/api/applications",
    });
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit application",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve applications for a job
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        {
          success: false,
          message: "jobId is required",
        },
        { status: 400 }
      );
    }

    // In a real app, fetch from database
    // For now, return mock data
    const mockApplications = [
      {
        id: "app_001",
        jobId,
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        location: "San Francisco, CA",
        yearsExperience: "5-10",
        resumeUrl: "/uploads/sarah-chen-resume.pdf",
        status: "new",
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        matchScore: 92,
      },
      {
        id: "app_002",
        jobId,
        name: "Marcus Johnson",
        email: "marcus.j@example.com",
        location: "Austin, TX",
        yearsExperience: "3-5",
        resumeUrl: "/uploads/marcus-johnson-resume.pdf",
        status: "reviewing",
        submittedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        matchScore: 85,
      },
      {
        id: "app_003",
        jobId,
        name: "Priya Patel",
        email: "priya.patel@example.com",
        location: "New York, NY",
        yearsExperience: "10+",
        resumeUrl: "/uploads/priya-patel-resume.pdf",
        status: "interview",
        submittedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
        matchScore: 88,
      },
    ];

    return NextResponse.json(
      {
        success: true,
        applications: mockApplications,
        total: mockApplications.length,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error fetching applications", { error: formatError(error), endpoint: "/api/applications" });
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch applications",
      },
      { status: 500 }
    );
  }
}

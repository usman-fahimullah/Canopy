import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const application = {
      jobId: formData.get("jobId"),
      name: formData.get("name"),
      email: formData.get("email"),
      dateOfBirth: formData.get("dateOfBirth"),
      pronouns: formData.get("pronouns"),
      location: formData.get("location"),
      currentRole: formData.get("currentRole"),
      currentCompany: formData.get("currentCompany"),
      yearsExperience: formData.get("yearsExperience"),
      linkedIn: formData.get("linkedIn"),
      portfolio: formData.get("portfolio"),
      questionAnswers: (() => { try { return JSON.parse(formData.get("questionAnswers") as string || "{}"); } catch { return {}; } })(),
      submittedAt: new Date().toISOString(),
    };

    // Extract files
    const resumeFile = formData.get("resume") as File | null;
    const coverLetterFile = formData.get("coverLetter") as File | null;
    const portfolioFile = formData.get("portfolio") as File | null;

    // In a real app, you would:
    // 1. Validate the data
    // 2. Upload files to storage (S3, etc.)
    // 3. Save to database
    // 4. Send confirmation email
    // 5. Notify recruiter

    if (process.env.NODE_ENV === "development") {
      console.log("New application received:", application);
      console.log("Files:", {
        resume: resumeFile?.name,
        coverLetter: coverLetterFile?.name,
        portfolio: portfolioFile?.name,
      });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      applicationId: `app_${Date.now()}`,
      message: "Application submitted successfully",
    }, { status: 201 });

  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to submit application",
    }, { status: 500 });
  }
}

// GET endpoint to retrieve applications for a job
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({
        success: false,
        message: "jobId is required",
      }, { status: 400 });
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

    return NextResponse.json({
      success: true,
      applications: mockApplications,
      total: mockApplications.length,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch applications",
    }, { status: 500 });
  }
}

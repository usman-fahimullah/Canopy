import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext } from "@/lib/access-control";
import { parseResume } from "@/lib/ai/resume-parser";

/**
 * POST /api/canopy/resume-parse
 *
 * Trigger resume parsing for a specific seeker profile.
 * Downloads the resume from Supabase Storage, extracts text,
 * sends to Claude API for structured extraction, and updates
 * the SeekerProfile with parsed data.
 *
 * Auth: requires org membership.
 * Body: { seekerId: string, resumeUrl: string }
 * Returns: { data: ParsedResume }
 */
const ParseResumeSchema = z.object({
  seekerId: z.string().min(1),
  resumeUrl: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = ParseResumeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { seekerId, resumeUrl } = result.data;

    // Verify the seeker exists and has an application within this org
    const application = await prisma.application.findFirst({
      where: {
        seekerId,
        job: { organizationId: ctx.organizationId },
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Candidate not found in your organization" },
        { status: 404 }
      );
    }

    // Parse the resume
    const parsed = await parseResume(resumeUrl);

    // Update SeekerProfile with parsed data
    await prisma.seekerProfile.update({
      where: { id: seekerId },
      data: {
        skills: parsed.skills,
        greenSkills: parsed.greenSkills,
        certifications: parsed.certifications,
        yearsExperience: parsed.yearsExperience,
        aiSummary: parsed.summary,
      },
    });

    logger.info("Resume parsed and profile updated", {
      seekerId,
      organizationId: ctx.organizationId,
      skillsCount: parsed.skills.length,
      greenSkillsCount: parsed.greenSkills.length,
      endpoint: "POST /api/canopy/resume-parse",
    });

    return NextResponse.json({ data: parsed }, { status: 200 });
  } catch (error) {
    logger.error("Resume parsing failed", {
      error: formatError(error),
      endpoint: "POST /api/canopy/resume-parse",
    });
    return NextResponse.json(
      { error: "Failed to parse resume. Please try again." },
      { status: 500 }
    );
  }
}

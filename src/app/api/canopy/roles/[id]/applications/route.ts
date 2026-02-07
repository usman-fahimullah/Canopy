import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";

/**
 * POST /api/canopy/roles/[id]/applications
 *
 * Add a candidate to a role from the employer side.
 * Creates Account + SeekerProfile (if they don't exist) and an Application.
 * Org-scoped: validates the job belongs to the authenticated user's org.
 */
const CreateCandidateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional().default(""),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional().default(""),
  city: z.string().optional().default(""),
  country: z.string().optional().default(""),
  pronouns: z.string().optional().default(""),
  linkedinUrl: z.string().optional().default(""),
  websiteUrl: z.string().optional().default(""),
  headline: z.string().optional().default(""),
  source: z.string().optional().default("employer_added"),
  resumeUrl: z.string().url().optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params;

    // 1. Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get Account
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // 3. Get org membership
    const membership = await prisma.organizationMember.findFirst({
      where: { accountId: account.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "Organization membership required" }, { status: 403 });
    }

    // 4. Verify job belongs to org
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        organizationId: membership.organizationId,
      },
      select: { id: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // 5. Validate input
    const body = await request.json();
    const result = CreateCandidateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const data = result.data;
    const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");

    // 6. Build location string from city + country
    const locationParts = [data.city, data.country].filter(Boolean);
    const location = locationParts.length > 0 ? locationParts.join(", ") : undefined;

    // 7. Create Account + SeekerProfile + Application in transaction
    const candidate = await prisma.$transaction(async (tx) => {
      // Check if account already exists by email
      let candidateAccount = await tx.account.findUnique({
        where: { email: data.email },
      });

      if (candidateAccount) {
        // Update existing account with any new info provided
        candidateAccount = await tx.account.update({
          where: { id: candidateAccount.id },
          data: {
            ...(fullName && !candidateAccount.name ? { name: fullName } : {}),
            ...(data.phone && !candidateAccount.phone ? { phone: data.phone } : {}),
            ...(location && !candidateAccount.location ? { location } : {}),
            ...(data.pronouns && !candidateAccount.pronouns ? { pronouns: data.pronouns } : {}),
            ...(data.linkedinUrl && !candidateAccount.linkedinUrl
              ? { linkedinUrl: data.linkedinUrl }
              : {}),
            ...(data.websiteUrl && !candidateAccount.websiteUrl
              ? { websiteUrl: data.websiteUrl }
              : {}),
          },
        });
      } else {
        // Create placeholder account (candidate hasn't signed up yet)
        candidateAccount = await tx.account.create({
          data: {
            supabaseId: `placeholder_${crypto.randomUUID()}`,
            email: data.email,
            name: fullName || undefined,
            phone: data.phone || undefined,
            location,
            pronouns: data.pronouns || undefined,
            linkedinUrl: data.linkedinUrl || undefined,
            websiteUrl: data.websiteUrl || undefined,
            entryIntent: "talent",
          },
        });
      }

      // Ensure seeker profile exists
      let seekerProfile = await tx.seekerProfile.findUnique({
        where: { accountId: candidateAccount.id },
      });

      if (seekerProfile) {
        // Update headline and resumeUrl if provided and not already set
        const seekerUpdates: Record<string, string> = {};
        if (data.headline && !seekerProfile.headline) seekerUpdates.headline = data.headline;
        if (data.resumeUrl && !seekerProfile.resumeUrl) seekerUpdates.resumeUrl = data.resumeUrl;

        if (Object.keys(seekerUpdates).length > 0) {
          seekerProfile = await tx.seekerProfile.update({
            where: { id: seekerProfile.id },
            data: seekerUpdates,
          });
        }
      } else {
        seekerProfile = await tx.seekerProfile.create({
          data: {
            accountId: candidateAccount.id,
            headline: data.headline || undefined,
            resumeUrl: data.resumeUrl || undefined,
          },
        });
      }

      // Create application (will fail if duplicate due to @@unique constraint)
      const application = await tx.application.create({
        data: {
          seekerId: seekerProfile.id,
          jobId,
          stage: "applied",
          stageOrder: 0,
          source: data.source || "employer_added",
        },
        include: {
          seeker: {
            include: {
              account: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      return application;
    });

    logger.info("Candidate added to role", {
      applicationId: candidate.id,
      jobId,
      seekerId: candidate.seekerId,
      organizationId: membership.organizationId,
      endpoint: "POST /api/canopy/roles/[id]/applications",
    });

    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    // Handle unique constraint violation (duplicate application)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This candidate has already been added to this role" },
        { status: 409 }
      );
    }

    logger.error("Error adding candidate to role", {
      error: formatError(error),
      endpoint: "POST /api/canopy/roles/[id]/applications",
    });

    return NextResponse.json({ error: "Failed to add candidate" }, { status: 500 });
  }
}

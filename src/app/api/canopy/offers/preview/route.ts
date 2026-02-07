import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { OfferPreviewSchema } from "@/lib/validators/offer";
import { safeJsonParse } from "@/lib/safe-json";

/**
 * POST /api/canopy/offers/preview
 * Generate a letter preview from offer data + org template.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const body = await request.json();
    const result = OfferPreviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const data = result.data;

    // Fetch application + job + org + candidate
    const application = await prisma.application.findUnique({
      where: { id: data.applicationId },
      include: {
        seeker: {
          include: {
            account: { select: { name: true, email: true } },
          },
        },
        job: {
          select: {
            title: true,
            organizationId: true,
            organization: {
              select: {
                name: true,
                logo: true,
                primaryColor: true,
                fontFamily: true,
                description: true,
                offerTemplate: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const org = application.job.organization;
    const candidate = application.seeker.account;
    const template = safeJsonParse<{ opening?: string; closing?: string; signingInstructions?: string }>(
      org.offerTemplate,
      {}
    );

    // Generate letter content
    const salaryFormatted = data.salary
      ? `$${(data.salary / 100).toLocaleString("en-US")}`
      : "To be discussed";

    const startDateFormatted = data.startDate
      ? new Date(data.startDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "To be confirmed";

    const letterContent = `
<div style="font-family: ${org.fontFamily || "Inter"}, system-ui, sans-serif;">
  <div style="text-align: center; margin-bottom: 32px;">
    ${org.logo ? `<img src="${org.logo}" alt="${org.name}" style="height: 48px; margin-bottom: 12px;" />` : ""}
    <h1 style="color: ${org.primaryColor || "#0F766E"}; margin: 0;">${org.name}</h1>
  </div>

  <p>Dear ${candidate.name || "Candidate"},</p>

  <p>${template.opening || `We are delighted to extend an offer of employment to you at ${org.name}. After careful consideration, we believe your skills and experience make you an excellent fit for our team.`}</p>

  <h3 style="color: ${org.primaryColor || "#0F766E"};">Position Details</h3>
  <ul>
    <li><strong>Position:</strong> ${application.job.title}</li>
    ${data.department ? `<li><strong>Department:</strong> ${data.department}</li>` : ""}
    <li><strong>Compensation:</strong> ${salaryFormatted} per year</li>
    <li><strong>Start Date:</strong> ${startDateFormatted}</li>
  </ul>

  ${data.notes ? `<h3 style="color: ${org.primaryColor || "#0F766E"};">A Note From Your Future Team</h3><p>${data.notes}</p>` : ""}

  ${org.description ? `<h3 style="color: ${org.primaryColor || "#0F766E"};">About ${org.name}</h3><p>${org.description}</p>` : ""}

  <p>${template.closing || "We look forward to having you join our team and contribute to our mission. Please review the details above and proceed with the next steps below."}</p>

  <p>Warm regards,<br/><strong>${org.name}</strong></p>
</div>
    `.trim();

    return NextResponse.json({ letterContent, organization: { name: org.name, logo: org.logo, primaryColor: org.primaryColor } });
  } catch (error) {
    logger.error("Error generating offer preview", {
      error: formatError(error),
      endpoint: "/api/canopy/offers/preview",
    });
    return NextResponse.json({ error: "Failed to generate preview" }, { status: 500 });
  }
}

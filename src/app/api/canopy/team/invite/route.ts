import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { sendEmail, teamInviteEmail } from "@/lib/email";

const inviteSchema = z.object({
  invites: z
    .array(
      z.object({
        email: z.string().email("Invalid email address"),
        role: z.enum(["ADMIN", "RECRUITER", "HIRING_MANAGER", "MEMBER", "VIEWER"]),
      })
    )
    .min(1, "At least one invite is required")
    .max(20, "Maximum 20 invites at once"),
  departmentId: z.string().optional().nullable(),
});

// POST — Send team invitations
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 invite batches per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(5, `team-invite:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Verify caller is ADMIN of an organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        accountId: account.id,
        role: { in: ["ADMIN"] },
      },
      include: { organization: true },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Only organization admins can send invites" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = inviteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { invites, departmentId } = result.data;
    const org = membership.organization;
    const inviterName = account.name || account.email;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Validate departmentId if provided
    let validDepartmentId: string | null = null;
    if (departmentId) {
      const dept = await prisma.department.findFirst({
        where: { id: departmentId, organizationId: org.id, isActive: true },
        select: { id: true },
      });
      if (!dept) {
        return NextResponse.json(
          { error: "Department not found in organization" },
          { status: 422 }
        );
      }
      validDepartmentId = dept.id;
    }

    // Create invite records and send emails
    const created = [];
    for (const invite of invites) {
      // Skip if this email already has a pending invite for this org
      const existing = await prisma.teamInvite.findFirst({
        where: {
          organizationId: org.id,
          email: invite.email,
          status: "PENDING",
        },
      });

      if (existing) {
        continue; // Skip duplicate
      }

      const token = randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7-day expiry

      const teamInvite = await prisma.teamInvite.create({
        data: {
          organizationId: org.id,
          invitedById: account.id,
          email: invite.email,
          role: invite.role,
          departmentId: validDepartmentId,
          token,
          expiresAt,
          status: "PENDING",
        },
      });

      created.push(teamInvite);

      // Send email (non-blocking)
      const acceptUrl = `${appUrl}/invite/accept?token=${token}`;
      sendEmail(
        teamInviteEmail({
          recipientEmail: invite.email,
          inviterName,
          companyName: org.name,
          role: invite.role,
          acceptUrl,
        })
      ).catch((err) => {
        logger.error("Failed to send team invite email", {
          error: formatError(err),
          email: invite.email,
          endpoint: "/api/canopy/team/invite",
        });
      });
    }

    return NextResponse.json({ invites: created, count: created.length }, { status: 201 });
  } catch (error) {
    logger.error("Team invite error", {
      error: formatError(error),
      endpoint: "/api/canopy/team/invite",
    });
    return NextResponse.json({ error: "Failed to send invitations" }, { status: 500 });
  }
}

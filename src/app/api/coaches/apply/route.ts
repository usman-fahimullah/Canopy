import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { standardLimiter } from "@/lib/rate-limit";
import { getAuthenticatedAccount, isAdminAccount, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";
import { logger, formatError } from "@/lib/logger";
import { CoachApplySchema } from "@/lib/validators/api";

const VALID_COACH_STATUSES = ["PENDING", "APPROVED", "REJECTED", "ACTIVE", "PAUSED"] as const;
type CoachStatus = (typeof VALID_COACH_STATUSES)[number];

function isValidCoachStatus(value: string): value is CoachStatus {
  return (VALID_COACH_STATUSES as readonly string[]).includes(value);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 applications per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(3, `apply:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = CoachApplySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const {
      firstName,
      lastName,
      email,
      linkedinUrl,
      headline,
      bio,
      yearsInClimate,
      expertise,
      sectors,
      sessionRate,
      availability,
      motivation,
    } = result.data;


    // Check if user is already authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let account;

    if (user) {
      // User is logged in - find or use their account
      account = await prisma.account.findUnique({
        where: { supabaseId: user.id },
      });
    }

    if (!account) {
      // Check if email already exists
      const existingAccount = await prisma.account.findUnique({
        where: { email },
      });

      if (existingAccount) {
        // Check if they already have a coach profile
        const existingCoach = await prisma.coachProfile.findUnique({
          where: { accountId: existingAccount.id },
        });

        if (existingCoach) {
          return NextResponse.json(
            { error: "You have already submitted a coach application" },
            { status: 400 }
          );
        }

        account = existingAccount;
      } else {
        // Create new account (they'll need to verify email/set password later)
        account = await prisma.account.create({
          data: {
            supabaseId: `pending_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            email,
            name: `${firstName} ${lastName}`,
          },
        });
      }
    }

    // Check if coach profile already exists
    const existingCoach = await prisma.coachProfile.findUnique({
      where: { accountId: account.id },
    });

    if (existingCoach) {
      return NextResponse.json(
        { error: "You have already submitted a coach application" },
        { status: 400 }
      );
    }

    // Create coach profile with PENDING status
    const coachProfile = await prisma.coachProfile.create({
      data: {
        accountId: account.id,
        firstName,
        lastName,
        headline,
        bio,
        expertise,
        sectors,
        yearsInClimate,
        sessionRate,
        availability: JSON.stringify({ description: availability, motivation }),
        status: "PENDING",
        applicationDate: new Date(),
      },
    });

    // Update account name if not set
    if (!account.name) {
      await prisma.account.update({
        where: { id: account.id },
        data: { name: `${firstName} ${lastName}` },
      });
    }

    return NextResponse.json({
      success: true,
      coachId: coachProfile.id,
      message: "Application submitted successfully",
    });
  } catch (error) {
    logger.error("Coach application error", { error: formatError(error), endpoint: "/api/coaches/apply" });
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

// GET - List coach applications (for admin)
export async function GET(request: NextRequest) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return unauthorizedResponse();
    if (!isAdminAccount(account)) return forbiddenResponse();

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") || "PENDING";

    // Validate status against the CoachStatus enum
    const status: CoachStatus = isValidCoachStatus(statusParam) ? statusParam : "PENDING";

    const coaches = await prisma.coachProfile.findMany({
      where: {
        status,
      },
      include: {
        account: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        applicationDate: "desc",
      },
      take: 100,
    });

    return NextResponse.json({ coaches });
  } catch (error) {
    logger.error("Fetch applications error", { error: formatError(error), endpoint: "/api/coaches/apply" });
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

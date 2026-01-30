import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !linkedinUrl || !headline || !bio || !expertise?.length || !sectors?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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
    console.error("Coach application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

// GET - List coach applications (for admin)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // TODO: Add proper admin check
    // For now, just return applications

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";

    const coaches = await prisma.coachProfile.findMany({
      where: {
        status: status as any,
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
    });

    return NextResponse.json({ coaches });
  } catch (error) {
    console.error("Fetch applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

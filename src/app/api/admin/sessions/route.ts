import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// GET — list all sessions with filters (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const coachId = searchParams.get("coachId") || "";
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }
    if (coachId) {
      where.coachId = coachId;
    }
    if (from || to) {
      where.scheduledAt = {};
      if (from) {
        (where.scheduledAt as Record<string, unknown>).gte = new Date(from);
      }
      if (to) {
        (where.scheduledAt as Record<string, unknown>).lte = new Date(to);
      }
    }

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        include: {
          coach: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              photoUrl: true,
            },
          },
          mentee: {
            include: {
              account: {
                select: { name: true, avatar: true },
              },
            },
          },
          booking: {
            select: {
              id: true,
              amount: true,
              platformFee: true,
              coachPayout: true,
              status: true,
            },
          },
          review: {
            select: { id: true, rating: true },
          },
        },
        orderBy: { scheduledAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.session.count({ where }),
    ]);

    const result = sessions.map((s) => ({
      id: s.id,
      scheduledAt: s.scheduledAt.toISOString(),
      duration: s.duration,
      status: s.status,
      coachName: `${s.coach.firstName || ""} ${s.coach.lastName || ""}`.trim(),
      coachAvatar: s.coach.photoUrl,
      coachId: s.coach.id,
      menteeName: s.mentee.account.name || "Unknown",
      menteeAvatar: s.mentee.account.avatar,
      bookingAmount: s.booking?.amount || 0,
      platformFee: s.booking?.platformFee || 0,
      bookingStatus: s.booking?.status || null,
      hasReview: !!s.review,
      reviewRating: s.review?.rating || null,
      cancelledBy: s.cancelledBy,
      cancellationReason: s.cancellationReason,
    }));

    return NextResponse.json({
      sessions: result,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin sessions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

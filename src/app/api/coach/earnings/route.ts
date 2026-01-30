import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// GET — coach earnings: total, monthly breakdown, pending payouts
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { coachProfile: true },
    });

    if (!account?.coachProfile) {
      return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });
    }

    const coachId = account.coachProfile.id;

    // Total earnings from profile
    const totalEarnings = account.coachProfile.totalEarnings;
    const totalSessions = account.coachProfile.totalSessions;

    // Get paid bookings for monthly breakdown
    const bookings = await prisma.booking.findMany({
      where: {
        coachId,
        status: { in: ["PAID", "REFUNDED", "PARTIALLY_REFUNDED"] },
      },
      select: {
        coachPayout: true,
        paidAt: true,
        status: true,
        refundAmount: true,
      },
      orderBy: { paidAt: "desc" },
    });

    // Monthly breakdown (last 6 months)
    const monthlyBreakdown: { month: string; earnings: number; sessions: number }[] = [];
    const now = new Date();

    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;

      const monthBookings = bookings.filter((b) => {
        if (!b.paidAt) return false;
        return b.paidAt >= monthDate && b.paidAt <= monthEnd;
      });

      monthlyBreakdown.push({
        month: monthKey,
        earnings: monthBookings.reduce((sum, b) => sum + b.coachPayout, 0),
        sessions: monthBookings.length,
      });
    }

    // Pending payouts (sessions completed but not yet transferred)
    const pendingPayouts = await prisma.booking.aggregate({
      where: {
        coachId,
        status: "PAID",
        stripeTransferId: null,
      },
      _sum: { coachPayout: true },
      _count: true,
    });

    return NextResponse.json({
      totalEarnings,
      totalSessions,
      monthlyBreakdown,
      pendingPayouts: {
        amount: pendingPayouts._sum.coachPayout || 0,
        count: pendingPayouts._count || 0,
      },
    });
  } catch (error) {
    console.error("Fetch earnings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch earnings" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { softDelete } from "@/lib/soft-delete";
import { logger, formatError } from "@/lib/logger";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 403 });
    }

    // Verify the review exists and user is the author (mentee)
    const review = await prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        mentee: { select: { accountId: true } },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.mentee.accountId !== account.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await softDelete("review", id, account.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error soft-deleting review", {
      error: formatError(error),
      endpoint: "/api/canopy/reviews/[id]/delete",
    });
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

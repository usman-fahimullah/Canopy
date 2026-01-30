import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// POST — flag a review with reason
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params;
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

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const body = await request.json();
    const { reason } = body;

    if (!reason?.trim()) {
      return NextResponse.json({ error: "Flag reason is required" }, { status: 400 });
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        isFlagged: true,
        flagReason: reason.trim(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Flag review error:", error);
    return NextResponse.json(
      { error: "Failed to flag review" },
      { status: 500 }
    );
  }
}

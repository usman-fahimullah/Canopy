import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";

// GET — get computed available slots for a coach
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ coachId: string }> }
) {
  try {
    const { coachId } = await params;
    const { searchParams } = new URL(request.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json(
        { error: "from and to query params are required (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Limit range to 30 days
    const daysDiff = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 30) {
      return NextResponse.json(
        { error: "Date range cannot exceed 30 days" },
        { status: 400 }
      );
    }

    const slots = await getAvailableSlots(coachId, fromDate, toDate);

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Fetch available slots error:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}

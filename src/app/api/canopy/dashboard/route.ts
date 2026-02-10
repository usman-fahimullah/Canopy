import { NextResponse } from "next/server";
import { logger, formatError } from "@/lib/logger";
import { getAuthContext } from "@/lib/access-control";
import { fetchDashboardData } from "@/lib/services/dashboard";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await fetchDashboardData(ctx);
    return NextResponse.json(data);
  } catch (error) {
    logger.error("Error fetching dashboard data", {
      error: formatError(error),
      endpoint: "/api/canopy/dashboard",
    });
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}

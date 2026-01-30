import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET — health check to test database connectivity
export async function GET() {
  try {
    const start = Date.now();
    const count = await prisma.seekerProfile.count();
    const elapsed = Date.now() - start;

    return NextResponse.json({
      status: "ok",
      database: "connected",
      seekerProfileCount: count,
      queryTimeMs: elapsed,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + "...",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: message,
        env: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + "...",
        },
      },
      { status: 500 }
    );
  }
}

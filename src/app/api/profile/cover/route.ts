import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// POST — upload cover image
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(10, `cover-upload:${ip}`);
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
      include: { seekerProfile: { select: { id: true, coverImage: true } } },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (!account.seekerProfile) {
      return NextResponse.json({ error: "Seeker profile not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are allowed." },
        { status: 422 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be 5MB or less." }, { status: 422 });
    }

    const ext = file.type.split("/")[1] || "jpg";
    const timestamp = Date.now();
    const path = `${account.id}/cover-${timestamp}.${ext}`;

    let adminClient;
    try {
      adminClient = createAdminClient();
    } catch (configError) {
      logger.error("Supabase admin client not configured", {
        error: formatError(configError),
        endpoint: "/api/profile/cover",
      });
      return NextResponse.json(
        { error: "Storage service is not configured. Please contact support." },
        { status: 503 }
      );
    }

    // Delete old custom cover if it exists in storage
    const oldCover = account.seekerProfile.coverImage;
    if (oldCover && oldCover.includes("covers/")) {
      try {
        const url = new URL(oldCover);
        const pathMatch = url.pathname.match(/covers\/(.+)/);
        if (pathMatch) {
          await adminClient.storage.from("covers").remove([pathMatch[1]]);
        }
      } catch {
        // Ignore deletion errors for old files
      }
    }

    const { error: uploadError } = await adminClient.storage
      .from("covers")
      .upload(path, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      logger.error("Cover upload failed", {
        error: formatError(uploadError),
        uploadErrorMessage: uploadError.message,
        endpoint: "/api/profile/cover",
        accountId: account.id,
      });
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const { data: urlData } = adminClient.storage.from("covers").getPublicUrl(path);

    // Store the full URL as coverImage (not a preset ID)
    await prisma.seekerProfile.update({
      where: { id: account.seekerProfile.id },
      data: { coverImage: urlData.publicUrl },
    });

    logger.info("Cover image uploaded", {
      accountId: account.id,
      endpoint: "/api/profile/cover",
    });

    return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Cover upload error", {
      error: formatError(error),
      message,
      endpoint: "/api/profile/cover",
    });
    return NextResponse.json({ error: `Failed to upload cover: ${message}` }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { AVATAR_PRESET_SRCS } from "@/lib/profile/avatar-presets";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for images
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// POST — upload profile photo
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(10, `photo-upload:${ip}`);
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
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed." },
        { status: 422 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be 5MB or less." }, { status: 422 });
    }

    // Generate a unique filename with extension
    const ext = file.type.split("/")[1] || "jpg";
    const timestamp = Date.now();
    const path = `${account.id}/avatar-${timestamp}.${ext}`;

    // Upload to Supabase storage using admin client (bypasses RLS)
    let adminClient;
    try {
      adminClient = createAdminClient();
    } catch (configError) {
      logger.error("Supabase admin client not configured", {
        error: formatError(configError),
        endpoint: "/api/profile/photo",
      });
      return NextResponse.json(
        { error: "Storage service is not configured. Please contact support." },
        { status: 503 }
      );
    }

    const { error: uploadError } = await adminClient.storage
      .from("avatars")
      .upload(path, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      logger.error("Photo upload failed", {
        error: formatError(uploadError),
        uploadErrorMessage: uploadError.message,
        endpoint: "/api/profile/photo",
        accountId: account.id,
      });
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    // Get the public URL
    const { data: urlData } = adminClient.storage.from("avatars").getPublicUrl(path);

    // Update account with new avatar URL
    await prisma.account.update({
      where: { id: account.id },
      data: { avatar: urlData.publicUrl },
    });

    logger.info("Profile photo uploaded", {
      accountId: account.id,
      endpoint: "/api/profile/photo",
    });

    return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Photo upload error", {
      error: formatError(error),
      message,
      endpoint: "/api/profile/photo",
    });
    return NextResponse.json({ error: `Failed to upload photo: ${message}` }, { status: 500 });
  }
}

// PATCH — select a preset avatar
const selectPresetSchema = z.object({
  avatarSrc: z.string().min(1),
});

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = selectPresetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { avatarSrc } = parsed.data;

    if (!AVATAR_PRESET_SRCS.has(avatarSrc)) {
      return NextResponse.json({ error: "Invalid avatar preset" }, { status: 422 });
    }

    await prisma.account.update({
      where: { id: account.id },
      data: { avatar: avatarSrc },
    });

    logger.info("Avatar preset selected", {
      accountId: account.id,
      avatarSrc,
      endpoint: "/api/profile/photo",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Avatar preset selection error", {
      error: formatError(error),
      endpoint: "/api/profile/photo",
    });
    return NextResponse.json({ error: "Failed to update avatar" }, { status: 500 });
  }
}

// DELETE — remove profile photo
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // If there's an existing avatar URL, try to delete the file from storage
    if (account.avatar && account.avatar.includes("avatars/")) {
      try {
        const adminClient = createAdminClient();
        // Extract the path from the URL
        const url = new URL(account.avatar);
        const pathMatch = url.pathname.match(/avatars\/(.+)/);
        if (pathMatch) {
          await adminClient.storage.from("avatars").remove([pathMatch[1]]);
        }
      } catch {
        // Ignore deletion errors for old files
      }
    }

    // Clear the avatar from the account
    await prisma.account.update({
      where: { id: account.id },
      data: { avatar: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Photo delete error", {
      error: formatError(error),
      endpoint: "/api/profile/photo",
    });
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}

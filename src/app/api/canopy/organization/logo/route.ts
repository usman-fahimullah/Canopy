import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/access-control";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

/**
 * POST /api/canopy/organization/logo
 *
 * Upload organization logo. ADMIN only.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(10, `logo-upload:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (ctx.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update organization logo" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and SVG images are allowed." },
        { status: 422 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be 5MB or less." }, { status: 422 });
    }

    const ext = file.type === "image/svg+xml" ? "svg" : file.type.split("/")[1] || "png";
    const timestamp = Date.now();
    const path = `${ctx.organizationId}/logo-${timestamp}.${ext}`;

    let adminClient;
    try {
      adminClient = createAdminClient();
    } catch (configError) {
      logger.error("Supabase admin client not configured", {
        error: formatError(configError),
        endpoint: "/api/canopy/organization/logo",
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
      logger.error("Logo upload failed", {
        error: formatError(uploadError),
        uploadErrorMessage: uploadError.message,
        endpoint: "/api/canopy/organization/logo",
        organizationId: ctx.organizationId,
      });
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const { data: urlData } = adminClient.storage.from("avatars").getPublicUrl(path);

    await prisma.organization.update({
      where: { id: ctx.organizationId },
      data: { logo: urlData.publicUrl },
    });

    logger.info("Organization logo uploaded", {
      organizationId: ctx.organizationId,
      updatedBy: ctx.accountId,
      endpoint: "/api/canopy/organization/logo",
    });

    return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });
  } catch (error) {
    logger.error("Logo upload error", {
      error: formatError(error),
      endpoint: "/api/canopy/organization/logo",
    });
    return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 });
  }
}

/**
 * DELETE /api/canopy/organization/logo
 *
 * Remove organization logo. ADMIN only.
 */
export async function DELETE() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (ctx.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update organization logo" },
        { status: 403 }
      );
    }

    const org = await prisma.organization.findUnique({
      where: { id: ctx.organizationId },
      select: { logo: true },
    });

    if (org?.logo && org.logo.includes("avatars/")) {
      try {
        const adminClient = createAdminClient();
        const url = new URL(org.logo);
        const pathMatch = url.pathname.match(/avatars\/(.+)/);
        if (pathMatch) {
          await adminClient.storage.from("avatars").remove([pathMatch[1]]);
        }
      } catch {
        // Ignore deletion errors for old files
      }
    }

    await prisma.organization.update({
      where: { id: ctx.organizationId },
      data: { logo: null },
    });

    logger.info("Organization logo removed", {
      organizationId: ctx.organizationId,
      updatedBy: ctx.accountId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Logo delete error", {
      error: formatError(error),
      endpoint: "/api/canopy/organization/logo",
    });
    return NextResponse.json({ error: "Failed to delete logo" }, { status: 500 });
  }
}

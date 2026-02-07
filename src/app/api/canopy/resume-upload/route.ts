import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

/**
 * POST /api/canopy/resume-upload
 *
 * Employer-side resume upload. Uploads a resume file to Supabase Storage
 * and returns the public URL. Used by the AddCandidateModal when an employer
 * attaches a resume while manually adding a candidate.
 *
 * Auth: requires org membership.
 * Accepts: multipart/form-data with a "file" field.
 * Returns: { url: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success: rateLimitOk } = await standardLimiter.check(5, `resume-upload:${ip}`);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    // Auth check
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

    // Verify org membership
    const membership = await prisma.organizationMember.findFirst({
      where: { accountId: account.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "Organization membership required" }, { status: 403 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const ext = `.${(file.name.split(".").pop() || "").toLowerCase()}`;
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: "Only PDF, DOC, and DOCX files are allowed." },
        { status: 422 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be 5MB or less." }, { status: 422 });
    }

    // Upload to Supabase Storage
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `employer-uploads/${membership.organizationId}/${timestamp}-${safeName}`;

    const adminClient = createAdminClient();
    const { error: uploadError } = await adminClient.storage
      .from("resumes")
      .upload(storagePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      logger.error("Resume upload failed", {
        error: formatError(uploadError),
        organizationId: membership.organizationId,
        endpoint: "POST /api/canopy/resume-upload",
      });
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = adminClient.storage.from("resumes").getPublicUrl(storagePath);

    logger.info("Resume uploaded by employer", {
      organizationId: membership.organizationId,
      accountId: account.id,
      fileName: file.name,
      fileSize: file.size,
      endpoint: "POST /api/canopy/resume-upload",
    });

    return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });
  } catch (error) {
    logger.error("Resume upload error", {
      error: formatError(error),
      endpoint: "POST /api/canopy/resume-upload",
    });
    return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { z } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["application/pdf"];

const FileTypeSchema = z.enum(["resume", "cover_letter"]);

// GET — list uploaded files (resume, cover letter URLs)
export async function GET() {
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
      include: { seekerProfile: true },
    });

    if (!account?.seekerProfile) {
      return NextResponse.json({ error: "Seeker profile not found" }, { status: 404 });
    }

    const files = {
      resumeUrl: account.seekerProfile.resumeUrl,
      coverLetterUrl: account.seekerProfile.coverLetterUrl,
    };

    return NextResponse.json({ files });
  } catch (error) {
    logger.error("Fetch files error", {
      error: formatError(error),
      endpoint: "/api/profile/files",
    });
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

// POST — upload resume or cover letter
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(5, `file-upload:${ip}`);
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
      include: { seekerProfile: true },
    });

    if (!account?.seekerProfile) {
      return NextResponse.json({ error: "Seeker profile not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileType = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const typeResult = FileTypeSchema.safeParse(fileType);
    if (!typeResult.success) {
      return NextResponse.json(
        { error: "Invalid file type. Must be 'resume' or 'cover_letter'." },
        { status: 422 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 422 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be 1MB or less." }, { status: 422 });
    }

    const seekerId = account.seekerProfile.id;
    const bucket = typeResult.data === "resume" ? "resumes" : "cover-letters";
    const ext = file.name.split(".").pop() || "pdf";
    const path = `${seekerId}/${typeResult.data}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      logger.error("File upload failed", {
        error: formatError(uploadError),
        endpoint: "/api/profile/files",
      });
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

    // Update seeker profile with file URL
    const updateField = typeResult.data === "resume" ? "resumeUrl" : "coverLetterUrl";
    await prisma.seekerProfile.update({
      where: { id: seekerId },
      data: { [updateField]: urlData.publicUrl },
    });

    return NextResponse.json({ url: urlData.publicUrl, type: typeResult.data }, { status: 201 });
  } catch (error) {
    logger.error("File upload error", {
      error: formatError(error),
      endpoint: "/api/profile/files",
    });
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

// DELETE — remove uploaded file
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
      include: { seekerProfile: true },
    });

    if (!account?.seekerProfile) {
      return NextResponse.json({ error: "Seeker profile not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const fileType = searchParams.get("type");

    const typeResult = FileTypeSchema.safeParse(fileType);
    if (!typeResult.success) {
      return NextResponse.json(
        { error: "Invalid file type. Must be 'resume' or 'cover_letter'." },
        { status: 422 }
      );
    }

    const seekerId = account.seekerProfile.id;
    const bucket = typeResult.data === "resume" ? "resumes" : "cover-letters";
    const path = `${seekerId}/${typeResult.data}.pdf`;

    await supabase.storage.from(bucket).remove([path]);

    // Clear the URL from the seeker profile
    const updateField = typeResult.data === "resume" ? "resumeUrl" : "coverLetterUrl";
    await prisma.seekerProfile.update({
      where: { id: seekerId },
      data: { [updateField]: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("File delete error", {
      error: formatError(error),
      endpoint: "/api/profile/files",
    });
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}

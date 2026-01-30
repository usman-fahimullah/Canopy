// File storage service for Candid
// Uses Supabase Storage for file uploads

import { createClient } from "@/lib/supabase/client";

const BUCKETS = {
  avatars: "avatars",
  messageAttachments: "message-attachments",
  resumes: "resumes",
} as const;

type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

/**
 * Upload a file to Supabase Storage
 * Returns the public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  bucket: BucketName,
  path: string
): Promise<{ url: string; error?: string }> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("[Storage] Upload failed:", error);
    return { url: "", error: error.message };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { url: urlData.publicUrl };
}

/**
 * Upload a profile photo/avatar
 */
export async function uploadProfilePhoto(
  file: File,
  accountId: string
): Promise<{ url: string; error?: string }> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${accountId}/avatar.${ext}`;
  return uploadFile(file, BUCKETS.avatars, path);
}

/**
 * Upload a message attachment
 */
export async function uploadMessageAttachment(
  file: File,
  conversationId: string
): Promise<{ url: string; error?: string }> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `${conversationId}/${timestamp}-${safeName}`;
  return uploadFile(file, BUCKETS.messageAttachments, path);
}

/**
 * Upload a resume
 */
export async function uploadResume(
  file: File,
  seekerId: string
): Promise<{ url: string; error?: string }> {
  const ext = file.name.split(".").pop() || "pdf";
  const path = `${seekerId}/resume.${ext}`;
  return uploadFile(file, BUCKETS.resumes, path);
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  bucket: BucketName,
  path: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error("[Storage] Delete failed:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export { BUCKETS };

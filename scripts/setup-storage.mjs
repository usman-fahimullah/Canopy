#!/usr/bin/env node

/**
 * Supabase Storage Setup Script
 *
 * Creates all required storage buckets and applies RLS policies.
 * Run once when setting up a new environment, or to verify existing setup.
 *
 * Usage:
 *   node scripts/setup-storage.mjs
 *
 * Requires these env vars (reads from .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load env vars from .env.local
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      // Strip quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local not found, rely on existing env vars
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${SERVICE_KEY}`,
  apikey: SERVICE_KEY,
  "Content-Type": "application/json",
};

/**
 * Bucket definitions:
 * - public: true  = anyone can read via /storage/v1/object/public/...
 * - public: false = requires auth to read (used for sensitive files)
 */
const BUCKETS = [
  {
    name: "avatars",
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
  {
    name: "resumes",
    public: false, // Resumes should require auth to download
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["application/pdf"],
  },
  {
    name: "cover-letters",
    public: false, // Cover letters should require auth to download
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["application/pdf"],
  },
  {
    name: "message-attachments",
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      "image/jpeg", "image/png", "image/webp", "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
];

/**
 * RLS policies for storage.objects.
 *
 * These are applied via SQL since the Storage API doesn't expose
 * policy management. We use the Supabase SQL endpoint.
 */
const POLICIES_SQL = `
-- Allow public read access for public buckets (avatars)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Public read access for avatars'
  ) THEN
    CREATE POLICY "Public read access for avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');
  END IF;
END $$;

-- Allow authenticated users to upload to avatars
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Authenticated users can upload avatars'
  ) THEN
    CREATE POLICY "Authenticated users can upload avatars"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- Allow authenticated users to update their avatars
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Authenticated users can update avatars'
  ) THEN
    CREATE POLICY "Authenticated users can update avatars"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- Allow authenticated users to delete their avatars
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Authenticated users can delete avatars'
  ) THEN
    CREATE POLICY "Authenticated users can delete avatars"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- Allow authenticated users to manage resumes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Authenticated users can manage resumes'
  ) THEN
    CREATE POLICY "Authenticated users can manage resumes"
    ON storage.objects FOR ALL
    USING (bucket_id = 'resumes' AND auth.role() = 'authenticated')
    WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- Allow authenticated users to manage cover letters
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Authenticated users can manage cover letters'
  ) THEN
    CREATE POLICY "Authenticated users can manage cover letters"
    ON storage.objects FOR ALL
    USING (bucket_id = 'cover-letters' AND auth.role() = 'authenticated')
    WITH CHECK (bucket_id = 'cover-letters' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- Allow authenticated users to manage message attachments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Authenticated users can manage message attachments'
  ) THEN
    CREATE POLICY "Authenticated users can manage message attachments"
    ON storage.objects FOR ALL
    USING (bucket_id = 'message-attachments' AND auth.role() = 'authenticated')
    WITH CHECK (bucket_id = 'message-attachments' AND auth.role() = 'authenticated');
  END IF;
END $$;
`;

async function createBucket(bucket) {
  // Check if bucket exists
  const checkRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${bucket.name}`, { headers });

  if (checkRes.ok) {
    const existing = await checkRes.json();
    console.log(`  [exists] ${bucket.name} (public: ${existing.public})`);

    // Update bucket settings if needed
    if (existing.public !== bucket.public) {
      console.log(`  [update] ${bucket.name}: changing public from ${existing.public} to ${bucket.public}`);
      await fetch(`${SUPABASE_URL}/storage/v1/bucket/${bucket.name}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          public: bucket.public,
          file_size_limit: bucket.fileSizeLimit,
          allowed_mime_types: bucket.allowedMimeTypes,
        }),
      });
    }
    return;
  }

  // Create bucket
  const createRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      id: bucket.name,
      name: bucket.name,
      public: bucket.public,
      file_size_limit: bucket.fileSizeLimit,
      allowed_mime_types: bucket.allowedMimeTypes,
    }),
  });

  if (createRes.ok) {
    console.log(`  [created] ${bucket.name} (public: ${bucket.public})`);
  } else {
    const err = await createRes.text();
    console.error(`  [error] ${bucket.name}: ${err}`);
  }
}

async function applyPolicies() {
  // Use the Supabase SQL endpoint (pg-meta)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ query: POLICIES_SQL }),
  });

  // The RPC endpoint might not be available, try the pg-meta SQL endpoint instead
  if (!res.ok) {
    // Try via the SQL endpoint (available in Supabase)
    const sqlRes = await fetch(`${SUPABASE_URL}/pg/sql`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: POLICIES_SQL }),
    });

    if (!sqlRes.ok) {
      console.log("\n  RLS policies could not be applied automatically.");
      console.log("  Please run the following SQL in the Supabase SQL Editor:\n");
      console.log("  --- Copy from scripts/setup-storage-policies.sql ---\n");
      return false;
    }
  }
  return true;
}

async function main() {
  console.log("=== Supabase Storage Setup ===\n");
  console.log(`URL: ${SUPABASE_URL}\n`);

  // Step 1: Create buckets
  console.log("1. Creating storage buckets...");
  for (const bucket of BUCKETS) {
    await createBucket(bucket);
  }

  // Step 2: Apply RLS policies
  console.log("\n2. Applying RLS policies...");
  const policiesApplied = await applyPolicies();
  if (policiesApplied) {
    console.log("  [ok] RLS policies applied successfully");
  }

  // Step 3: Verify
  console.log("\n3. Verifying buckets...");
  const bucketsRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, { headers });
  const buckets = await bucketsRes.json();
  for (const b of buckets) {
    const expected = BUCKETS.find(e => e.name === b.name);
    const status = expected ? "ok" : "unexpected";
    console.log(`  [${status}] ${b.name} | public: ${b.public}`);
  }

  const missing = BUCKETS.filter(e => !buckets.find(b => b.name === e.name));
  if (missing.length > 0) {
    console.log("\n  WARNING: Missing buckets:", missing.map(b => b.name).join(", "));
  }

  console.log("\n=== Setup Complete ===");
}

main().catch((e) => {
  console.error("Setup failed:", e.message);
  process.exit(1);
});

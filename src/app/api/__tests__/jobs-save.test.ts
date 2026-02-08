import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Hoisted mocks ───────────────────────────────────────────

const { mockPrisma, mockSupabase } = vi.hoisted(() => {
  const mockPrisma = {
    account: { findUnique: vi.fn() },
    job: { findUnique: vi.fn() },
    savedJob: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  };
  const mockSupabase = {
    auth: { getUser: vi.fn() },
  };
  return { mockPrisma, mockSupabase };
});

vi.mock("@/lib/db", () => ({ prisma: mockPrisma }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
}));

vi.mock("@/lib/logger", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  formatError: vi.fn((e: unknown) => (e instanceof Error ? e.message : String(e))),
}));

vi.mock("@/lib/validators/api", () => ({
  UpdateSavedJobNotesSchema: {
    safeParse: vi.fn().mockReturnValue({ success: true, data: { notes: undefined } }),
  },
}));

// ── Import handlers after mocks ─────────────────────────────

import { POST, DELETE, PATCH } from "../jobs/[id]/save/route";

// ── Fixtures ────────────────────────────────────────────────

const mockParams = Promise.resolve({ id: "job-1" });

// ── Tests ───────────────────────────────────────────────────

describe("POST /api/jobs/[id]/save", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "supabase-1" } },
    });
    mockPrisma.account.findUnique.mockResolvedValue({
      id: "account-1",
      seekerProfile: { id: "seeker-1" },
    });
    mockPrisma.job.findUnique.mockResolvedValue({ id: "job-1" });
    mockPrisma.savedJob.findUnique.mockResolvedValue(null);
    mockPrisma.savedJob.create.mockResolvedValue({
      jobId: "job-1",
      seekerId: "seeker-1",
      savedAt: new Date(),
      notes: null,
      job: {
        title: "Solar Engineer",
        organization: { name: "Solaris Energy Co." },
      },
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1/save", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: mockParams });
    expect(res.status).toBe(401);
  });

  it("returns 404 when seeker profile not found", async () => {
    mockPrisma.account.findUnique.mockResolvedValue({ id: "account-1", seekerProfile: null });
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1/save", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: mockParams });
    expect(res.status).toBe(404);
  });

  it("returns 404 when job not found", async () => {
    mockPrisma.job.findUnique.mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1/save", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: mockParams });
    expect(res.status).toBe(404);
  });

  it("returns 409 when job already saved", async () => {
    mockPrisma.savedJob.findUnique.mockResolvedValue({ seekerId: "seeker-1", jobId: "job-1" });
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1/save", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: mockParams });
    expect(res.status).toBe(409);
  });

  it("saves job successfully", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1/save", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: mockParams });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.message).toBe("Job saved successfully");
    expect(body.savedJob.jobTitle).toBe("Solar Engineer");
  });
});

describe("DELETE /api/jobs/[id]/save", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "supabase-1" } },
    });
    mockPrisma.account.findUnique.mockResolvedValue({
      id: "account-1",
      seekerProfile: { id: "seeker-1" },
    });
    mockPrisma.savedJob.delete.mockResolvedValue({});
  });

  it("returns 401 when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1/save", { method: "DELETE" });
    const res = await DELETE(req, { params: mockParams });
    expect(res.status).toBe(401);
  });

  it("unsaves job successfully", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1/save", { method: "DELETE" });
    const res = await DELETE(req, { params: mockParams });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.message).toBe("Job unsaved successfully");
  });

  it("returns 404 when job was not saved (P2025)", async () => {
    mockPrisma.savedJob.delete.mockRejectedValue({ code: "P2025" });
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1/save", { method: "DELETE" });
    const res = await DELETE(req, { params: mockParams });
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/jobs/[id]/save", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "supabase-1" } },
    });
    mockPrisma.account.findUnique.mockResolvedValue({
      id: "account-1",
      seekerProfile: { id: "seeker-1" },
    });
    mockPrisma.savedJob.update.mockResolvedValue({
      seekerId: "seeker-1",
      jobId: "job-1",
      notes: "Updated notes",
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1/save", {
      method: "PATCH",
      body: JSON.stringify({ notes: "test" }),
    });
    const res = await PATCH(req, { params: mockParams });
    expect(res.status).toBe(401);
  });

  it("updates notes successfully", async () => {
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1/save", {
      method: "PATCH",
      body: JSON.stringify({ notes: "Updated notes" }),
    });
    const res = await PATCH(req, { params: mockParams });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.message).toBe("Notes updated successfully");
  });

  it("returns 404 when saved job not found (P2025)", async () => {
    mockPrisma.savedJob.update.mockRejectedValue({ code: "P2025" });
    const req = new NextRequest("http://localhost:3000/api/jobs/job-1/save", {
      method: "PATCH",
      body: JSON.stringify({ notes: "test" }),
    });
    const res = await PATCH(req, { params: mockParams });
    expect(res.status).toBe(404);
  });
});

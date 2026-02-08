import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Hoisted mocks (available before vi.mock factories execute) ───

const { mockGetUser, mockPrisma } = vi.hoisted(() => {
  const mockGetUser = vi.fn();
  const mockPrisma = {
    account: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
    seekerProfile: {
      create: vi.fn(),
      update: vi.fn(),
    },
    coachProfile: {
      create: vi.fn(),
      update: vi.fn(),
    },
    organization: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    organizationMember: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    job: {
      create: vi.fn(),
    },
    teamInvite: {
      create: vi.fn().mockResolvedValue({}),
    },
    pathway: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    seekerPathway: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    workExperience: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn(),
  };
  return { mockGetUser, mockPrisma };
});

// ── Module mocks ─────────────────────────────────────────────────

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: () => mockGetUser() },
  }),
}));

vi.mock("@/lib/db", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  formatError: vi.fn((e: unknown) => (e instanceof Error ? e.message : String(e))),
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
  teamInviteEmail: vi.fn().mockReturnValue({
    to: "test@example.com",
    subject: "Invite",
    html: "<p>Invite</p>",
    text: "Invite",
  }),
}));

// ── Import handler after mocks ───────────────────────────────────

import { POST } from "../onboarding/route";

// ── Test fixtures ────────────────────────────────────────────────

const BASE_URL = "http://localhost:3000/api/onboarding";

const mockUser = {
  id: "supabase-user-1",
  email: "test@greenjobsboard.us",
  user_metadata: { name: "Test User" },
};

const mockAccount = {
  id: "account-1",
  supabaseId: "supabase-user-1",
  email: "test@greenjobsboard.us",
  name: "Test User",
  activeRoles: [],
  primaryRole: null,
  onboardingProgress: null,
  seekerProfile: null,
  coachProfile: null,
};

function makeRequest(body: unknown): NextRequest {
  return new NextRequest(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ── Tests ────────────────────────────────────────────────────────

describe("POST /api/onboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockPrisma.account.findUnique.mockResolvedValue(mockAccount);
    mockPrisma.account.update.mockResolvedValue(mockAccount);
    mockPrisma.$transaction.mockImplementation(
      async (cb: (tx: typeof mockPrisma) => Promise<unknown>) => cb(mockPrisma)
    );
    mockPrisma.organizationMember.findFirst.mockResolvedValue(null);
    mockPrisma.organization.findUnique.mockResolvedValue(null);
    mockPrisma.seekerProfile.create.mockResolvedValue({ id: "seeker-1" });
    mockPrisma.coachProfile.create.mockResolvedValue({ id: "coach-1" });
    mockPrisma.organization.create.mockResolvedValue({ id: "org-1" });
    mockPrisma.organizationMember.create.mockResolvedValue({ id: "member-1" });
    mockPrisma.job.create.mockResolvedValue({ id: "job-1" });
  });

  // ── Auth ──────────────────────────────────────────────────────

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = makeRequest({ action: "set-intent", entryIntent: "talent" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("creates account via upsert when account does not exist", async () => {
    mockPrisma.account.findUnique.mockResolvedValue(null);
    mockPrisma.account.upsert.mockResolvedValue(mockAccount);

    const req = makeRequest({ action: "set-intent", entryIntent: "talent" });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockPrisma.account.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { supabaseId: mockUser.id },
      })
    );
  });

  // ── Validation ────────────────────────────────────────────────

  it("returns 400 for invalid JSON body", async () => {
    const req = new NextRequest(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-valid-json{{{",
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid JSON body");
  });

  it("returns 400 for completely invalid body structure", async () => {
    const req = makeRequest({ action: "unknown-action", foo: "bar" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("Validation failed");
  });

  // ── set-intent ────────────────────────────────────────────────

  it("successfully sets intent for talent", async () => {
    const req = makeRequest({ action: "set-intent", entryIntent: "talent" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.action).toBe("set-intent");
    expect(mockPrisma.account.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "account-1" },
        data: expect.objectContaining({
          entryIntent: "talent",
        }),
      })
    );
  });

  it("successfully sets intent for coach", async () => {
    const req = makeRequest({ action: "set-intent", entryIntent: "coach" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.action).toBe("set-intent");
    expect(mockPrisma.account.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          entryIntent: "coach",
        }),
      })
    );
  });

  it("successfully sets intent for employer", async () => {
    const req = makeRequest({ action: "set-intent", entryIntent: "employer" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.action).toBe("set-intent");
    expect(mockPrisma.account.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          entryIntent: "employer",
        }),
      })
    );
  });

  // ── complete-profile ──────────────────────────────────────────

  it("successfully completes base profile", async () => {
    const req = makeRequest({
      action: "complete-profile",
      firstName: "Jane",
      lastName: "Doe",
      linkedinUrl: "https://linkedin.com/in/janedoe",
      bio: "Climate enthusiast",
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.action).toBe("complete-profile");
    expect(mockPrisma.account.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "Jane Doe",
          linkedinUrl: "https://linkedin.com/in/janedoe",
          bio: "Climate enthusiast",
        }),
      })
    );
  });

  // ── complete-role (talent) ────────────────────────────────────

  it("successfully completes talent role and creates seeker profile", async () => {
    const req = makeRequest({
      action: "complete-role",
      shell: "talent",
      firstName: "Jane",
      lastName: "Doe",
      skills: ["React", "Node.js"],
      sectors: ["Renewable Energy"],
      careerStage: "mid",
      yearsExperience: "3-7",
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.shell).toBe("talent");
    expect(mockPrisma.seekerProfile.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          accountId: "account-1",
          skills: ["React", "Node.js"],
        }),
      })
    );
  });

  // ── complete-role (employer) ──────────────────────────────────

  it("successfully completes employer role and creates organization + member", async () => {
    const req = makeRequest({
      action: "complete-role",
      shell: "employer",
      firstName: "Jane",
      lastName: "Doe",
      companyName: "Solaris Energy Co.",
      companyDescription: "A leading climate tech company",
      companyLocation: "San Francisco, CA",
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.shell).toBe("employer");
    expect(mockPrisma.organization.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "Solaris Energy Co.",
        }),
      })
    );
    expect(mockPrisma.organizationMember.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          accountId: "account-1",
          role: "ADMIN",
        }),
      })
    );
  });

  // ── complete-role (coach) ─────────────────────────────────────

  it("successfully completes coach role and creates coach profile", async () => {
    const req = makeRequest({
      action: "complete-role",
      shell: "coach",
      firstName: "Alex",
      lastName: "Smith",
      headline: "Climate Career Coach",
      expertise: ["Career Transition", "ESG Strategy"],
      sessionRate: 15000,
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.shell).toBe("coach");
    expect(mockPrisma.coachProfile.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          accountId: "account-1",
          firstName: "Alex",
          headline: "Climate Career Coach",
          status: "PENDING",
        }),
      })
    );
  });

  // ── Edge cases ────────────────────────────────────────────────

  it("handles missing email on auth user gracefully", async () => {
    mockPrisma.account.findUnique.mockResolvedValue(null);
    mockGetUser.mockResolvedValue({
      data: { user: { id: "supabase-user-1", email: null, user_metadata: {} } },
    });

    const req = makeRequest({ action: "set-intent", entryIntent: "talent" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("No email on auth user");
  });

  it("does not create duplicate org when employer already has membership", async () => {
    mockPrisma.organizationMember.findFirst.mockResolvedValue({
      organizationId: "existing-org-1",
      organization: { id: "existing-org-1", name: "Old Co" },
    });

    const req = makeRequest({
      action: "complete-role",
      shell: "employer",
      firstName: "Jane",
      lastName: "Doe",
      companyName: "Updated Company Name",
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(mockPrisma.organization.update).toHaveBeenCalled();
    expect(mockPrisma.organization.create).not.toHaveBeenCalled();
  });
});

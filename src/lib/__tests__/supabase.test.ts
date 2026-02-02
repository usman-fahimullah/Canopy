import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @supabase/ssr before importing
const mockCreateBrowserClient = vi.fn();
vi.mock("@supabase/ssr", () => ({
  createBrowserClient: mockCreateBrowserClient,
}));

describe("supabase/client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    mockCreateBrowserClient.mockReset();
  });

  it("exports a createClient function", async () => {
    mockCreateBrowserClient.mockReturnValue({ fake: "supabase" });
    const mod = await import("../supabase/client");
    expect(typeof mod.createClient).toBe("function");
  });

  it("calls createBrowserClient with env vars", async () => {
    const fakeClient = { auth: {}, from: vi.fn() };
    mockCreateBrowserClient.mockReturnValue(fakeClient);

    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key-123";

    const { createClient } = await import("../supabase/client");
    const client = createClient();

    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "anon-key-123"
    );
    expect(client).toEqual(fakeClient);
  });

  it("returns a new client instance each call", async () => {
    mockCreateBrowserClient
      .mockReturnValueOnce({ id: "client-1" })
      .mockReturnValueOnce({ id: "client-2" });

    const { createClient } = await import("../supabase/client");
    const first = createClient();
    const second = createClient();

    expect(first).not.toBe(second);
    expect(mockCreateBrowserClient).toHaveBeenCalledTimes(2);
  });
});

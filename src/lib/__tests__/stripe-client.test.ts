import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @stripe/stripe-js before importing the module under test
const mockLoadStripe = vi.fn();
vi.mock("@stripe/stripe-js", () => ({
  loadStripe: mockLoadStripe,
}));

describe("stripe/client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    mockLoadStripe.mockReset();
  });

  it("exports a getStripe function", async () => {
    mockLoadStripe.mockResolvedValue({ fake: "stripe" });
    const { getStripe } = await import("../stripe/client");
    expect(typeof getStripe).toBe("function");
  });

  it("calls loadStripe with the publishable key env var", async () => {
    const fakeStripe = { fake: "stripe-instance" };
    mockLoadStripe.mockResolvedValue(fakeStripe);

    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_123";
    const { getStripe } = await import("../stripe/client");

    const result = await getStripe();
    expect(mockLoadStripe).toHaveBeenCalledWith("pk_test_123");
    expect(result).toEqual(fakeStripe);
  });

  it("returns the same promise on subsequent calls (singleton)", async () => {
    mockLoadStripe.mockResolvedValue({ fake: "stripe" });

    const { getStripe } = await import("../stripe/client");

    const first = getStripe();
    const second = getStripe();
    expect(first).toBe(second);
    // loadStripe should only be called once
    expect(mockLoadStripe).toHaveBeenCalledTimes(1);
  });

  it("returns null when loadStripe resolves to null", async () => {
    mockLoadStripe.mockResolvedValue(null);

    const { getStripe } = await import("../stripe/client");
    const result = await getStripe();
    expect(result).toBeNull();
  });
});

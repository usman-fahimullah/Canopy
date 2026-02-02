import { describe, it, expect, beforeEach, vi } from "vitest";
import { rateLimit } from "../rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the limit", async () => {
    const limiter = rateLimit({ interval: 60000 });
    const result = await limiter.check(5, "user1");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("tracks request count correctly", async () => {
    const limiter = rateLimit({ interval: 60000 });
    await limiter.check(3, "user1");
    await limiter.check(3, "user1");
    const result = await limiter.check(3, "user1");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("blocks requests over the limit", async () => {
    const limiter = rateLimit({ interval: 60000 });
    await limiter.check(2, "user1");
    await limiter.check(2, "user1");
    const result = await limiter.check(2, "user1");
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks different tokens independently", async () => {
    const limiter = rateLimit({ interval: 60000 });
    await limiter.check(1, "user1");
    const result = await limiter.check(1, "user2");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("resets after interval expires", async () => {
    vi.useFakeTimers();
    const limiter = rateLimit({ interval: 1000 });
    await limiter.check(1, "user1");
    const blocked = await limiter.check(1, "user1");
    expect(blocked.success).toBe(false);
    vi.advanceTimersByTime(1001);
    const afterReset = await limiter.check(1, "user1");
    expect(afterReset.success).toBe(true);
    vi.useRealTimers();
  });

  it("returns reset timestamp in the future", async () => {
    const limiter = rateLimit({ interval: 60000 });
    const result = await limiter.check(5, "user1");
    expect(result.reset).toBeGreaterThan(Date.now() - 1);
  });

  it("uses default options when none provided", async () => {
    const limiter = rateLimit();
    const result = await limiter.check(10, "user1");
    expect(result.success).toBe(true);
  });
});
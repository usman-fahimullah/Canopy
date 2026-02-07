import { describe, it, expect, vi, beforeEach } from "vitest";

// Track constructor calls
let constructorCalls: Array<Record<string, unknown>> = [];

// Mock @prisma/client with a real class so `new PrismaClient(...)` works
vi.mock("@prisma/client", () => {
  class MockPrismaClient {
    $connect = vi.fn();
    $disconnect = vi.fn();
    $extends = vi.fn().mockReturnThis();
    account = {};
    job = {};

    constructor(opts?: Record<string, unknown>) {
      constructorCalls.push(opts ?? {});
    }
  }
  return { PrismaClient: MockPrismaClient };
});

describe("db", () => {
  beforeEach(() => {
    vi.resetModules();
    constructorCalls = [];
    // Clear cached global prisma so each test gets a fresh import
    const g = globalThis as unknown as { prisma?: unknown };
    delete g.prisma;
  });

  it("exports a db instance", async () => {
    const { db } = await import("../db");
    expect(db).toBeDefined();
    expect(db).not.toBeNull();
  });

  it("exports a prisma alias that equals db", async () => {
    const { db, prisma } = await import("../db");
    expect(prisma).toBe(db);
  });

  it("creates a PrismaClient instance", async () => {
    await import("../db");
    expect(constructorCalls.length).toBeGreaterThanOrEqual(1);
  });

  it("passes log configuration to PrismaClient", async () => {
    await import("../db");
    const opts = constructorCalls[0];
    expect(opts).toBeDefined();
    expect(opts).toHaveProperty("log");
    expect(Array.isArray(opts.log)).toBe(true);
  });

  it("uses error-only logging in production", async () => {
    vi.stubEnv("NODE_ENV", "production");

    // Also clear global cache
    const g = globalThis as unknown as { prisma?: unknown };
    delete g.prisma;
    constructorCalls = [];

    await import("../db");

    const opts = constructorCalls[0];
    expect(opts.log).toEqual(["error"]);

    vi.unstubAllEnvs();
  });
});

import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  apiSuccess,
  apiError,
  apiValidationError,
  apiNotFound,
  apiRateLimited,
} from "../api-response";

describe("apiSuccess", () => {
  it("returns 200 with data by default", async () => {
    const res = apiSuccess({ jobs: [] });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ jobs: [] });
  });

  it("supports custom status codes", async () => {
    const res = apiSuccess({ id: "new_item" }, 201);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual({ id: "new_item" });
  });
});

describe("apiError", () => {
  it("returns error message with status code", async () => {
    const res = apiError("Not found", 404);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toEqual({ error: "Not found" });
  });

  it("includes details when provided", async () => {
    const details = { field: "email", issue: "invalid" };
    const res = apiError("Validation failed", 422, details);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toBe("Validation failed");
    expect(body.details).toEqual(details);
  });

  it("omits details when not provided", async () => {
    const res = apiError("Server error", 500);
    const body = await res.json();
    expect(body).not.toHaveProperty("details");
  });
});

describe("apiValidationError", () => {
  it("returns 422 with flattened Zod errors", async () => {
    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(1),
    });

    const result = schema.safeParse({ email: "invalid", name: "" });
    if (result.success) throw new Error("Expected validation failure");

    const res = apiValidationError(result.error);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toBe("Validation failed");
    expect(body.details).toBeDefined();
    expect(body.details.fieldErrors).toBeDefined();
  });
});

describe("apiNotFound", () => {
  it("returns 404 with entity name", async () => {
    const res = apiNotFound("Coach");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Coach not found");
  });

  it("defaults to 'Resource' when no entity provided", async () => {
    const res = apiNotFound();
    const body = await res.json();
    expect(body.error).toBe("Resource not found");
  });
});

describe("apiRateLimited", () => {
  it("returns 429 with message", async () => {
    const res = apiRateLimited();
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toContain("Too many requests");
  });
});

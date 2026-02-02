import { describe, it, expect } from "vitest";
import {
  CreateReviewSchema, AdminReviewActionSchema, SendMessageSchema,
  CreateConversationSchema, CheckoutSchema, UpdateProfileSchema,
  CancelSessionSchema, CreateGoalSchema,
} from "../validators/api";

describe("CreateReviewSchema", () => {
  it("accepts valid review data", () => {
    const r = CreateReviewSchema.safeParse({ sessionId: "sess_123", rating: 4, comment: "Great!" });
    expect(r.success).toBe(true);
  });
  it("accepts review without optional comment", () => {
    expect(CreateReviewSchema.safeParse({ sessionId: "s1", rating: 3 }).success).toBe(true);
  });
  it("rejects missing sessionId", () => {
    expect(CreateReviewSchema.safeParse({ rating: 3 }).success).toBe(false);
  });
  it("rejects rating below 1", () => {
    expect(CreateReviewSchema.safeParse({ sessionId: "s1", rating: 0 }).success).toBe(false);
  });
  it("rejects rating above 5", () => {
    expect(CreateReviewSchema.safeParse({ sessionId: "s1", rating: 6 }).success).toBe(false);
  });
  it("rejects non-integer rating", () => {
    expect(CreateReviewSchema.safeParse({ sessionId: "s1", rating: 3.5 }).success).toBe(false);
  });
  it("rejects comment exceeding 2000 chars", () => {
    expect(CreateReviewSchema.safeParse({ sessionId: "s1", rating: 4, comment: "x".repeat(2001) }).success).toBe(false);
  });
});

describe("AdminReviewActionSchema", () => {
  it("accepts hide", () => { expect(AdminReviewActionSchema.safeParse({ reviewId: "r1", action: "hide" }).success).toBe(true); });
  it("accepts unhide", () => { expect(AdminReviewActionSchema.safeParse({ reviewId: "r1", action: "unhide" }).success).toBe(true); });
  it("accepts unflag", () => { expect(AdminReviewActionSchema.safeParse({ reviewId: "r1", action: "unflag" }).success).toBe(true); });
  it("rejects invalid action", () => { expect(AdminReviewActionSchema.safeParse({ reviewId: "r1", action: "delete" }).success).toBe(false); });
  it("rejects missing reviewId", () => { expect(AdminReviewActionSchema.safeParse({ action: "hide" }).success).toBe(false); });
});

describe("SendMessageSchema", () => {
  it("accepts message with content", () => { expect(SendMessageSchema.safeParse({ content: "Hello!" }).success).toBe(true); });
  it("accepts message with attachmentUrls", () => { expect(SendMessageSchema.safeParse({ attachmentUrls: ["https://example.com/f.pdf"] }).success).toBe(true); });
  it("accepts both", () => { expect(SendMessageSchema.safeParse({ content: "See", attachmentUrls: ["https://example.com/f.pdf"] }).success).toBe(true); });
  it("rejects empty message", () => { expect(SendMessageSchema.safeParse({}).success).toBe(false); });
  it("rejects whitespace-only content", () => { expect(SendMessageSchema.safeParse({ content: "   " }).success).toBe(false); });
  it("rejects invalid URLs", () => { expect(SendMessageSchema.safeParse({ attachmentUrls: ["bad"] }).success).toBe(false); });
});

describe("CreateConversationSchema", () => {
  it("accepts with initial message", () => { expect(CreateConversationSchema.safeParse({ recipientAccountId: "a1", initialMessage: "Hi" }).success).toBe(true); });
  it("accepts without initial message", () => { expect(CreateConversationSchema.safeParse({ recipientAccountId: "a1" }).success).toBe(true); });
  it("rejects missing recipientAccountId", () => { expect(CreateConversationSchema.safeParse({ initialMessage: "Hi" }).success).toBe(false); });
});

describe("CheckoutSchema", () => {
  it("accepts valid checkout", () => { expect(CheckoutSchema.safeParse({ coachId: "c1", sessionDate: "2025-03-15T10:00:00.000Z", sessionDuration: 60 }).success).toBe(true); });
  it("rejects invalid datetime", () => { expect(CheckoutSchema.safeParse({ coachId: "c1", sessionDate: "bad", sessionDuration: 60 }).success).toBe(false); });
  it("rejects duration below 15", () => { expect(CheckoutSchema.safeParse({ coachId: "c1", sessionDate: "2025-03-15T10:00:00.000Z", sessionDuration: 10 }).success).toBe(false); });
  it("rejects duration above 180", () => { expect(CheckoutSchema.safeParse({ coachId: "c1", sessionDate: "2025-03-15T10:00:00.000Z", sessionDuration: 200 }).success).toBe(false); });
});

describe("UpdateProfileSchema", () => {
  it("accepts valid update", () => { expect(UpdateProfileSchema.safeParse({ name: "Jane" }).success).toBe(true); });
  it("accepts empty object", () => { expect(UpdateProfileSchema.safeParse({}).success).toBe(true); });
  it("rejects invalid avatar URL", () => { expect(UpdateProfileSchema.safeParse({ avatar: "bad" }).success).toBe(false); });
  it("rejects name over 100 chars", () => { expect(UpdateProfileSchema.safeParse({ name: "a".repeat(101) }).success).toBe(false); });
});

describe("CancelSessionSchema", () => {
  it("accepts with reason", () => { expect(CancelSessionSchema.safeParse({ reason: "Conflict" }).success).toBe(true); });
  it("accepts without reason", () => { expect(CancelSessionSchema.safeParse({}).success).toBe(true); });
  it("rejects reason over 500 chars", () => { expect(CancelSessionSchema.safeParse({ reason: "x".repeat(501) }).success).toBe(false); });
});

describe("CreateGoalSchema", () => {
  it("accepts valid goal", () => { expect(CreateGoalSchema.safeParse({ title: "LEED", milestones: [{ title: "Study" }] }).success).toBe(true); });
  it("accepts without optional fields", () => { expect(CreateGoalSchema.safeParse({ title: "Learn" }).success).toBe(true); });
  it("rejects missing title", () => { expect(CreateGoalSchema.safeParse({ description: "x" }).success).toBe(false); });
  it("rejects empty title", () => { expect(CreateGoalSchema.safeParse({ title: "" }).success).toBe(false); });
  it("rejects more than 20 milestones", () => {
    const ms = Array.from({ length: 21 }, (_, i) => ({ title: "M" + (i + 1) }));
    expect(CreateGoalSchema.safeParse({ title: "G", milestones: ms }).success).toBe(false);
  });
});
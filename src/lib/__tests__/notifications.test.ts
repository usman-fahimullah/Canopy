import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    notification: { create: vi.fn() },
  },
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
  sessionBookingConfirmation: vi.fn(() => ({ to: "t@test.com", subject: "s", html: "h", text: "t" })),
  newBookingNotification: vi.fn(() => ({ to: "t@test.com", subject: "s", html: "h", text: "t" })),
  reviewRequest: vi.fn(() => ({ to: "t@test.com", subject: "s", html: "h", text: "t" })),
  sessionReminder: vi.fn(() => ({ to: "t@test.com", subject: "s", html: "h", text: "t" })),
}));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
  formatError: vi.fn((e) => String(e)),
}));

import { createNotification, createNewMessageNotification } from "../notifications";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

describe("createNotification", () => {
  beforeEach(() => { vi.clearAllMocks(); (prisma.notification.create as any).mockResolvedValue({ id: "n1" }); });

  it("creates an in-app notification", async () => {
    await createNotification({ accountId: "a1", type: "SESSION_BOOKED", title: "T", body: "B" });
    expect(prisma.notification.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ accountId: "a1", type: "SESSION_BOOKED", title: "T", body: "B" }),
    }));
  });

  it("sends email when sendEmailNotification is true with payload", async () => {
    await createNotification({
      accountId: "a1", type: "SESSION_BOOKED", title: "T", body: "B",
      sendEmailNotification: true,
      emailPayload: { to: "e@t.com", subject: "S", html: "H", text: "T" },
    });
    expect(sendEmail).toHaveBeenCalled();
  });

  it("does not send email when sendEmailNotification is false", async () => {
    await createNotification({ accountId: "a1", type: "SESSION_BOOKED", title: "T", body: "B" });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("stores data as JSON string when provided", async () => {
    await createNotification({ accountId: "a1", type: "SESSION_BOOKED", title: "T", body: "B", data: { sessionId: "s1" } });
    expect(prisma.notification.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ data: JSON.stringify({ sessionId: "s1" }) }),
    }));
  });

  it("stores null data when not provided", async () => {
    await createNotification({ accountId: "a1", type: "SESSION_BOOKED", title: "T", body: "B" });
    expect(prisma.notification.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ data: null }),
    }));
  });
});

describe("createNewMessageNotification", () => {
  beforeEach(() => { vi.clearAllMocks(); (prisma.notification.create as any).mockResolvedValue({ id: "n1" }); });

  it("truncates long message previews at 100 chars", async () => {
    const long = "a".repeat(150);
    await createNewMessageNotification({ recipientAccountId: "a1", senderName: "Bob", messagePreview: long, conversationId: "c1" });
    const call = (prisma.notification.create as any).mock.calls[0][0];
    expect(call.data.body.length).toBeLessThanOrEqual(104);
  });
});

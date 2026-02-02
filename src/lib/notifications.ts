// Notification service for Candid
// Centralizes all notification + email logic

import { prisma } from "@/lib/db";
import { NotificationType } from "@prisma/client";
import { logger, formatError } from "@/lib/logger";
import {
  sendEmail,
  sessionBookingConfirmation,
  newBookingNotification,
  reviewRequest,
  sessionReminder,
} from "@/lib/email";

interface CreateNotificationParams {
  accountId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  sendEmailNotification?: boolean;
  emailPayload?: {
    to: string;
    subject: string;
    html: string;
    text: string;
  };
}

/**
 * Create an in-app notification and optionally send an email
 */
export async function createNotification(params: CreateNotificationParams) {
  const { accountId, type, title, body, data, sendEmailNotification, emailPayload } = params;

  // Create in-app notification
  const notification = await prisma.notification.create({
    data: {
      accountId,
      type,
      title,
      body,
      data: data ? JSON.stringify(data) : null,
    },
  });

  // Send email if requested and payload provided
  if (sendEmailNotification && emailPayload) {
    await sendEmail(emailPayload).catch((err) => {
      logger.error("Notification email send failed", { error: formatError(err), endpoint: "lib/notifications" });
    });
  }

  return notification;
}

/**
 * Send notifications to both coach and mentee when a session is booked
 */
export async function createSessionBookedNotifications(session: {
  id: string;
  scheduledAt: Date;
  duration: number;
  videoLink?: string | null;
  coach: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    account: { id: string; email: string; name?: string | null };
  };
  mentee: {
    id: string;
    account: { id: string; email: string; name?: string | null };
  };
}) {
  const coachName = [session.coach.firstName, session.coach.lastName].filter(Boolean).join(" ") || session.coach.account.name || "Your Coach";
  const menteeName = session.mentee.account.name || "A mentee";

  // Notify mentee (booking confirmation)
  const menteeEmail = sessionBookingConfirmation({
    recipientName: session.mentee.account.name || "there",
    recipientEmail: session.mentee.account.email,
    coachName,
    sessionDate: session.scheduledAt,
    sessionDuration: session.duration,
    sessionRate: 0, // Rate is in the booking, not needed for notification
    meetingLink: session.videoLink || undefined,
  });

  await createNotification({
    accountId: session.mentee.account.id,
    type: "SESSION_BOOKED",
    title: "Session Confirmed",
    body: `Your session with ${coachName} is confirmed for ${session.scheduledAt.toLocaleDateString()}.`,
    data: {
      sessionId: session.id,
      url: `/candid/sessions/${session.id}`,
    },
    sendEmailNotification: true,
    emailPayload: menteeEmail,
  });

  // Notify coach (new booking)
  const coachEmail = newBookingNotification({
    recipientName: coachName,
    recipientEmail: session.coach.account.email,
    menteeName,
    sessionDate: session.scheduledAt,
    sessionDuration: session.duration,
  });

  await createNotification({
    accountId: session.coach.account.id,
    type: "SESSION_BOOKED",
    title: "New Session Booked",
    body: `${menteeName} has booked a session with you on ${session.scheduledAt.toLocaleDateString()}.`,
    data: {
      sessionId: session.id,
      url: `/candid/coach-dashboard`,
    },
    sendEmailNotification: true,
    emailPayload: coachEmail,
  });
}

/**
 * Send a review request notification to the mentee after session completion
 */
export async function createReviewRequestNotification(session: {
  id: string;
  scheduledAt: Date;
  coach: {
    firstName?: string | null;
    lastName?: string | null;
    account: { id: string; name?: string | null };
  };
  mentee: {
    account: { id: string; email: string; name?: string | null };
  };
}) {
  const coachName = [session.coach.firstName, session.coach.lastName].filter(Boolean).join(" ") || session.coach.account.name || "your coach";
  const reviewLink = `${process.env.NEXT_PUBLIC_APP_URL}/candid/sessions/${session.id}`;

  const emailPayload = reviewRequest({
    recipientName: session.mentee.account.name || "there",
    recipientEmail: session.mentee.account.email,
    coachName,
    sessionDate: session.scheduledAt,
    reviewLink,
  });

  await createNotification({
    accountId: session.mentee.account.id,
    type: "REVIEW_REQUEST",
    title: "How was your session?",
    body: `Your session with ${coachName} is complete. Share your feedback!`,
    data: {
      sessionId: session.id,
      url: `/candid/sessions/${session.id}`,
    },
    sendEmailNotification: true,
    emailPayload,
  });
}

/**
 * Send a session reminder notification (24 hours before)
 */
export async function createSessionReminderNotification(session: {
  id: string;
  scheduledAt: Date;
  videoLink?: string | null;
  coach: {
    firstName?: string | null;
    lastName?: string | null;
    account: { id: string; email: string; name?: string | null };
  };
  mentee: {
    account: { id: string; email: string; name?: string | null };
  };
}) {
  const coachName = [session.coach.firstName, session.coach.lastName].filter(Boolean).join(" ") || session.coach.account.name || "your coach";
  const menteeName = session.mentee.account.name || "your mentee";

  // Notify mentee
  const menteeEmail = sessionReminder({
    recipientName: session.mentee.account.name || "there",
    recipientEmail: session.mentee.account.email,
    coachName,
    sessionDate: session.scheduledAt,
    meetingLink: session.videoLink || undefined,
  });

  await createNotification({
    accountId: session.mentee.account.id,
    type: "SESSION_REMINDER",
    title: "Session Tomorrow",
    body: `Your session with ${coachName} is tomorrow.`,
    data: {
      sessionId: session.id,
      url: `/candid/sessions/${session.id}`,
    },
    sendEmailNotification: true,
    emailPayload: menteeEmail,
  });

  // Notify coach
  await createNotification({
    accountId: session.coach.account.id,
    type: "SESSION_REMINDER",
    title: "Session Tomorrow",
    body: `Your session with ${menteeName} is tomorrow.`,
    data: {
      sessionId: session.id,
      url: `/candid/coach-dashboard`,
    },
    sendEmailNotification: false, // Coaches get fewer emails
  });
}

/**
 * Send notification for a new message (called from message API)
 */
export async function createNewMessageNotification(params: {
  recipientAccountId: string;
  senderName: string;
  messagePreview: string;
  conversationId: string;
}) {
  await createNotification({
    accountId: params.recipientAccountId,
    type: "NEW_MESSAGE",
    title: `New message from ${params.senderName}`,
    body: params.messagePreview.length > 100
      ? params.messagePreview.slice(0, 100) + "..."
      : params.messagePreview,
    data: {
      conversationId: params.conversationId,
      url: `/candid/messages?thread=${params.conversationId}`,
    },
    sendEmailNotification: false, // Messages use in-app only by default
  });
}

/**
 * Send notification when a session is cancelled
 */
export async function createSessionCancelledNotification(params: {
  session: {
    id: string;
    scheduledAt: Date;
  };
  cancelledByName: string;
  recipientAccountId: string;
  recipientName: string;
  recipientEmail: string;
  refundInfo?: string;
}) {
  await createNotification({
    accountId: params.recipientAccountId,
    type: "SESSION_CANCELLED",
    title: "Session Cancelled",
    body: `${params.cancelledByName} has cancelled the session on ${params.session.scheduledAt.toLocaleDateString()}.${params.refundInfo ? ` ${params.refundInfo}` : ""}`,
    data: {
      sessionId: params.session.id,
      url: `/candid/sessions`,
    },
    sendEmailNotification: true,
    emailPayload: {
      to: params.recipientEmail,
      subject: "Session Cancelled",
      html: `<p>Hi ${params.recipientName},</p><p>${params.cancelledByName} has cancelled the session scheduled for ${params.session.scheduledAt.toLocaleDateString()}.${params.refundInfo ? ` ${params.refundInfo}` : ""}</p>`,
      text: `Hi ${params.recipientName}, ${params.cancelledByName} has cancelled the session scheduled for ${params.session.scheduledAt.toLocaleDateString()}.${params.refundInfo ? ` ${params.refundInfo}` : ""}`,
    },
  });
}

/**
 * Send notification when a coach application is approved/rejected
 */
export async function createCoachStatusNotification(params: {
  accountId: string;
  status: "APPROVED" | "REJECTED";
  coachName: string;
  email: string;
}) {
  const isApproved = params.status === "APPROVED";

  await createNotification({
    accountId: params.accountId,
    type: isApproved ? "COACH_APPROVED" : "COACH_REJECTED",
    title: isApproved ? "Application Approved!" : "Application Update",
    body: isApproved
      ? "Congratulations! Your coach application has been approved. Set up your profile to start accepting sessions."
      : "We appreciate your interest. Unfortunately, your application was not approved at this time.",
    data: {
      url: isApproved ? "/candid/coach-dashboard" : "/candid/dashboard",
    },
    sendEmailNotification: isApproved, // Only email for approvals
  });
}

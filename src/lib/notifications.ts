// Notification service for Candid
// Centralizes all notification + email logic

import { prisma } from "@/lib/db";
import { NotificationType } from "@prisma/client";
import { logger, formatError } from "@/lib/logger";
import { safeJsonParse } from "@/lib/utils";
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

// In-memory cache for notification preferences (30s TTL)
const prefsCache = new Map<string, { prefs: any; timestamp: number }>();
const PREFS_CACHE_TTL = 30_000; // 30 seconds

async function getNotificationPreferences(accountId: string) {
  const cached = prefsCache.get(accountId);
  if (cached && Date.now() - cached.timestamp < PREFS_CACHE_TTL) {
    return cached.prefs;
  }

  const prefs = await (prisma as any).notificationPreference.findUnique({
    where: { accountId },
  });

  if (prefs) {
    prefsCache.set(accountId, { prefs, timestamp: Date.now() });
  }

  return prefs;
}

function isNotificationEnabled(prefs: any, type: string, channel: "inApp" | "email"): boolean {
  if (!prefs) return true; // No prefs = all enabled (default)

  const prefsMap =
    channel === "inApp"
      ? safeJsonParse<Record<string, boolean>>(
          typeof prefs.inAppPrefs === "string"
            ? prefs.inAppPrefs
            : JSON.stringify(prefs.inAppPrefs),
          {}
        )
      : safeJsonParse<Record<string, boolean>>(
          typeof prefs.emailPrefs === "string"
            ? prefs.emailPrefs
            : JSON.stringify(prefs.emailPrefs),
          {}
        );

  // If the type is not in the map, default to enabled
  if (prefsMap[type] === undefined) return true;
  return prefsMap[type];
}

/**
 * Create an in-app notification and optionally send an email
 */
export async function createNotification(params: CreateNotificationParams) {
  const { accountId, type, title, body, data, sendEmailNotification, emailPayload } = params;

  // Check user preferences
  const prefs = await getNotificationPreferences(accountId).catch(() => null);

  // Check in-app preference
  const inAppEnabled = isNotificationEnabled(prefs, type, "inApp");

  let notification = null;
  if (inAppEnabled) {
    notification = await prisma.notification.create({
      data: {
        accountId,
        type,
        title,
        body,
        data: data ? JSON.stringify(data) : null,
      },
    });
  }

  // Check email preference
  const emailEnabled = isNotificationEnabled(prefs, type, "email");
  const emailFrequency = prefs?.emailFrequency || "immediate";

  if (sendEmailNotification && emailPayload && emailEnabled && emailFrequency !== "never") {
    await sendEmail(emailPayload).catch((err) => {
      logger.error("Notification email send failed", {
        error: formatError(err),
        endpoint: "lib/notifications",
      });
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
  const coachName =
    [session.coach.firstName, session.coach.lastName].filter(Boolean).join(" ") ||
    session.coach.account.name ||
    "Your Coach";
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
      url: `/jobs/coaching`,
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
      url: `/candid/coach`,
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
  const coachName =
    [session.coach.firstName, session.coach.lastName].filter(Boolean).join(" ") ||
    session.coach.account.name ||
    "your coach";
  const reviewLink = `${process.env.NEXT_PUBLIC_APP_URL}/jobs/coaching`;

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
      url: `/jobs/coaching`,
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
  const coachName =
    [session.coach.firstName, session.coach.lastName].filter(Boolean).join(" ") ||
    session.coach.account.name ||
    "your coach";
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
      url: `/jobs/coaching`,
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
      url: `/candid/coach/sessions`,
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
    body:
      params.messagePreview.length > 100
        ? params.messagePreview.slice(0, 100) + "..."
        : params.messagePreview,
    data: {
      conversationId: params.conversationId,
      url: `/jobs/messages?thread=${params.conversationId}`,
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
      url: `/jobs/coaching`,
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
      url: isApproved ? "/candid/coach" : "/jobs",
    },
    sendEmailNotification: isApproved, // Only email for approvals
  });
}

// =============================================================================
// GOAL REMINDERS
// =============================================================================

/**
 * Send notification when a goal is due soon (3 days before target date)
 */
export async function createGoalDueSoonNotification(params: {
  accountId: string;
  goalId: string;
  goalTitle: string;
  daysUntilDue: number;
}) {
  await createNotification({
    accountId: params.accountId,
    type: "GOAL_DUE_SOON",
    title: `Goal due ${params.daysUntilDue === 1 ? "tomorrow" : `in ${params.daysUntilDue} days`}`,
    body: params.goalTitle,
    data: {
      goalId: params.goalId,
      url: `/jobs/profile?goal=${params.goalId}`,
    },
    sendEmailNotification: false, // In-app only by default
  });
}

/**
 * Send notification when a goal hasn't been updated for 5+ days
 */
export async function createGoalInactiveNotification(params: {
  accountId: string;
  goalId: string;
  goalTitle: string;
  daysSinceUpdate: number;
}) {
  await createNotification({
    accountId: params.accountId,
    type: "GOAL_INACTIVE",
    title: "Check in on your goal",
    body: `You haven't updated "${params.goalTitle}" in ${params.daysSinceUpdate} days`,
    data: {
      goalId: params.goalId,
      url: `/jobs/profile?goal=${params.goalId}`,
    },
    sendEmailNotification: false, // In-app only by default
  });
}

/**
 * Check and send goal reminder notifications for all seekers
 * This should be run as a daily cron job
 */
export async function processGoalReminders() {
  const now = new Date();
  const threeDaysFromNow = new Date(now);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  const fiveDaysAgo = new Date(now);
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  // Find goals that are due in 3 days (within the next 24 hours of the 3-day mark)
  const dueSoonGoals = await prisma.goal.findMany({
    where: {
      status: "ACTIVE",
      targetDate: {
        gte: new Date(threeDaysFromNow.setHours(0, 0, 0, 0)),
        lt: new Date(threeDaysFromNow.setHours(23, 59, 59, 999)),
      },
    },
    include: {
      seeker: {
        include: { account: true },
      },
    },
  });

  // Send due soon notifications
  for (const goal of dueSoonGoals) {
    if (!goal.seeker?.account) continue;

    // Check if we already sent a notification for this goal today
    const existingNotification = await prisma.notification.findFirst({
      where: {
        accountId: goal.seeker.account.id,
        type: "GOAL_DUE_SOON",
        data: { contains: goal.id },
        createdAt: { gte: new Date(now.setHours(0, 0, 0, 0)) },
      },
    });

    if (existingNotification) continue;

    await createGoalDueSoonNotification({
      accountId: goal.seeker.account.id,
      goalId: goal.id,
      goalTitle: goal.title,
      daysUntilDue: 3,
    });
  }

  // Find goals that haven't been updated in 5+ days
  const inactiveGoals = await prisma.goal.findMany({
    where: {
      status: "ACTIVE",
      updatedAt: { lt: fiveDaysAgo },
    },
    include: {
      seeker: {
        include: { account: true },
      },
    },
  });

  // Send inactive notifications (max once per 5 days per goal)
  for (const goal of inactiveGoals) {
    if (!goal.seeker?.account) continue;

    // Check if we sent an inactive notification for this goal in the last 5 days
    const existingNotification = await prisma.notification.findFirst({
      where: {
        accountId: goal.seeker.account.id,
        type: "GOAL_INACTIVE",
        data: { contains: goal.id },
        createdAt: { gte: fiveDaysAgo },
      },
    });

    if (existingNotification) continue;

    const daysSinceUpdate = Math.floor(
      (now.getTime() - goal.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    await createGoalInactiveNotification({
      accountId: goal.seeker.account.id,
      goalId: goal.id,
      goalTitle: goal.title,
      daysSinceUpdate,
    });
  }

  return {
    dueSoonNotifications: dueSoonGoals.length,
    inactiveNotifications: inactiveGoals.length,
  };
}

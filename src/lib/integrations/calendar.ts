/**
 * Calendar Integration Service
 *
 * Creates, updates, and deletes calendar events via Nango proxy.
 * Supports Google Calendar and Outlook Calendar.
 * All operations are best-effort — failures never block primary operations.
 */

import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { nangoProxy } from "./nango";
import type { IntegrationProvider } from "./types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CalendarEventInput {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  meetingLink?: string;
  attendees?: string[];
}

interface CalendarEventResult {
  calendarEventId: string;
  provider: IntegrationProvider;
}

interface FreeBusySlot {
  start: string;
  end: string;
  status: "busy" | "tentative" | "free";
}

// ---------------------------------------------------------------------------
// Helpers — detect which calendar the member has connected
// ---------------------------------------------------------------------------

async function getMemberCalendarConnection(organizationId: string, memberId: string) {
  // Check for member-scoped calendar connections (Google Calendar or Outlook)
  const connection = await prisma.integrationConnection.findFirst({
    where: {
      organizationId,
      connectedByMemberId: memberId,
      provider: { in: ["google-calendar", "outlook-calendar"] },
      status: "active",
    },
    select: {
      provider: true,
      nangoConnectionId: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return connection;
}

// ---------------------------------------------------------------------------
// Google Calendar helpers
// ---------------------------------------------------------------------------

function buildGoogleCalendarEvent(event: CalendarEventInput) {
  return {
    summary: event.title,
    description: event.description || "",
    start: {
      dateTime: event.startTime.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: event.endTime.toISOString(),
      timeZone: "UTC",
    },
    ...(event.location && { location: event.location }),
    ...(event.meetingLink && {
      conferenceData: {
        entryPoints: [{ entryPointType: "video", uri: event.meetingLink }],
      },
    }),
    ...(event.attendees?.length && {
      attendees: event.attendees.map((email) => ({ email })),
    }),
  };
}

function buildOutlookCalendarEvent(event: CalendarEventInput) {
  return {
    subject: event.title,
    body: {
      contentType: "text",
      content: event.description || "",
    },
    start: {
      dateTime: event.startTime.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: event.endTime.toISOString(),
      timeZone: "UTC",
    },
    ...(event.location && {
      location: { displayName: event.location },
    }),
    ...(event.attendees?.length && {
      attendees: event.attendees.map((email) => ({
        emailAddress: { address: email },
        type: "required",
      })),
    }),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create a calendar event for an interview.
 * Returns the calendar event ID and provider, or null if no calendar is connected.
 */
export async function createCalendarEvent(
  organizationId: string,
  memberId: string,
  event: CalendarEventInput
): Promise<CalendarEventResult | null> {
  try {
    const connection = await getMemberCalendarConnection(organizationId, memberId);
    if (!connection) return null;

    const provider = connection.provider as IntegrationProvider;

    if (provider === "google-calendar") {
      const result = await nangoProxy<{ id: string }>({
        provider: "google-calendar",
        scope: "member",
        ids: { organizationId, memberId },
        endpoint: "/calendar/v3/calendars/primary/events",
        method: "POST",
        data: buildGoogleCalendarEvent(event),
      });

      return { calendarEventId: result.id, provider };
    }

    if (provider === "outlook-calendar") {
      const result = await nangoProxy<{ id: string }>({
        provider: "outlook-calendar",
        scope: "member",
        ids: { organizationId, memberId },
        endpoint: "/me/events",
        method: "POST",
        data: buildOutlookCalendarEvent(event),
      });

      return { calendarEventId: result.id, provider };
    }

    return null;
  } catch (error) {
    logger.warn("Failed to create calendar event (best-effort)", {
      organizationId,
      memberId,
      error: formatError(error),
    });
    return null;
  }
}

/**
 * Update an existing calendar event.
 */
export async function updateCalendarEvent(
  organizationId: string,
  memberId: string,
  calendarEventId: string,
  provider: IntegrationProvider,
  updates: Partial<CalendarEventInput>
): Promise<boolean> {
  try {
    const connection = await getMemberCalendarConnection(organizationId, memberId);
    if (!connection || connection.provider !== provider) return false;

    if (provider === "google-calendar") {
      await nangoProxy({
        provider: "google-calendar",
        scope: "member",
        ids: { organizationId, memberId },
        endpoint: `/calendar/v3/calendars/primary/events/${calendarEventId}`,
        method: "PATCH",
        data: buildGoogleCalendarEvent(updates as CalendarEventInput),
      });
      return true;
    }

    if (provider === "outlook-calendar") {
      await nangoProxy({
        provider: "outlook-calendar",
        scope: "member",
        ids: { organizationId, memberId },
        endpoint: `/me/events/${calendarEventId}`,
        method: "PATCH",
        data: buildOutlookCalendarEvent(updates as CalendarEventInput),
      });
      return true;
    }

    return false;
  } catch (error) {
    logger.warn("Failed to update calendar event (best-effort)", {
      calendarEventId,
      provider,
      error: formatError(error),
    });
    return false;
  }
}

/**
 * Delete a calendar event.
 */
export async function deleteCalendarEvent(
  organizationId: string,
  memberId: string,
  calendarEventId: string,
  provider: IntegrationProvider
): Promise<boolean> {
  try {
    const connection = await getMemberCalendarConnection(organizationId, memberId);
    if (!connection || connection.provider !== provider) return false;

    if (provider === "google-calendar") {
      await nangoProxy({
        provider: "google-calendar",
        scope: "member",
        ids: { organizationId, memberId },
        endpoint: `/calendar/v3/calendars/primary/events/${calendarEventId}`,
        method: "DELETE",
      });
      return true;
    }

    if (provider === "outlook-calendar") {
      await nangoProxy({
        provider: "outlook-calendar",
        scope: "member",
        ids: { organizationId, memberId },
        endpoint: `/me/events/${calendarEventId}`,
        method: "DELETE",
      });
      return true;
    }

    return false;
  } catch (error) {
    logger.warn("Failed to delete calendar event (best-effort)", {
      calendarEventId,
      provider,
      error: formatError(error),
    });
    return false;
  }
}

/**
 * Get free/busy availability for a member.
 */
export async function getCalendarAvailability(
  organizationId: string,
  memberId: string,
  start: string,
  end: string
): Promise<FreeBusySlot[]> {
  try {
    const connection = await getMemberCalendarConnection(organizationId, memberId);
    if (!connection) return [];

    const provider = connection.provider as IntegrationProvider;

    if (provider === "google-calendar") {
      const result = await nangoProxy<{
        calendars: Record<string, { busy: Array<{ start: string; end: string }> }>;
      }>({
        provider: "google-calendar",
        scope: "member",
        ids: { organizationId, memberId },
        endpoint: "/calendar/v3/freeBusy",
        method: "POST",
        data: {
          timeMin: start,
          timeMax: end,
          items: [{ id: "primary" }],
        },
      });

      const busy = result.calendars?.primary?.busy || [];
      return busy.map((slot) => ({
        start: slot.start,
        end: slot.end,
        status: "busy" as const,
      }));
    }

    if (provider === "outlook-calendar") {
      const result = await nangoProxy<{
        value: Array<{
          scheduleItems: Array<{
            start: { dateTime: string };
            end: { dateTime: string };
            status: string;
          }>;
        }>;
      }>({
        provider: "outlook-calendar",
        scope: "member",
        ids: { organizationId, memberId },
        endpoint: "/me/calendar/getSchedule",
        method: "POST",
        data: {
          schedules: [memberId],
          startTime: { dateTime: start, timeZone: "UTC" },
          endTime: { dateTime: end, timeZone: "UTC" },
        },
      });

      const items = result.value?.[0]?.scheduleItems || [];
      return items.map((item) => ({
        start: item.start.dateTime,
        end: item.end.dateTime,
        status: item.status === "busy" ? ("busy" as const) : ("tentative" as const),
      }));
    }

    return [];
  } catch (error) {
    logger.warn("Failed to get calendar availability (best-effort)", {
      organizationId,
      memberId,
      error: formatError(error),
    });
    return [];
  }
}

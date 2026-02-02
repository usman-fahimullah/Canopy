// Availability service for Candid
// Calculates available booking slots from coach availability and existing sessions

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export interface TimeSlot {
  start: string; // "09:00"
  end: string;   // "17:00"
}

export interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface AvailableSlot {
  date: string;      // "2025-02-15"
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
}

const DAY_NAMES: (keyof WeeklyAvailability)[] = [
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
];

/**
 * Parse the JSON availability string stored in CoachProfile
 */
export function parseAvailability(json: string | null): WeeklyAvailability | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as WeeklyAvailability;
  } catch {
    logger.error("Failed to parse availability JSON", { endpoint: "lib/availability" });
    return null;
  }
}

/**
 * Generate time slots for a day based on availability windows and session duration
 */
function generateSlotsForDay(
  windows: TimeSlot[],
  sessionDuration: number,
  bufferTime: number
): { startTime: string; endTime: string }[] {
  const slots: { startTime: string; endTime: string }[] = [];

  for (const window of windows) {
    const [startHour, startMin] = window.start.split(":").map(Number);
    const [endHour, endMin] = window.end.split(":").map(Number);
    const windowStartMinutes = startHour * 60 + startMin;
    const windowEndMinutes = endHour * 60 + endMin;

    let cursor = windowStartMinutes;
    while (cursor + sessionDuration <= windowEndMinutes) {
      const slotStart = `${String(Math.floor(cursor / 60)).padStart(2, "0")}:${String(cursor % 60).padStart(2, "0")}`;
      const slotEndMin = cursor + sessionDuration;
      const slotEnd = `${String(Math.floor(slotEndMin / 60)).padStart(2, "0")}:${String(slotEndMin % 60).padStart(2, "0")}`;

      slots.push({ startTime: slotStart, endTime: slotEnd });

      // Move cursor by session duration + buffer
      cursor += sessionDuration + bufferTime;
    }
  }

  return slots;
}

/**
 * Get all available booking slots for a coach within a date range
 * Accounts for existing sessions and buffer time
 */
export async function getAvailableSlots(
  coachId: string,
  fromDate: Date,
  toDate: Date
): Promise<AvailableSlot[]> {
  // Fetch coach profile with availability
  const coach = await prisma.coachProfile.findUnique({
    where: { id: coachId },
    select: {
      availability: true,
      sessionDuration: true,
      bufferTime: true,
      maxSessionsPerWeek: true,
    },
  });

  if (!coach) return [];

  const availability = parseAvailability(coach.availability);
  if (!availability) return [];

  // Fetch existing sessions in the date range
  const existingSessions = await prisma.session.findMany({
    where: {
      coachId,
      status: { in: ["SCHEDULED", "IN_PROGRESS"] },
      scheduledAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
    select: {
      scheduledAt: true,
      duration: true,
    },
    take: 200,
  });

  // Build a set of occupied time ranges (in minutes from midnight for each date)
  const occupiedSlots = new Map<string, { start: number; end: number }[]>();
  for (const session of existingSessions) {
    const dateKey = session.scheduledAt.toISOString().split("T")[0];
    const hours = session.scheduledAt.getUTCHours();
    const minutes = session.scheduledAt.getUTCMinutes();
    const startMin = hours * 60 + minutes;
    const endMin = startMin + session.duration + coach.bufferTime;

    if (!occupiedSlots.has(dateKey)) {
      occupiedSlots.set(dateKey, []);
    }
    const slots = occupiedSlots.get(dateKey);
    if (slots) slots.push({ start: startMin, end: endMin });
  }

  // Generate available slots day by day
  const slots: AvailableSlot[] = [];
  const current = new Date(fromDate);
  const now = new Date();

  while (current <= toDate) {
    const dayOfWeek = current.getDay();
    const dayName = DAY_NAMES[dayOfWeek];
    const dayWindows = availability[dayName];

    if (dayWindows && dayWindows.length > 0) {
      const dateKey = current.toISOString().split("T")[0];
      const daySlots = generateSlotsForDay(dayWindows, coach.sessionDuration, coach.bufferTime);
      const occupied = occupiedSlots.get(dateKey) || [];

      for (const slot of daySlots) {
        const [slotStartH, slotStartM] = slot.startTime.split(":").map(Number);
        const slotStartMin = slotStartH * 60 + slotStartM;
        const slotEndMin = slotStartMin + coach.sessionDuration;

        // Check if slot conflicts with any existing session
        const isOccupied = occupied.some(
          (occ) => slotStartMin < occ.end && slotEndMin > occ.start
        );

        // Don't show slots in the past
        const slotDateTime = new Date(current);
        slotDateTime.setHours(slotStartH, slotStartM, 0, 0);
        const isInPast = slotDateTime <= now;

        if (!isOccupied && !isInPast) {
          slots.push({
            date: dateKey,
            startTime: slot.startTime,
            endTime: slot.endTime,
          });
        }
      }
    }

    // Move to next day
    current.setDate(current.getDate() + 1);
  }

  return slots;
}

/**
 * Check if a specific time slot is available for booking
 */
export async function isSlotAvailable(
  coachId: string,
  date: Date,
  duration: number
): Promise<boolean> {
  // Check for conflicting sessions
  const conflicting = await prisma.session.count({
    where: {
      coachId,
      status: { in: ["SCHEDULED", "IN_PROGRESS"] },
      scheduledAt: {
        gte: new Date(date.getTime() - duration * 60 * 1000),
        lte: new Date(date.getTime() + duration * 60 * 1000),
      },
    },
  });

  if (conflicting > 0) return false;

  // Check weekly session limit
  const coach = await prisma.coachProfile.findUnique({
    where: { id: coachId },
    select: { maxSessionsPerWeek: true },
  });

  if (coach?.maxSessionsPerWeek) {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weeklyCount = await prisma.session.count({
      where: {
        coachId,
        status: { in: ["SCHEDULED", "IN_PROGRESS"] },
        scheduledAt: { gte: weekStart, lt: weekEnd },
      },
    });

    if (weeklyCount >= coach.maxSessionsPerWeek) return false;
  }

  return true;
}

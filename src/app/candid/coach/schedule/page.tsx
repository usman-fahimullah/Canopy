"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Clock, CalendarDots, FloppyDisk, Globe, Check } from "@phosphor-icons/react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const DAY_ABBREVIATIONS: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const HOURS = Array.from({ length: 10 }, (_, i) => i + 9); // 9am to 6pm

function formatHour(hour: number) {
  if (hour === 12) return "12pm";
  if (hour > 12) return `${hour - 12}pm`;
  return `${hour}am`;
}

type SlotKey = `${string}-${number}`;

function makeSlotKey(day: string, hour: number): SlotKey {
  return `${day}-${hour}`;
}

export default function CoachSchedulePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<Set<SlotKey>>(new Set());
  const [initialSlots, setInitialSlots] = useState<Set<SlotKey>>(new Set());
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    // Get browser timezone
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    const fetchAvailability = async () => {
      try {
        const res = await fetch("/api/availability");
        if (!res.ok) throw new Error("Failed to fetch availability");

        const data = await res.json();
        const availability = data.availability;

        if (availability && typeof availability === "object") {
          const slots = new Set<SlotKey>();

          // Parse availability object: { Monday: [9, 10, 11, ...], Tuesday: [...] }
          Object.entries(availability).forEach(([day, hours]) => {
            if (Array.isArray(hours)) {
              hours.forEach((hour: number) => {
                slots.add(makeSlotKey(day, hour));
              });
            }
          });

          setAvailableSlots(slots);
          setInitialSlots(new Set(slots));
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const toggleSlot = useCallback((day: string, hour: number) => {
    const key = makeSlotKey(day, hour);
    setAvailableSlots((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
    setSaved(false);
  }, []);

  const hasChanges =
    !loading &&
    (availableSlots.size !== initialSlots.size ||
      Array.from(availableSlots).some((s) => !initialSlots.has(s)));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      // Convert Set back to object format: { Monday: [9, 10, ...], ... }
      const availability: Record<string, number[]> = {};
      DAYS.forEach((day) => {
        const hours: number[] = [];
        HOURS.forEach((hour) => {
          if (availableSlots.has(makeSlotKey(day, hour))) {
            hours.push(hour);
          }
        });
        if (hours.length > 0) {
          availability[day] = hours;
        }
      });

      const res = await fetch("/api/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability }),
      });

      if (!res.ok) throw new Error("Failed to save availability");

      setInitialSlots(new Set(availableSlots));
      setSaved(true);

      // Clear the saved indicator after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving availability:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Schedule"
        actions={
          <Button
            variant="primary"
            onClick={handleSave}
            loading={saving}
            disabled={!hasChanges && !saving}
          >
            {saved ? (
              <>
                <Check size={18} weight="bold" />
                Saved
              </>
            ) : (
              <>
                <FloppyDisk size={18} weight="bold" />
                Save Changes
              </>
            )}
          </Button>
        }
      />

      <div className="px-8 py-6 lg:px-12">
        {/* Timezone display */}
        <div className="mb-6 flex items-center gap-2 text-caption text-[var(--primitive-neutral-600)]">
          <Globe size={16} weight="regular" />
          <span>
            Timezone:{" "}
            <span className="font-medium text-[var(--primitive-neutral-800)]">{timezone}</span>
          </span>
        </div>

        {/* Weekly grid */}
        <div className="overflow-x-auto rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {/* Time column header */}
                <th className="sticky left-0 z-10 w-[72px] border-b border-r border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-3 py-3">
                  <Clock
                    size={16}
                    weight="bold"
                    className="mx-auto text-[var(--primitive-neutral-500)]"
                  />
                </th>
                {/* Day headers */}
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="border-b border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-2 py-3 text-center"
                  >
                    <span className="hidden text-caption font-semibold text-[var(--primitive-neutral-700)] sm:inline">
                      {day}
                    </span>
                    <span className="text-caption font-semibold text-[var(--primitive-neutral-700)] sm:hidden">
                      {DAY_ABBREVIATIONS[day]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour}>
                  {/* Time label */}
                  <td className="sticky left-0 z-10 border-b border-r border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-3 py-0 text-center">
                    <span className="text-caption text-[var(--primitive-neutral-500)]">
                      {formatHour(hour)}
                    </span>
                  </td>
                  {/* Day slots */}
                  {DAYS.map((day) => {
                    const isAvailable = availableSlots.has(makeSlotKey(day, hour));

                    return (
                      <td
                        key={`${day}-${hour}`}
                        className="border-b border-[var(--primitive-neutral-200)] p-1"
                      >
                        <button
                          onClick={() => toggleSlot(day, hour)}
                          aria-label={`${day} ${formatHour(hour)} - ${isAvailable ? "Available" : "Unavailable"}`}
                          className={`h-10 w-full rounded-lg transition-all ${
                            isAvailable
                              ? "ring-[var(--primitive-green-500)]/30 bg-[var(--primitive-green-300)] ring-1 ring-inset hover:bg-[var(--primitive-green-400)]"
                              : "bg-[var(--primitive-neutral-100)] hover:bg-[var(--primitive-neutral-200)]"
                          }`}
                        >
                          {isAvailable && (
                            <Check
                              size={14}
                              weight="bold"
                              className="mx-auto text-[var(--primitive-green-700)]"
                            />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="ring-[var(--primitive-green-500)]/30 h-4 w-4 rounded bg-[var(--primitive-green-300)] ring-1 ring-inset" />
            <span className="text-caption text-[var(--primitive-neutral-600)]">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-[var(--primitive-neutral-100)]" />
            <span className="text-caption text-[var(--primitive-neutral-600)]">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
}

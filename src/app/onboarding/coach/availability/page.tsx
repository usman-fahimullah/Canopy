"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import {
  useOnboardingForm,
  type CoachTimeSlot,
  type CoachWeeklySchedule,
} from "@/components/onboarding/form-context";
import { FormCard, FormField } from "@/components/ui/form-section";
import { COACH_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

type DayKey = keyof CoachWeeklySchedule;

const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 22; h++) {
  TIME_OPTIONS.push(`${h.toString().padStart(2, "0")}:00`);
  if (h < 22) {
    TIME_OPTIONS.push(`${h.toString().padStart(2, "0")}:30`);
  }
}

function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display}:${m} ${ampm}`;
}

const BUFFER_OPTIONS = [
  { value: 0, label: "No buffer" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
];

const COMMON_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

function getTimezoneLabel(tz: string): string {
  try {
    const now = new Date();
    const offset = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value;
    const city = tz.split("/").pop()?.replace(/_/g, " ") ?? tz;
    return `${city} (${offset ?? tz})`;
  } catch {
    return tz;
  }
}

export default function CoachAvailabilityPage() {
  const router = useRouter();
  const { coachData, setCoachData } = useOnboardingForm();

  const step = COACH_STEPS[3]; // availability
  const schedule = coachData.weeklySchedule;

  const hasAtLeastOneDay = DAYS.some((d) => schedule[d.key] !== null);
  const canContinue = hasAtLeastOneDay;

  function toggleDay(day: DayKey) {
    const current = schedule[day];
    setCoachData({
      weeklySchedule: {
        ...schedule,
        [day]: current ? null : { start: "09:00", end: "17:00" },
      },
    });
  }

  function updateSlot(
    day: DayKey,
    field: keyof CoachTimeSlot,
    value: string
  ) {
    const slot = schedule[day];
    if (!slot) return;
    setCoachData({
      weeklySchedule: {
        ...schedule,
        [day]: { ...slot, [field]: value },
      },
    });
  }

  return (
    <OnboardingShell
      shell="coach"
      step={step}
      currentStepIndex={3}
      totalSteps={COACH_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/coach/services")}
          onContinue={() => router.push("/onboarding/coach/payout")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        {/* Weekly Schedule */}
        <FormCard>
          <FormField
            label="When are you available for sessions?"
            required
            helpText="Toggle days on/off and set your available hours"
          >
            <div className="space-y-3">
              {DAYS.map((day) => {
                const slot = schedule[day.key];
                const enabled = slot !== null;

                return (
                  <div
                    key={day.key}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 transition-all",
                      enabled
                        ? "border-[var(--border-interactive-focus)] bg-[var(--background-interactive-selected)]"
                        : "border-[var(--border-muted)] bg-[var(--background-interactive-default)]"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDay(day.key)}
                      className={cn(
                        "w-12 shrink-0 rounded-md py-1 text-center text-caption font-medium transition-all",
                        enabled
                          ? "bg-[var(--background-brand)] text-[var(--foreground-on-emphasis)]"
                          : "bg-[var(--background-muted)] text-[var(--foreground-subtle)]"
                      )}
                    >
                      {day.short}
                    </button>

                    {enabled && slot ? (
                      <div className="flex flex-1 items-center gap-2">
                        <select
                          value={slot.start}
                          onChange={(e) =>
                            updateSlot(day.key, "start", e.target.value)
                          }
                          className="rounded-md border border-[var(--border-muted)] bg-[var(--background-default)] px-2 py-1.5 text-caption text-[var(--foreground-default)]"
                        >
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {formatTime(t)}
                            </option>
                          ))}
                        </select>
                        <span className="text-caption text-[var(--foreground-subtle)]">
                          to
                        </span>
                        <select
                          value={slot.end}
                          onChange={(e) =>
                            updateSlot(day.key, "end", e.target.value)
                          }
                          className="rounded-md border border-[var(--border-muted)] bg-[var(--background-default)] px-2 py-1.5 text-caption text-[var(--foreground-default)]"
                        >
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {formatTime(t)}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span className="text-caption text-[var(--foreground-disabled)]">
                        Off
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </FormField>
        </FormCard>

        {/* Timezone */}
        <FormCard>
          <FormField label="Timezone" helpText="Auto-detected from your browser">
            <select
              value={coachData.timezone}
              onChange={(e) => setCoachData({ timezone: e.target.value })}
              className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--background-default)] px-3 py-2.5 text-caption text-[var(--foreground-default)]"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {getTimezoneLabel(tz)}
                </option>
              ))}
              {!COMMON_TIMEZONES.includes(coachData.timezone) && (
                <option value={coachData.timezone}>
                  {getTimezoneLabel(coachData.timezone)}
                </option>
              )}
            </select>
          </FormField>
        </FormCard>

        {/* Buffer Time */}
        <FormCard>
          <FormField
            label="Buffer time between sessions"
            helpText="Give yourself a break between back-to-back sessions"
          >
            <div className="flex flex-wrap gap-2">
              {BUFFER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setCoachData({ bufferMinutes: opt.value })
                  }
                  className={cn(
                    "rounded-lg border px-4 py-2 text-caption font-medium transition-all",
                    coachData.bufferMinutes === opt.value
                      ? "border-[var(--border-interactive-focus)] bg-[var(--background-interactive-selected)] text-[var(--foreground-brand)]"
                      : "border-[var(--border-muted)] bg-[var(--background-interactive-default)] text-[var(--foreground-muted)] hover:border-[var(--border-interactive-hover)]"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FormField>
        </FormCard>

        {/* Calendar Sync Teaser */}
        <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--background-subtle)] p-4">
          <p className="mb-1 text-caption font-medium text-[var(--foreground-default)]">
            Sync your calendar
          </p>
          <p className="text-caption text-[var(--foreground-muted)]">
            Avoid double-bookings by connecting your Google or Outlook
            calendar. You can set this up from your dashboard after
            onboarding.
          </p>
        </div>
      </div>
    </OnboardingShell>
  );
}

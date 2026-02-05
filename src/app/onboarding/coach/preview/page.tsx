"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm, type CoachWeeklySchedule } from "@/components/onboarding/form-context";
import { FormCard } from "@/components/ui/form-section";
import { Alert } from "@/components/ui/alert";
import { COACH_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";
import {
  PencilSimple,
  MapPin,
  Clock,
  CurrencyDollar,
  Certificate,
  Briefcase,
  CalendarCheck,
  User,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";

type DayKey = keyof CoachWeeklySchedule;

const DAYS: { key: DayKey; short: string }[] = [
  { key: "monday", short: "Mon" },
  { key: "tuesday", short: "Tue" },
  { key: "wednesday", short: "Wed" },
  { key: "thursday", short: "Thu" },
  { key: "friday", short: "Fri" },
  { key: "saturday", short: "Sat" },
  { key: "sunday", short: "Sun" },
];

function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display}:${m} ${ampm}`;
}

function formatPrice(cents: number): string {
  if (cents === 0) return "Free";
  return `$${Math.round(cents / 100)}`;
}

export default function CoachPreviewPage() {
  const router = useRouter();
  const { coachData, baseProfile } = useOnboardingForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = COACH_STEPS[5]; // preview

  // Compute completeness checks
  const checks = [
    {
      label: "Profile photo",
      complete: coachData.photoUrl.length > 0,
      editPath: "/onboarding/coach/about",
    },
    {
      label: "Tagline & bio",
      complete: coachData.tagline.trim().length >= 10 && coachData.bio.trim().length >= 100,
      editPath: "/onboarding/coach/about",
    },
    {
      label: "Coaching types",
      complete: coachData.coachingTypes.length > 0,
      editPath: "/onboarding/coach/expertise",
    },
    {
      label: "Industry focus",
      complete: coachData.industryFocus.length > 0,
      editPath: "/onboarding/coach/expertise",
    },
    {
      label: "Experience level",
      complete: coachData.experienceLevel !== null,
      editPath: "/onboarding/coach/expertise",
    },
    {
      label: "At least one service",
      complete:
        coachData.services.length > 0 &&
        coachData.services.every(
          (s) => s.name.trim().length >= 3 && s.description.trim().length >= 10
        ),
      editPath: "/onboarding/coach/services",
    },
    {
      label: "Availability",
      complete: DAYS.some((d) => coachData.weeklySchedule[d.key] !== null),
      editPath: "/onboarding/coach/availability",
    },
  ];

  const allComplete = checks.every((c) => c.complete);
  const completedCount = checks.filter((c) => c.complete).length;

  const activeDays = DAYS.filter((d) => coachData.weeklySchedule[d.key] !== null);

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete-role",
          shell: "coach",
          firstName: baseProfile.firstName,
          lastName: baseProfile.lastName,
          linkedinUrl: baseProfile.linkedinUrl || undefined,
          bio: coachData.bio || undefined,
          headline: coachData.tagline || undefined,
          photoUrl: coachData.photoUrl || undefined,
          location: coachData.location || undefined,
          expertise: coachData.coachingTypes,
          sectors: coachData.industryFocus,
          sessionTypes: coachData.services.map((s) => s.name),
          sessionRate: coachData.services[0]?.price ?? 15000,
          yearsInClimate:
            coachData.experienceLevel === "new"
              ? 0
              : coachData.experienceLevel === "developing"
                ? 2
                : coachData.experienceLevel === "experienced"
                  ? 5
                  : coachData.experienceLevel === "expert"
                    ? 10
                    : null,
          // Extended fields stored as JSON in availability
          availability: JSON.stringify({
            weeklySchedule: coachData.weeklySchedule,
            timezone: coachData.timezone,
            bufferMinutes: coachData.bufferMinutes,
            services: coachData.services,
            certifications: coachData.certifications,
            careerFocus: coachData.careerFocus,
            industryFocus: coachData.industryFocus,
            coachingTypes: coachData.coachingTypes,
            experienceLevel: coachData.experienceLevel,
          }),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "We couldn\u2019t launch your profile. Please try again.");
      }

      router.push("/candid/coach/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OnboardingShell
      shell="coach"
      step={step}
      currentStepIndex={5}
      totalSteps={COACH_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/coach/payout")}
          onContinue={handleSubmit}
          canContinue={allComplete && !isSubmitting}
          loading={isSubmitting}
          continueLabel="Launch Profile"
        />
      }
    >
      <div className="space-y-6">
        {/* Error banner */}
        {error && (
          <Alert variant="critical" dismissible onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Completeness checklist */}
        <FormCard>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-body-sm font-medium text-[var(--foreground-default)]">
              Profile completeness
            </p>
            <span
              className={cn(
                "text-caption font-medium",
                allComplete
                  ? "text-[var(--foreground-success)]"
                  : "text-[var(--foreground-warning)]"
              )}
            >
              {completedCount}/{checks.length}
            </span>
          </div>
          <div className="space-y-2">
            {checks.map((check) => (
              <div
                key={check.label}
                className="flex items-center justify-between rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  {check.complete ? (
                    <CheckCircle
                      size={18}
                      weight="fill"
                      className="text-[var(--foreground-success)]"
                    />
                  ) : (
                    <WarningCircle
                      size={18}
                      weight="bold"
                      className="text-[var(--foreground-warning)]"
                    />
                  )}
                  <span
                    className={cn(
                      "text-caption",
                      check.complete
                        ? "text-[var(--foreground-default)]"
                        : "text-[var(--foreground-warning)]"
                    )}
                  >
                    {check.label}
                  </span>
                </div>
                {!check.complete && (
                  <button
                    type="button"
                    onClick={() => router.push(check.editPath)}
                    className="flex items-center gap-1 text-caption font-medium text-[var(--foreground-brand)] transition-colors hover:text-[var(--foreground-brand-emphasis)]"
                  >
                    <PencilSimple size={14} weight="bold" />
                    Edit
                  </button>
                )}
              </div>
            ))}
          </div>
        </FormCard>

        {/* Profile Preview */}
        <FormCard>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-body-sm font-medium text-[var(--foreground-default)]">
              Profile preview
            </p>
            <button
              type="button"
              onClick={() => router.push("/onboarding/coach/about")}
              className="flex items-center gap-1 text-caption font-medium text-[var(--foreground-brand)] transition-colors hover:text-[var(--foreground-brand-emphasis)]"
            >
              <PencilSimple size={14} weight="bold" />
              Edit
            </button>
          </div>

          {/* Coach card mock */}
          <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--background-default)] p-5">
            <div className="flex items-start gap-4">
              {/* Photo */}
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[var(--background-subtle)]">
                {coachData.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coachData.photoUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User size={28} weight="light" className="text-[var(--foreground-subtle)]" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-body-sm font-medium text-[var(--foreground-default)]">
                  {baseProfile.firstName} {baseProfile.lastName}
                </p>
                {coachData.tagline && (
                  <p className="mt-0.5 text-caption text-[var(--foreground-muted)]">
                    {coachData.tagline}
                  </p>
                )}
                {coachData.location && (
                  <div className="mt-1 flex items-center gap-1 text-caption text-[var(--foreground-subtle)]">
                    <MapPin size={14} />
                    <span>{coachData.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio excerpt */}
            {coachData.bio && (
              <p className="mt-4 line-clamp-3 text-caption text-[var(--foreground-muted)]">
                {coachData.bio}
              </p>
            )}

            {/* Tags */}
            {coachData.coachingTypes.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {coachData.coachingTypes.map((type) => (
                  <span
                    key={type}
                    className="rounded-md bg-[var(--background-brand-subtle)] px-2 py-0.5 text-caption-sm font-medium text-[var(--foreground-brand)]"
                  >
                    {type.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            )}
          </div>
        </FormCard>

        {/* Services Summary */}
        <FormCard>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-body-sm font-medium text-[var(--foreground-default)]">Services</p>
            <button
              type="button"
              onClick={() => router.push("/onboarding/coach/services")}
              className="flex items-center gap-1 text-caption font-medium text-[var(--foreground-brand)] transition-colors hover:text-[var(--foreground-brand-emphasis)]"
            >
              <PencilSimple size={14} weight="bold" />
              Edit
            </button>
          </div>
          <div className="space-y-3">
            {coachData.services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-lg border border-[var(--border-muted)] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Briefcase size={18} className="text-[var(--foreground-subtle)]" />
                  <div>
                    <p className="text-caption font-medium text-[var(--foreground-default)]">
                      {service.name || "Unnamed service"}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-caption-sm text-[var(--foreground-muted)]">
                      <span className="flex items-center gap-0.5">
                        <Clock size={12} />
                        {service.duration} min
                      </span>
                      <span className="flex items-center gap-0.5">
                        <CurrencyDollar size={12} />
                        {formatPrice(service.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FormCard>

        {/* Availability Summary */}
        <FormCard>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-body-sm font-medium text-[var(--foreground-default)]">
              Availability
            </p>
            <button
              type="button"
              onClick={() => router.push("/onboarding/coach/availability")}
              className="flex items-center gap-1 text-caption font-medium text-[var(--foreground-brand)] transition-colors hover:text-[var(--foreground-brand-emphasis)]"
            >
              <PencilSimple size={14} weight="bold" />
              Edit
            </button>
          </div>
          <div className="space-y-2">
            {activeDays.length > 0 ? (
              activeDays.map((day) => {
                const slot = coachData.weeklySchedule[day.key];
                if (!slot) return null;
                return (
                  <div
                    key={day.key}
                    className="flex items-center justify-between rounded-lg border border-[var(--border-muted)] px-4 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarCheck size={16} className="text-[var(--foreground-subtle)]" />
                      <span className="text-caption font-medium text-[var(--foreground-default)]">
                        {day.short}
                      </span>
                    </div>
                    <span className="text-caption text-[var(--foreground-muted)]">
                      {formatTime(slot.start)} – {formatTime(slot.end)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-caption text-[var(--foreground-muted)]">No availability set</p>
            )}
          </div>
        </FormCard>

        {/* Certifications */}
        {coachData.certifications.length > 0 && (
          <FormCard>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-body-sm font-medium text-[var(--foreground-default)]">
                Certifications
              </p>
              <button
                type="button"
                onClick={() => router.push("/onboarding/coach/expertise")}
                className="flex items-center gap-1 text-caption font-medium text-[var(--foreground-brand)] transition-colors hover:text-[var(--foreground-brand-emphasis)]"
              >
                <PencilSimple size={14} weight="bold" />
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {coachData.certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--background-brand-subtle)] px-3 py-1.5 text-caption font-medium text-[var(--foreground-brand)]"
                >
                  <Certificate size={14} />
                  {cert}
                </span>
              ))}
            </div>
          </FormCard>
        )}
      </div>
    </OnboardingShell>
  );
}

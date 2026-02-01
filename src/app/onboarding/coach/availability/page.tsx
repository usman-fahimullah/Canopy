"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { FormCard, FormField } from "@/components/ui/form-section";
import { COACH_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const availabilityOptions = [
  {
    value: "1-2",
    label: "1-2 hours/week",
    description: "Light commitment — a few sessions per month",
  },
  {
    value: "3-5",
    label: "3-5 hours/week",
    description: "Regular engagement — several sessions per week",
  },
  {
    value: "5+",
    label: "5+ hours/week",
    description: "Full practice — coaching is a significant part of your work",
  },
];

export default function CoachAvailabilityPage() {
  const router = useRouter();
  const { coachData, setCoachData, baseProfile } = useOnboardingForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = COACH_STEPS[3]; // availability
  const canContinue = coachData.availability !== null;

  async function handleContinue() {
    if (!canContinue) return;
    setLoading(true);
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
          bio: coachData.bio || baseProfile.bio || undefined,
          headline: coachData.headline,
          sectors: coachData.sectors,
          expertise: coachData.expertise,
          sessionTypes: coachData.sessionTypes,
          sessionRate: coachData.sessionRate,
          yearsInClimate: coachData.yearsInClimate,
          availability: coachData.availability,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/onboarding/complete");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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
          onContinue={handleContinue}
          canContinue={canContinue}
          loading={loading}
          continueLabel="Submit application"
        />
      }
    >
      <div className="space-y-6">
        <FormCard>
          <FormField label="How much time can you dedicate to coaching?" required>
            <div className="space-y-3">
              {availabilityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCoachData({ availability: option.value })}
                  className={cn(
                    "w-full rounded-xl border-2 p-4 text-left transition-all",
                    coachData.availability === option.value
                      ? "border-[var(--candid-foreground-brand)] bg-[var(--primitive-green-100)]"
                      : "border-[var(--primitive-neutral-200)] bg-white hover:border-[var(--primitive-neutral-400)]"
                  )}
                >
                  <p className="text-foreground-default text-body-sm font-medium">{option.label}</p>
                  <p className="mt-0.5 text-caption text-foreground-muted">{option.description}</p>
                </button>
              ))}
            </div>
          </FormField>
        </FormCard>

        <div className="rounded-xl border border-[var(--primitive-yellow-300)] bg-[var(--primitive-yellow-100)] p-4">
          <p className="text-foreground-default mb-1 text-caption font-medium">
            What happens next?
          </p>
          <p className="text-caption text-foreground-muted">
            Your coaching profile will be reviewed by our team. Once approved, you&apos;ll appear in
            client search results and can start accepting bookings.
          </p>
        </div>
      </div>

      {error && <p className="mt-4 text-caption text-[var(--primitive-red-600)]">{error}</p>}
    </OnboardingShell>
  );
}

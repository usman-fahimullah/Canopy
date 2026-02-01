"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { FormCard, FormField, FormRow } from "@/components/ui/form-section";
import { TALENT_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const roleTypeOptions = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const timelineOptions = [
  { value: "actively-looking", label: "Actively looking" },
  { value: "3-months", label: "Within 3 months" },
  { value: "6-months", label: "Within 6 months" },
  { value: "exploring", label: "Just exploring" },
];

const locationOptions = [
  { value: "remote-only", label: "Remote only" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on-site", label: "On-site" },
  { value: "no-preference", label: "No preference" },
];

export default function TalentPreferencesPage() {
  const router = useRouter();
  const { talentData, setTalentData, baseProfile } = useOnboardingForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = TALENT_STEPS[2]; // preferences
  const canContinue =
    talentData.roleTypes.length > 0 &&
    talentData.transitionTimeline !== null &&
    talentData.locationPreference !== null;

  function toggleRoleType(value: string) {
    const current = talentData.roleTypes;
    if (current.includes(value)) {
      setTalentData({ roleTypes: current.filter((r) => r !== value) });
    } else {
      setTalentData({ roleTypes: [...current, value] });
    }
  }

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
          shell: "talent",
          firstName: baseProfile.firstName,
          lastName: baseProfile.lastName,
          linkedinUrl: baseProfile.linkedinUrl || undefined,
          bio: baseProfile.bio || undefined,
          careerStage: talentData.careerStage,
          yearsExperience: talentData.yearsExperience,
          jobTitle: talentData.jobTitle || undefined,
          skills: talentData.skills,
          sectors: talentData.sectors,
          roleTypes: talentData.roleTypes,
          transitionTimeline: talentData.transitionTimeline,
          locationPreference: talentData.locationPreference,
          salaryRange:
            talentData.salaryMin || talentData.salaryMax
              ? {
                  min: talentData.salaryMin ? parseInt(talentData.salaryMin) : null,
                  max: talentData.salaryMax ? parseInt(talentData.salaryMax) : null,
                }
              : undefined,
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
      shell="talent"
      step={step}
      currentStepIndex={2}
      totalSteps={TALENT_STEPS.length}
    >
      <div className="space-y-6">
        {/* Role types */}
        <FormCard>
          <FormField label="What type of roles are you interested in?" required>
            <div className="flex flex-wrap gap-2">
              {roleTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleRoleType(option.value)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-caption font-medium transition-all",
                    talentData.roleTypes.includes(option.value)
                      ? "border-[var(--candid-foreground-brand)] bg-[var(--primitive-green-100)] text-[var(--candid-foreground-brand)]"
                      : "border-[var(--primitive-neutral-200)] bg-white text-foreground-muted hover:border-[var(--primitive-neutral-400)]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FormField>
        </FormCard>

        {/* Timeline */}
        <FormCard>
          <FormField label="When are you looking to start?" required>
            <div className="flex flex-wrap gap-2">
              {timelineOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTalentData({ transitionTimeline: option.value })}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-caption font-medium transition-all",
                    talentData.transitionTimeline === option.value
                      ? "border-[var(--candid-foreground-brand)] bg-[var(--primitive-green-100)] text-[var(--candid-foreground-brand)]"
                      : "border-[var(--primitive-neutral-200)] bg-white text-foreground-muted hover:border-[var(--primitive-neutral-400)]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FormField>
        </FormCard>

        {/* Location preference */}
        <FormCard>
          <FormField label="Location preference" required>
            <div className="flex flex-wrap gap-2">
              {locationOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTalentData({ locationPreference: option.value })}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-caption font-medium transition-all",
                    talentData.locationPreference === option.value
                      ? "border-[var(--candid-foreground-brand)] bg-[var(--primitive-green-100)] text-[var(--candid-foreground-brand)]"
                      : "border-[var(--primitive-neutral-200)] bg-white text-foreground-muted hover:border-[var(--primitive-neutral-400)]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FormField>
        </FormCard>

        {/* Salary range */}
        <FormCard>
          <FormField label="Salary expectations" helpText="Optional — helps us match better">
            <FormRow>
              <div>
                <Input
                  placeholder="Min (e.g. 60000)"
                  value={talentData.salaryMin}
                  onChange={(e) => setTalentData({ salaryMin: e.target.value })}
                  type="number"
                />
              </div>
              <div>
                <Input
                  placeholder="Max (e.g. 90000)"
                  value={talentData.salaryMax}
                  onChange={(e) => setTalentData({ salaryMax: e.target.value })}
                  type="number"
                />
              </div>
            </FormRow>
          </FormField>
        </FormCard>
      </div>

      {error && (
        <p className="mt-4 text-caption text-[var(--primitive-red-600)]">{error}</p>
      )}

      <StepNavigation
        onBack={() => router.push("/onboarding/talent/skills")}
        onContinue={handleContinue}
        canContinue={canContinue}
        loading={loading}
        continueLabel="Finish setup"
      />
    </OnboardingShell>
  );
}

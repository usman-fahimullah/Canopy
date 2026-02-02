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

const remotePreferenceOptions = [
  { value: "onsite-only", label: "On-site only" },
  { value: "hybrid-preferred", label: "Hybrid preferred" },
  { value: "remote-preferred", label: "Remote preferred" },
  { value: "remote-only", label: "Remote only" },
  { value: "open-to-all", label: "Open to all" },
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
    talentData.locationPreference !== null &&
    talentData.remotePreference !== null;

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
          pathways: talentData.pathways,
          categories: talentData.categories,
          goals: talentData.goals || undefined,
          workExperience:
            talentData.workExperience.length > 0
              ? talentData.workExperience
                  .filter((exp) => exp.title && exp.company)
                  .map(({ id: _id, ...rest }) => rest)
              : undefined,
          roleTypes: talentData.roleTypes,
          transitionTimeline: talentData.transitionTimeline,
          locationPreference: talentData.locationPreference,
          remotePreference: talentData.remotePreference,
          salaryRange:
            talentData.salaryMin || talentData.salaryMax
              ? {
                  min: talentData.salaryMin
                    ? parseInt(talentData.salaryMin, 10)
                    : null,
                  max: talentData.salaryMax
                    ? parseInt(talentData.salaryMax, 10)
                    : null,
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
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/jobs/skills")}
          onContinue={handleContinue}
          canContinue={canContinue}
          loading={loading}
          continueLabel="Find my matches"
        />
      }
    >
      <div className="space-y-6">
        {/* Role types */}
        <FormCard>
          <FormField
            label="What type of roles are you interested in?"
            required
          >
            <div className="flex flex-wrap gap-2">
              {roleTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleRoleType(option.value)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-caption font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2",
                    talentData.roleTypes.includes(option.value)
                      ? "border-[var(--candid-foreground-brand)] bg-[var(--background-brand-subtle)] text-[var(--candid-foreground-brand)]"
                      : "border-[var(--border-muted)] bg-[var(--background-interactive-default)] text-foreground-muted hover:border-[var(--border-interactive-hover)]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FormField>
        </FormCard>

        {/* Remote preference */}
        <FormCard>
          <FormField label="Remote preference" required>
            <div className="flex flex-wrap gap-2">
              {remotePreferenceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setTalentData({ remotePreference: option.value })
                  }
                  className={cn(
                    "rounded-lg border px-4 py-2 text-caption font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2",
                    talentData.remotePreference === option.value
                      ? "border-[var(--candid-foreground-brand)] bg-[var(--background-brand-subtle)] text-[var(--candid-foreground-brand)]"
                      : "border-[var(--border-muted)] bg-[var(--background-interactive-default)] text-foreground-muted hover:border-[var(--border-interactive-hover)]"
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
                  onClick={() =>
                    setTalentData({ transitionTimeline: option.value })
                  }
                  className={cn(
                    "rounded-lg border px-4 py-2 text-caption font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2",
                    talentData.transitionTimeline === option.value
                      ? "border-[var(--candid-foreground-brand)] bg-[var(--background-brand-subtle)] text-[var(--candid-foreground-brand)]"
                      : "border-[var(--border-muted)] bg-[var(--background-interactive-default)] text-foreground-muted hover:border-[var(--border-interactive-hover)]"
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
                  onClick={() =>
                    setTalentData({ locationPreference: option.value })
                  }
                  className={cn(
                    "rounded-lg border px-4 py-2 text-caption font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2",
                    talentData.locationPreference === option.value
                      ? "border-[var(--candid-foreground-brand)] bg-[var(--background-brand-subtle)] text-[var(--candid-foreground-brand)]"
                      : "border-[var(--border-muted)] bg-[var(--background-interactive-default)] text-foreground-muted hover:border-[var(--border-interactive-hover)]"
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
          <FormField
            label="Salary expectations"
            helpText="Optional — helps us match better"
          >
            <FormRow>
              <div>
                <Input
                  placeholder="Min (e.g. 60000)"
                  value={talentData.salaryMin}
                  onChange={(e) =>
                    setTalentData({ salaryMin: e.target.value })
                  }
                  type="number"
                />
              </div>
              <div>
                <Input
                  placeholder="Max (e.g. 90000)"
                  value={talentData.salaryMax}
                  onChange={(e) =>
                    setTalentData({ salaryMax: e.target.value })
                  }
                  type="number"
                />
              </div>
            </FormRow>
          </FormField>
        </FormCard>
      </div>

      {error && (
        <p className="mt-4 text-caption text-[var(--foreground-error)]">
          {error}
        </p>
      )}
    </OnboardingShell>
  );
}

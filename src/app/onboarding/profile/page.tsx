"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormCard, FormField, FormRow } from "@/components/ui/form-section";
import { SHELL_ONBOARDING_SLUGS, STEPS_BY_SHELL } from "@/lib/onboarding/types";

const PROFILE_STEP = {
  id: "profile",
  path: "profile",
  title: "About you",
  subtitle: "Let's start with the basics. You can always update these later.",
};

export default function OnboardingProfilePage() {
  const router = useRouter();
  const { baseProfile, setBaseProfile, selectedShell } = useOnboardingForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue =
    baseProfile.firstName.trim().length > 0 && baseProfile.lastName.trim().length > 0;

  async function handleContinue() {
    if (!canContinue) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete-profile",
          firstName: baseProfile.firstName,
          lastName: baseProfile.lastName,
          linkedinUrl: baseProfile.linkedinUrl || undefined,
          bio: baseProfile.bio || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      // Route directly to the first step of the selected shell's onboarding
      if (selectedShell) {
        const slug = SHELL_ONBOARDING_SLUGS[selectedShell];
        const firstStep = STEPS_BY_SHELL[selectedShell][0];
        if (slug && firstStep) {
          router.push(`/onboarding/${slug}/${firstStep.path}`);
          return;
        }
      }

      // Fallback: use auth/redirect resolver if shell is unknown
      router.push("/auth/redirect");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingShell
      step={PROFILE_STEP}
      footer={
        <StepNavigation onContinue={handleContinue} canContinue={canContinue} loading={loading} />
      }
    >
      <FormCard>
        <FormRow>
          <FormField label="First name" required>
            <Input
              placeholder="Jane"
              value={baseProfile.firstName}
              onChange={(e) => setBaseProfile({ firstName: e.target.value })}
              autoComplete="given-name"
              autoFocus
            />
          </FormField>
          <FormField label="Last name" required>
            <Input
              placeholder="Doe"
              value={baseProfile.lastName}
              onChange={(e) => setBaseProfile({ lastName: e.target.value })}
              autoComplete="family-name"
            />
          </FormField>
        </FormRow>

        <FormField
          label="LinkedIn URL"
          helpText="Optional, but helps us personalize your experience"
        >
          <Input
            placeholder="https://linkedin.com/in/your-profile"
            value={baseProfile.linkedinUrl}
            onChange={(e) => setBaseProfile({ linkedinUrl: e.target.value })}
            autoComplete="url"
          />
        </FormField>

        <FormField label="Bio" helpText="A short intro about yourself">
          <Textarea
            placeholder="Tell us a bit about your background and what you're passionate about..."
            value={baseProfile.bio}
            onChange={(e) => setBaseProfile({ bio: e.target.value })}
            rows={3}
          />
        </FormField>
      </FormCard>

      {error && <p className="mt-4 text-caption text-[var(--primitive-red-600)]">{error}</p>}
    </OnboardingShell>
  );
}

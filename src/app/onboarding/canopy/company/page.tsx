"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InlineMessage } from "@/components/ui/inline-message";
import { FormCard, FormField, FormRow } from "@/components/ui/form-section";
import { EMPLOYER_STEPS } from "@/lib/onboarding/types";

export default function EmployerCompanyPage() {
  const router = useRouter();
  const { employerData, setEmployerData, baseProfile, setBaseProfile } = useOnboardingForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = EMPLOYER_STEPS[0]; // company
  const canContinue =
    baseProfile.firstName.trim().length > 0 &&
    baseProfile.lastName.trim().length > 0 &&
    employerData.companyName.trim().length > 0;

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

      if (res.status === 401) {
        router.push("/auth/redirect");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "We couldn\u2019t save your company details. Please try again.");
        return;
      }

      router.push("/onboarding/canopy/size-industry");
    } catch {
      setError(
        "Could not connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingShell
      shell="employer"
      step={step}
      currentStepIndex={0}
      totalSteps={EMPLOYER_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding")}
          onContinue={handleContinue}
          canContinue={canContinue}
          loading={loading}
        />
      }
    >
      <div className="space-y-6">
        {/* About you */}
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

        {/* Company info */}
        <FormCard>
          <FormField label="Company name" required>
            <Input
              placeholder="e.g. Solaris Energy Co."
              value={employerData.companyName}
              onChange={(e) => setEmployerData({ companyName: e.target.value })}
            />
          </FormField>

          <FormField
            label="About your company"
            helpText="A brief description of what your organization does"
          >
            <Textarea
              placeholder="Tell candidates about your mission, impact, and what makes your company a great place to work..."
              value={employerData.companyDescription}
              onChange={(e) => setEmployerData({ companyDescription: e.target.value })}
              rows={4}
            />
          </FormField>
        </FormCard>

        <FormCard>
          <FormRow>
            <FormField label="Website">
              <Input
                placeholder="https://your-company.com"
                value={employerData.companyWebsite}
                onChange={(e) => setEmployerData({ companyWebsite: e.target.value })}
                type="url"
              />
            </FormField>
            <FormField label="Location">
              <Input
                placeholder="e.g. San Francisco, CA"
                value={employerData.companyLocation}
                onChange={(e) => setEmployerData({ companyLocation: e.target.value })}
              />
            </FormField>
          </FormRow>
        </FormCard>

        {error && <InlineMessage variant="critical">{error}</InlineMessage>}
      </div>
    </OnboardingShell>
  );
}

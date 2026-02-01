"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { FormCard, FormField } from "@/components/ui/form-section";
import { EMPLOYER_STEPS } from "@/lib/onboarding/types";

export default function EmployerYourRolePage() {
  const router = useRouter();
  const { employerData, setEmployerData, baseProfile } = useOnboardingForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = EMPLOYER_STEPS[1]; // your-role
  const canContinue = employerData.userTitle.trim().length > 0;

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
          shell: "employer",
          firstName: baseProfile.firstName,
          lastName: baseProfile.lastName,
          linkedinUrl: baseProfile.linkedinUrl || undefined,
          bio: baseProfile.bio || undefined,
          companyName: employerData.companyName,
          companyDescription: employerData.companyDescription || undefined,
          companyWebsite: employerData.companyWebsite || undefined,
          companyLocation: employerData.companyLocation || undefined,
          companySize: employerData.companySize || undefined,
          userTitle: employerData.userTitle,
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
      shell="employer"
      step={step}
      currentStepIndex={1}
      totalSteps={EMPLOYER_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/canopy/company")}
          onContinue={handleContinue}
          canContinue={canContinue}
          loading={loading}
          continueLabel="Start hiring"
        />
      }
    >
      <div className="space-y-6">
        <FormCard>
          <FormField label="Your job title" required helpText="Your role at the company">
            <Input
              placeholder="e.g. Head of People, Talent Acquisition Manager"
              value={employerData.userTitle}
              onChange={(e) => setEmployerData({ userTitle: e.target.value })}
              autoFocus
            />
          </FormField>
        </FormCard>

        <div className="rounded-xl border border-[var(--primitive-blue-300)] bg-[var(--primitive-blue-100)] p-4">
          <p className="text-foreground-default mb-1 text-caption font-medium">
            What you&apos;ll get
          </p>
          <ul className="space-y-1 text-caption text-foreground-muted">
            <li>Post unlimited climate-focused job roles</li>
            <li>Access AI-powered candidate sourcing</li>
            <li>Manage your hiring pipeline with a design-forward ATS</li>
            <li>Invite team members to collaborate on hiring</li>
          </ul>
        </div>
      </div>

      {error && <p className="mt-4 text-caption text-[var(--primitive-red-600)]">{error}</p>}
    </OnboardingShell>
  );
}

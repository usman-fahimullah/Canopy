"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { FormCard, FormField } from "@/components/ui/form-section";
import { EMPLOYER_STEPS } from "@/lib/onboarding/types";

export default function EmployerYourRolePage() {
  const router = useRouter();
  const { employerData, setEmployerData } = useOnboardingForm();

  const step = EMPLOYER_STEPS[2]; // your-role
  const canContinue = employerData.userTitle.trim().length > 0;

  return (
    <OnboardingShell
      shell="employer"
      step={step}
      currentStepIndex={2}
      totalSteps={EMPLOYER_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/canopy/size-industry")}
          onContinue={() => router.push("/onboarding/canopy/hiring-goals")}
          canContinue={canContinue}
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

        <div className="rounded-[var(--radius-card)] border border-[var(--border-info)] bg-[var(--background-info)] p-4">
          <p className="text-[var(--foreground-default)] mb-1 text-caption font-medium">
            What you&apos;ll get
          </p>
          <ul className="space-y-1 text-caption text-[var(--foreground-muted)]">
            <li>Post unlimited climate-focused job roles</li>
            <li>Access AI-powered candidate sourcing</li>
            <li>Manage your hiring pipeline with a design-forward ATS</li>
            <li>Invite team members to collaborate on hiring</li>
          </ul>
        </div>
      </div>
    </OnboardingShell>
  );
}

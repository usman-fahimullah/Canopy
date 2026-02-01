"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { FormCard, FormField } from "@/components/ui/form-section";
import { TALENT_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const careerStageOptions = [
  { value: "STUDENT", label: "Student", description: "Currently in school" },
  { value: "ENTRY_LEVEL", label: "Entry Level", description: "0-2 years experience" },
  { value: "MID_CAREER", label: "Mid-Career", description: "3-7 years experience" },
  { value: "SENIOR", label: "Senior", description: "7+ years experience" },
  {
    value: "CAREER_CHANGER",
    label: "Career Changer",
    description: "Transitioning from another field",
  },
  { value: "RETURNING", label: "Returning", description: "Re-entering the workforce" },
];

const yearsOptions = [
  { value: "less-than-1", label: "Less than 1 year" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-7", label: "3-7 years" },
  { value: "7-10", label: "7-10 years" },
  { value: "10+", label: "10+ years" },
];

export default function TalentBackgroundPage() {
  const router = useRouter();
  const { talentData, setTalentData } = useOnboardingForm();

  const step = TALENT_STEPS[0]; // background
  const canContinue = talentData.careerStage !== null;

  return (
    <OnboardingShell
      shell="talent"
      step={step}
      currentStepIndex={0}
      totalSteps={TALENT_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/profile")}
          onContinue={() => router.push("/onboarding/talent/skills")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        {/* Career stage */}
        <FormCard>
          <FormField label="Where are you in your career?" required>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {careerStageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTalentData({ careerStage: option.value })}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-all",
                    talentData.careerStage === option.value
                      ? "border-[var(--candid-foreground-brand)] bg-[var(--primitive-green-100)]"
                      : "border-[var(--primitive-neutral-200)] bg-white hover:border-[var(--primitive-neutral-400)]"
                  )}
                >
                  <p className="text-foreground-default text-body-sm font-medium">{option.label}</p>
                  <p className="mt-0.5 text-caption-sm text-foreground-muted">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </FormField>
        </FormCard>

        {/* Years of experience */}
        <FormCard>
          <FormField label="Years of experience" helpText="In any field, not just climate">
            <div className="flex flex-wrap gap-2">
              {yearsOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTalentData({ yearsExperience: option.value })}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-caption font-medium transition-all",
                    talentData.yearsExperience === option.value
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

        {/* Job title */}
        <FormCard>
          <FormField label="Current or most recent job title" helpText="Optional">
            <Input
              placeholder="e.g. Software Engineer, Policy Analyst"
              value={talentData.jobTitle}
              onChange={(e) => setTalentData({ jobTitle: e.target.value })}
            />
          </FormField>
        </FormCard>
      </div>
    </OnboardingShell>
  );
}

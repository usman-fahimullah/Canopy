"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormCard, FormField } from "@/components/ui/form-section";
import { COACH_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const yearsInClimateOptions = [
  { value: "1-3", label: "1-3 years" },
  { value: "3-7", label: "3-7 years" },
  { value: "7-15", label: "7-15 years" },
  { value: "15+", label: "15+ years" },
];

export default function CoachAboutPage() {
  const router = useRouter();
  const { coachData, setCoachData } = useOnboardingForm();

  const step = COACH_STEPS[0]; // about
  const canContinue = coachData.headline.trim().length > 0 && coachData.bio.trim().length > 0;

  return (
    <OnboardingShell
      shell="coach"
      step={step}
      currentStepIndex={0}
      totalSteps={COACH_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/profile")}
          onContinue={() => router.push("/onboarding/coach/expertise")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        <FormCard>
          <FormField
            label="Headline"
            required
            helpText='How you want to be introduced (e.g. "Climate Career Strategist")'
          >
            <Input
              placeholder="e.g. Climate Career Strategist | Ex-McKinsey"
              value={coachData.headline}
              onChange={(e) => setCoachData({ headline: e.target.value })}
              autoFocus
            />
          </FormField>

          <FormField
            label="Bio"
            required
            helpText="Tell potential clients about your background and approach"
          >
            <Textarea
              placeholder="Share your coaching philosophy, background, and what makes you passionate about helping people transition into climate careers..."
              value={coachData.bio}
              onChange={(e) => setCoachData({ bio: e.target.value })}
              rows={5}
            />
          </FormField>
        </FormCard>

        <FormCard>
          <FormField
            label="Years in climate / sustainability"
            helpText="How long you've been working in climate-related fields"
          >
            <div className="flex flex-wrap gap-2">
              {yearsInClimateOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCoachData({ yearsInClimate: option.value })}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-caption font-medium transition-all",
                    coachData.yearsInClimate === option.value
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
      </div>
    </OnboardingShell>
  );
}

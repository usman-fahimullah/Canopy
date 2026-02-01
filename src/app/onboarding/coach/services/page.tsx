"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { FormCard, FormField } from "@/components/ui/form-section";
import { COACH_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const sessionTypeOptions = [
  {
    value: "one-on-one",
    label: "1:1 Coaching",
    description: "Individual coaching sessions",
  },
  {
    value: "resume-review",
    label: "Resume Review",
    description: "Async resume and LinkedIn feedback",
  },
  {
    value: "mock-interview",
    label: "Mock Interviews",
    description: "Practice interviews with feedback",
  },
  {
    value: "career-strategy",
    label: "Career Strategy",
    description: "Long-term career planning sessions",
  },
  {
    value: "group-workshop",
    label: "Group Workshop",
    description: "Facilitate group learning sessions",
  },
];

export default function CoachServicesPage() {
  const router = useRouter();
  const { coachData, setCoachData } = useOnboardingForm();

  const step = COACH_STEPS[2]; // services
  const canContinue = coachData.sessionTypes.length > 0;

  function toggleSessionType(value: string) {
    const current = coachData.sessionTypes;
    if (current.includes(value)) {
      setCoachData({ sessionTypes: current.filter((s) => s !== value) });
    } else {
      setCoachData({ sessionTypes: [...current, value] });
    }
  }

  // Format cents to dollars for display
  const rateInDollars = Math.round(coachData.sessionRate / 100);

  return (
    <OnboardingShell
      shell="coach"
      step={step}
      currentStepIndex={2}
      totalSteps={COACH_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/coach/expertise")}
          onContinue={() => router.push("/onboarding/coach/availability")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        {/* Session types */}
        <FormCard>
          <FormField label="What services do you offer?" required>
            <div className="space-y-3">
              {sessionTypeOptions.map((option) => {
                const selected = coachData.sessionTypes.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleSessionType(option.value)}
                    className={cn(
                      "w-full rounded-xl border-2 p-4 text-left transition-all",
                      selected
                        ? "border-[var(--candid-foreground-brand)] bg-[var(--primitive-green-100)]"
                        : "border-[var(--primitive-neutral-200)] bg-white hover:border-[var(--primitive-neutral-400)]"
                    )}
                  >
                    <p className="text-foreground-default text-body-sm font-medium">
                      {option.label}
                    </p>
                    <p className="mt-0.5 text-caption text-foreground-muted">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </FormField>
        </FormCard>

        {/* Session rate */}
        <FormCard>
          <FormField
            label="Session rate"
            helpText="Your hourly rate in USD. You can adjust this anytime."
          >
            <div className="flex items-center gap-3">
              <span className="text-body-sm font-medium text-foreground-muted">$</span>
              <Input
                type="number"
                placeholder="150"
                value={rateInDollars > 0 ? rateInDollars.toString() : ""}
                onChange={(e) => {
                  const dollars = parseInt(e.target.value) || 0;
                  setCoachData({ sessionRate: dollars * 100 });
                }}
                className="max-w-[140px]"
              />
              <span className="text-caption text-foreground-muted">per hour</span>
            </div>
          </FormField>
        </FormCard>
      </div>
    </OnboardingShell>
  );
}

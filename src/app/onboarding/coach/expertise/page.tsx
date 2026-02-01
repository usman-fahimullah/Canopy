"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { FormCard, FormField } from "@/components/ui/form-section";
import { COACH_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const sectorOptions = [
  { value: "climate-tech", label: "Climate Tech" },
  { value: "clean-energy", label: "Clean Energy" },
  { value: "policy", label: "Climate Policy" },
  { value: "finance", label: "Green Finance" },
  { value: "nonprofit", label: "Nonprofit / NGO" },
  { value: "corporate-sustainability", label: "Corporate Sustainability" },
  { value: "agriculture", label: "Sustainable Agriculture" },
  { value: "transportation", label: "Clean Transportation" },
];

const expertiseOptions = [
  { value: "career-transition", label: "Career Transitions" },
  { value: "resume-review", label: "Resume & LinkedIn" },
  { value: "interview-prep", label: "Interview Prep" },
  { value: "networking", label: "Networking Strategy" },
  { value: "leadership", label: "Leadership Development" },
  { value: "job-search", label: "Job Search Strategy" },
  { value: "salary-negotiation", label: "Salary Negotiation" },
  { value: "personal-branding", label: "Personal Branding" },
];

export default function CoachExpertisePage() {
  const router = useRouter();
  const { coachData, setCoachData } = useOnboardingForm();

  const step = COACH_STEPS[1]; // expertise
  const canContinue = coachData.sectors.length > 0 && coachData.expertise.length > 0;

  function toggleSector(value: string) {
    const current = coachData.sectors;
    if (current.includes(value)) {
      setCoachData({ sectors: current.filter((s) => s !== value) });
    } else if (current.length < 5) {
      setCoachData({ sectors: [...current, value] });
    }
  }

  function toggleExpertise(value: string) {
    const current = coachData.expertise;
    if (current.includes(value)) {
      setCoachData({ expertise: current.filter((e) => e !== value) });
    } else {
      setCoachData({ expertise: [...current, value] });
    }
  }

  return (
    <OnboardingShell
      shell="coach"
      step={step}
      currentStepIndex={1}
      totalSteps={COACH_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/coach/about")}
          onContinue={() => router.push("/onboarding/coach/services")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        {/* Sectors */}
        <FormCard>
          <FormField label="Which sectors do you coach in?" helpText="Select up to 5" required>
            <div className="grid grid-cols-2 gap-3">
              {sectorOptions.map((option) => {
                const selected = coachData.sectors.includes(option.value);
                const disabled = !selected && coachData.sectors.length >= 5;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleSector(option.value)}
                    disabled={disabled}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left transition-all",
                      selected
                        ? "border-[var(--candid-foreground-brand)] bg-[var(--primitive-green-100)]"
                        : "border-[var(--primitive-neutral-200)] bg-white hover:border-[var(--primitive-neutral-400)]",
                      disabled && "cursor-not-allowed opacity-40"
                    )}
                  >
                    <p className="text-foreground-default text-caption font-medium">
                      {option.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </FormField>
        </FormCard>

        {/* Expertise areas */}
        <FormCard>
          <FormField label="Areas of expertise" required helpText="What do you help clients with?">
            <div className="flex flex-wrap gap-2">
              {expertiseOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleExpertise(option.value)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-caption font-medium transition-all",
                    coachData.expertise.includes(option.value)
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

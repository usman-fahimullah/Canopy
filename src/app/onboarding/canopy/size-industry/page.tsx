"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { PathwaySelector } from "@/components/onboarding/pathway-selector";
import { FormCard, FormField } from "@/components/ui/form-section";
import { EMPLOYER_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const companySizeOptions = [
  { value: "1-10", label: "1–10", sublabel: "Startup" },
  { value: "11-50", label: "11–50", sublabel: "Small" },
  { value: "51-200", label: "51–200", sublabel: "Mid-size" },
  { value: "201-1000", label: "201–1,000", sublabel: "Large" },
  { value: "1000+", label: "1,000+", sublabel: "Enterprise" },
];

export default function EmployerSizeIndustryPage() {
  const router = useRouter();
  const { employerData, setEmployerData } = useOnboardingForm();

  const step = EMPLOYER_STEPS[1]; // size-industry
  const canContinue = employerData.industries.length >= 1;

  return (
    <OnboardingShell
      shell="employer"
      step={step}
      currentStepIndex={1}
      totalSteps={EMPLOYER_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/canopy/company")}
          onContinue={() => router.push("/onboarding/canopy/your-role")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        <FormCard>
          <FormField label="Company size">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {companySizeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setEmployerData({ companySize: option.value })}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-[var(--radius-card)] border px-4 py-4 text-center transition-all",
                    employerData.companySize === option.value
                      ? "border-[var(--border-brand-emphasis)] bg-[var(--background-brand-subtle)] text-[var(--foreground-brand-emphasis)]"
                      : "border-[var(--border-muted)] bg-[var(--background-interactive-default)] text-[var(--foreground-default)] hover:border-[var(--border-interactive-hover)]"
                  )}
                >
                  <span className="text-body font-semibold">{option.label}</span>
                  <span className="text-caption-sm text-[var(--foreground-subtle)]">
                    {option.sublabel}
                  </span>
                </button>
              ))}
            </div>
          </FormField>
        </FormCard>

        <FormCard>
          <FormField
            label="Industry focus"
            required
            helpText="Select up to 3 climate sectors your company operates in"
          >
            <PathwaySelector
              selected={employerData.industries}
              onChange={(industries) => setEmployerData({ industries })}
              max={3}
            />
          </FormField>
        </FormCard>
      </div>
    </OnboardingShell>
  );
}

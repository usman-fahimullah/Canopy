"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormCard, FormField, FormRow } from "@/components/ui/form-section";
import { EMPLOYER_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const companySizeOptions = [
  { value: "1-10", label: "1-10" },
  { value: "11-50", label: "11-50" },
  { value: "51-200", label: "51-200" },
  { value: "201-1000", label: "201-1,000" },
  { value: "1000+", label: "1,000+" },
];

export default function EmployerCompanyPage() {
  const router = useRouter();
  const { employerData, setEmployerData } = useOnboardingForm();

  const step = EMPLOYER_STEPS[0]; // company
  const canContinue = employerData.companyName.trim().length > 0;

  return (
    <OnboardingShell
      shell="employer"
      step={step}
      currentStepIndex={0}
      totalSteps={EMPLOYER_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/profile")}
          onContinue={() => router.push("/onboarding/employer/your-role")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        <FormCard>
          <FormField label="Company name" required>
            <Input
              placeholder="e.g. Solaris Energy Co."
              value={employerData.companyName}
              onChange={(e) => setEmployerData({ companyName: e.target.value })}
              autoFocus
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

          <FormField label="Company size">
            <div className="flex flex-wrap gap-2">
              {companySizeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setEmployerData({ companySize: option.value })}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-caption font-medium transition-all",
                    employerData.companySize === option.value
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

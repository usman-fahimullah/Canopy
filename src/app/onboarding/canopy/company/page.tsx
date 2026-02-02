"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormCard, FormField, FormRow } from "@/components/ui/form-section";
import { EMPLOYER_STEPS } from "@/lib/onboarding/types";

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
          onContinue={() => router.push("/onboarding/canopy/size-industry")}
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
        </FormCard>
      </div>
    </OnboardingShell>
  );
}

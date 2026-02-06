"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "@phosphor-icons/react";
import { EMPLOYER_STEPS } from "@/lib/onboarding/types";

export default function EmployerYourRolePage() {
  const router = useRouter();
  const { employerData, setEmployerData, baseProfile, setBaseProfile } = useOnboardingForm();

  const step = EMPLOYER_STEPS[1]; // your-role
  const canContinue = employerData.userTitle.trim().length > 0;

  return (
    <OnboardingShell
      shell="employer"
      step={step}
      currentStepIndex={1}
      totalSteps={EMPLOYER_STEPS.length}
      companyName={employerData.companyName}
      rightPanel={
        <Image
          src="/illustrations/employer-onboarding-whatdoyoudo.png"
          alt="What do you do"
          width={560}
          height={560}
          className="h-auto w-full object-contain"
          priority
        />
      }
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/canopy/company")}
          onContinue={() => router.push("/onboarding/canopy/invite-team")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        {/* Job Title */}
        <div>
          <label className="mb-3 block text-caption font-bold text-[var(--primitive-green-800)]">
            Job Title
          </label>
          <Input
            placeholder="What is your job title?"
            value={employerData.userTitle}
            onChange={(e) => setEmployerData({ userTitle: e.target.value })}
            autoFocus
          />
        </div>

        {/* Phone Number (Optional) */}
        <div>
          <label className="mb-3 block text-caption font-bold text-[var(--primitive-green-800)]">
            Phone Number (Optional)
          </label>
          <Input
            placeholder="Enter your phone number"
            value={baseProfile.phone}
            onChange={(e) => setBaseProfile({ phone: e.target.value })}
            type="tel"
            autoComplete="tel"
          />
        </div>

        {/* LinkedIn Section */}
        <div className="space-y-4">
          <p className="text-body font-medium text-[var(--primitive-green-800)]">
            Connect your LinkedIn Profile to Green Jobs Board
          </p>
          <div>
            <label className="mb-3 block text-caption font-bold text-[var(--primitive-green-800)]">
              LinkedIn URL
            </label>
            <Input
              placeholder="Enter your LinkedIn profile URL"
              value={baseProfile.linkedinUrl}
              onChange={(e) => setBaseProfile({ linkedinUrl: e.target.value })}
              autoComplete="url"
            />
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[var(--border-muted)]" />

        {/* Profile Photo Upload */}
        <div className="space-y-4">
          <p className="text-body text-[var(--foreground-default)]">
            Add a photo to help build trust with potential applicants
          </p>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            leftIcon={<Camera size={18} weight="fill" />}
          >
            Upload your profile photo
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}

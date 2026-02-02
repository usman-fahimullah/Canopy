"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { CategorySelector } from "@/components/onboarding/category-selector";
import { Input } from "@/components/ui/input";
import { FormCard, FormField, FormRow } from "@/components/ui/form-section";
import { SegmentedController } from "@/components/ui/segmented-controller";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui";
import { EMPLOYER_STEPS } from "@/lib/onboarding/types";

const workTypeOptions = [
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
];

const employmentTypeOptions = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

export default function EmployerFirstRolePage() {
  const router = useRouter();
  const { employerData, setEmployerData } = useOnboardingForm();

  const step = EMPLOYER_STEPS[4]; // first-role

  // Initialize firstRole in form state if needed
  const role = employerData.firstRole ?? {
    title: "",
    category: null,
    location: "",
    workType: null,
    employmentType: null,
  };

  function updateRole(updates: Partial<typeof role>) {
    setEmployerData({
      firstRole: { ...role, ...updates },
    });
  }

  const canContinue = role.title.trim().length > 0;

  function handleContinue() {
    router.push("/onboarding/canopy/invite-team");
  }

  function handleSkip() {
    // Clear any partial role data when skipping
    setEmployerData({ firstRole: null });
    router.push("/onboarding/canopy/invite-team");
  }

  return (
    <OnboardingShell
      shell="employer"
      step={step}
      currentStepIndex={4}
      totalSteps={EMPLOYER_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/canopy/hiring-goals")}
          onContinue={handleContinue}
          canContinue={canContinue}
          continueLabel="Save & continue"
          onSkip={handleSkip}
          skipLabel="Skip for now"
        />
      }
    >
      <div className="space-y-6">
        <FormCard>
          <FormField
            label="Job title"
            required
            helpText="The title candidates will see"
          >
            <Input
              placeholder="e.g. Solar Project Manager, ESG Analyst"
              value={role.title}
              onChange={(e) => updateRole({ title: e.target.value })}
              autoFocus
            />
          </FormField>

          <FormField
            label="Role category"
            helpText="What type of work is this?"
          >
            <CategorySelector
              selected={role.category ? [role.category] : []}
              onChange={(cats) =>
                updateRole({ category: cats[0] ?? null })
              }
              max={1}
            />
          </FormField>
        </FormCard>

        <FormCard>
          <FormRow>
            <FormField label="Location">
              <Input
                placeholder="e.g. Austin, TX or Remote"
                value={role.location}
                onChange={(e) => updateRole({ location: e.target.value })}
              />
            </FormField>

            <FormField label="Employment type">
              <Dropdown
                value={role.employmentType ?? undefined}
                onValueChange={(val: string) =>
                  updateRole({ employmentType: val })
                }
              >
                <DropdownTrigger className="w-full">
                  <DropdownValue placeholder="Select type" />
                </DropdownTrigger>
                <DropdownContent>
                  {employmentTypeOptions.map((opt) => (
                    <DropdownItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </FormField>
          </FormRow>

          <FormField label="Work arrangement">
            <SegmentedController
              options={workTypeOptions}
              value={role.workType ?? undefined}
              onValueChange={(val: string) =>
                updateRole({
                  workType: val as "onsite" | "hybrid" | "remote",
                })
              }
              aria-label="Work type"
            />
          </FormField>
        </FormCard>
      </div>
    </OnboardingShell>
  );
}

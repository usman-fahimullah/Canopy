"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";
import { FormCard, FormField } from "@/components/ui/form-section";
import { TALENT_STEPS } from "@/lib/onboarding/types";

const careerStageOptions = [
  { value: "STUDENT", label: "Student" },
  { value: "ENTRY_LEVEL", label: "Entry Level" },
  { value: "MID_CAREER", label: "Mid-Career" },
  { value: "SENIOR", label: "Senior" },
  { value: "CAREER_CHANGER", label: "Career Changer" },
  { value: "RETURNING", label: "Returning" },
];

const goalOptions = [
  { value: "break-into-climate", label: "I want to break into the climate sector" },
  { value: "advance-career", label: "I want to advance my climate career" },
  { value: "career-change", label: "I'm looking to make a career change" },
  { value: "hands-on-experience", label: "I want to gain hands-on experience" },
  { value: "exploring", label: "I'm exploring climate opportunities" },
  { value: "build-network", label: "I want to build my network" },
];

const jobTypeOptions = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "volunteer", label: "Volunteer" },
  { value: "fellowship", label: "Fellowship" },
];

export default function TalentCareerPage() {
  const router = useRouter();
  const { talentData, setTalentData } = useOnboardingForm();

  const step = TALENT_STEPS[1]; // career
  const canContinue =
    talentData.careerStage !== null &&
    talentData.goals.length > 0 &&
    talentData.jobTypeInterests.length > 0;

  function toggleGoal(value: string) {
    const current = talentData.goals;
    if (current.includes(value)) {
      setTalentData({ goals: current.filter((g) => g !== value) });
    } else {
      setTalentData({ goals: [...current, value] });
    }
  }

  function toggleJobType(value: string) {
    const current = talentData.jobTypeInterests;
    if (current.includes(value)) {
      setTalentData({ jobTypeInterests: current.filter((j) => j !== value) });
    } else {
      setTalentData({ jobTypeInterests: [...current, value] });
    }
  }

  return (
    <OnboardingShell
      shell="talent"
      step={step}
      currentStepIndex={1}
      totalSteps={TALENT_STEPS.length}
      rightPanel={
        <Image
          src="/illustrations/onboarding-profile.svg"
          alt=""
          width={400}
          height={400}
          className="max-w-[80%]"
        />
      }
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/jobs/profile")}
          onContinue={() => router.push("/onboarding/jobs/skills")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        {/* Career stage */}
        <FormCard>
          <FormField label="First off, where are you in your career?" required>
            <Dropdown
              value={talentData.careerStage ?? undefined}
              onValueChange={(value) => setTalentData({ careerStage: value })}
            >
              <DropdownTrigger>
                <DropdownValue placeholder="Select your career stage" />
              </DropdownTrigger>
              <DropdownContent>
                {careerStageOptions.map((option) => (
                  <DropdownItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          </FormField>
        </FormCard>

        {/* Goals */}
        <FormCard>
          <FormField label="What are your goals?" required>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {goalOptions.map((option) => (
                <CheckboxWithLabel
                  key={option.value}
                  label={option.label}
                  checked={talentData.goals.includes(option.value)}
                  onCheckedChange={() => toggleGoal(option.value)}
                />
              ))}
            </div>
          </FormField>
        </FormCard>

        {/* Job type interests */}
        <FormCard>
          <FormField label="What types of jobs interest you?" required>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {jobTypeOptions.map((option) => (
                <CheckboxWithLabel
                  key={option.value}
                  label={option.label}
                  checked={talentData.jobTypeInterests.includes(option.value)}
                  onCheckedChange={() => toggleJobType(option.value)}
                />
              ))}
            </div>
          </FormField>
        </FormCard>
      </div>
    </OnboardingShell>
  );
}

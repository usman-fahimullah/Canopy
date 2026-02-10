"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import type { HiringGoal } from "@/components/onboarding/form-context";
import { EMPLOYER_STEPS } from "@/lib/onboarding/types";
import { Crosshair, ListChecks, MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const hiringGoalOptions: {
  value: HiringGoal;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "specific-role",
    label: "Hiring for a specific role",
    description: "You know the role you need to fill and want to start sourcing candidates.",
    icon: <Crosshair size={28} weight="duotone" />,
  },
  {
    value: "multiple-roles",
    label: "Hiring multiple roles",
    description: "You have several open positions across your team.",
    icon: <ListChecks size={28} weight="duotone" />,
  },
  {
    value: "exploring",
    label: "Exploring the talent pool",
    description: "You want to see what climate talent is available before committing to a role.",
    icon: <MagnifyingGlass size={28} weight="duotone" />,
  },
];

export default function EmployerHiringGoalsPage() {
  const router = useRouter();
  const { employerData, setEmployerData } = useOnboardingForm();

  const step = EMPLOYER_STEPS[3]; // hiring-goals
  const canContinue = employerData.hiringGoal !== null;

  function handleContinue() {
    if (employerData.hiringGoal === "exploring") {
      // Skip first-role step for explorers — go straight to invite-team
      router.push("/onboarding/canopy/invite-team");
    } else {
      router.push("/onboarding/canopy/first-role");
    }
  }

  return (
    <OnboardingShell
      shell="employer"
      step={step}
      currentStepIndex={3}
      totalSteps={EMPLOYER_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/canopy/your-role")}
          onContinue={handleContinue}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-4">
        {hiringGoalOptions.map((option) => {
          const isSelected = employerData.hiringGoal === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setEmployerData({ hiringGoal: option.value })}
              className={cn(
                "flex w-full items-start gap-4 rounded-[var(--radius-card)] border p-5 text-left transition-all",
                isSelected
                  ? "border-[var(--border-brand-emphasis)] bg-[var(--background-brand-subtle)] shadow-card"
                  : "border-[var(--border-muted)] bg-[var(--card-background)] hover:border-[var(--border-interactive-hover)] hover:shadow-card"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)]",
                  isSelected
                    ? "bg-[var(--background-brand)] text-[var(--foreground-on-emphasis)]"
                    : "bg-[var(--background-subtle)] text-[var(--foreground-muted)]"
                )}
              >
                {option.icon}
              </div>
              <div className="space-y-1">
                <p
                  className={cn(
                    "text-body font-semibold",
                    isSelected
                      ? "text-[var(--foreground-brand-emphasis)]"
                      : "text-[var(--foreground-default)]"
                  )}
                >
                  {option.label}
                </p>
                <p className="text-caption text-[var(--foreground-subtle)]">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </OnboardingShell>
  );
}

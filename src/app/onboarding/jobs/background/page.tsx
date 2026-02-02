"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash, Briefcase, CaretDown, CaretUp } from "@phosphor-icons/react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm, type WorkExperience } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormCard, FormField } from "@/components/ui/form-section";
import { CheckboxWithLabel } from "@/components/ui/checkbox";
import { TALENT_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const careerStageOptions = [
  { value: "STUDENT", label: "Student", description: "Currently in school" },
  {
    value: "ENTRY_LEVEL",
    label: "Entry Level",
    description: "0-2 years experience",
  },
  {
    value: "MID_CAREER",
    label: "Mid-Career",
    description: "3-7 years experience",
  },
  { value: "SENIOR", label: "Senior", description: "7+ years experience" },
  {
    value: "CAREER_CHANGER",
    label: "Career Changer",
    description: "Transitioning from another field",
  },
  {
    value: "RETURNING",
    label: "Returning",
    description: "Re-entering the workforce",
  },
];

const yearsOptions = [
  { value: "less-than-1", label: "Less than 1 year" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-7", label: "3-7 years" },
  { value: "7-10", label: "7-10 years" },
  { value: "10+", label: "10+ years" },
];

function createWorkExperience(): WorkExperience {
  return {
    id: crypto.randomUUID(),
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  };
}

export default function TalentBackgroundPage() {
  const router = useRouter();
  const { talentData, setTalentData } = useOnboardingForm();
  const workExperience = talentData.workExperience ?? [];
  const [showWorkExperience, setShowWorkExperience] = useState(workExperience.length > 0);

  const step = TALENT_STEPS[0]; // background
  const canContinue = talentData.careerStage !== null;

  function addWorkExperience() {
    setTalentData({
      workExperience: [...workExperience, createWorkExperience()],
    });
    setShowWorkExperience(true);
  }

  function updateWorkExperience(id: string, updates: Partial<WorkExperience>) {
    setTalentData({
      workExperience: workExperience.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)),
    });
  }

  function removeWorkExperience(id: string) {
    const updated = workExperience.filter((exp) => exp.id !== id);
    setTalentData({ workExperience: updated });
    if (updated.length === 0) setShowWorkExperience(false);
  }

  return (
    <OnboardingShell
      shell="talent"
      step={step}
      currentStepIndex={0}
      totalSteps={TALENT_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/profile")}
          onContinue={() => router.push("/onboarding/jobs/skills")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        {/* Career stage */}
        <FormCard>
          <FormField label="Where are you in your career?" required>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {careerStageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTalentData({ careerStage: option.value })}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2",
                    talentData.careerStage === option.value
                      ? "border-[var(--candid-foreground-brand)] bg-[var(--background-brand-subtle)]"
                      : "border-[var(--border-muted)] bg-[var(--background-interactive-default)] hover:border-[var(--border-interactive-hover)]"
                  )}
                >
                  <p className="text-foreground-default text-body-sm font-medium">{option.label}</p>
                  <p className="mt-0.5 text-caption-sm text-foreground-muted">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </FormField>
        </FormCard>

        {/* Years of experience */}
        <FormCard>
          <FormField label="Years of experience" helpText="In any field, not just climate">
            <div className="flex flex-wrap gap-2">
              {yearsOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTalentData({ yearsExperience: option.value })}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-caption font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2",
                    talentData.yearsExperience === option.value
                      ? "border-[var(--candid-foreground-brand)] bg-[var(--background-brand-subtle)] text-[var(--candid-foreground-brand)]"
                      : "border-[var(--border-muted)] bg-[var(--background-interactive-default)] text-foreground-muted hover:border-[var(--border-interactive-hover)]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FormField>
        </FormCard>

        {/* Job title */}
        <FormCard>
          <FormField label="Current or most recent job title" helpText="Optional">
            <Input
              placeholder="e.g. Software Engineer, Policy Analyst"
              value={talentData.jobTitle}
              onChange={(e) => setTalentData({ jobTitle: e.target.value })}
            />
          </FormField>
        </FormCard>

        {/* Separator */}
        <div className="border-t border-[var(--border-muted)]" />

        {/* Optional profile building section */}
        <div className="space-y-1">
          <h3 className="text-foreground-default text-body-sm font-medium">
            Build your profile (optional)
          </h3>
          <p className="text-caption text-foreground-muted">
            Share more about yourself to help employers find you
          </p>
        </div>

        {/* Goals */}
        <FormCard>
          <FormField
            label="What are you looking for?"
            helpText="Share your goals or what excites you about climate work"
          >
            <Textarea
              placeholder="I'm passionate about renewable energy and looking for an opportunity to..."
              value={talentData.goals}
              onChange={(e) => setTalentData({ goals: e.target.value })}
              maxLength={500}
              rows={3}
            />
            <p className="text-right text-caption-sm text-foreground-muted">
              {talentData.goals.length}/500
            </p>
          </FormField>
        </FormCard>

        {/* Work experience */}
        {!showWorkExperience ? (
          <button
            type="button"
            onClick={addWorkExperience}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed",
              "border-[var(--border-muted)] p-6 text-caption font-medium",
              "text-foreground-muted transition-colors",
              "hover:border-[var(--candid-foreground-brand)] hover:text-[var(--candid-foreground-brand)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2"
            )}
          >
            <Briefcase size={20} weight="regular" />
            Add work experience
          </button>
        ) : (
          <div className="space-y-4">
            {workExperience.map((exp, index) => (
              <WorkExperienceEntry
                key={exp.id}
                experience={exp}
                index={index}
                onChange={(updates) => updateWorkExperience(exp.id, updates)}
                onRemove={() => removeWorkExperience(exp.id)}
              />
            ))}

            <button
              type="button"
              onClick={addWorkExperience}
              className={cn(
                "flex items-center gap-2 text-caption font-medium",
                "text-foreground-muted transition-colors",
                "hover:text-[var(--candid-foreground-brand)]",
                "rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2"
              )}
            >
              <Plus size={16} weight="bold" />
              Add another position
            </button>
          </div>
        )}
      </div>
    </OnboardingShell>
  );
}

/** Individual work experience entry card */
function WorkExperienceEntry({
  experience,
  index,
  onChange,
  onRemove,
}: {
  experience: WorkExperience;
  index: number;
  onChange: (updates: Partial<WorkExperience>) => void;
  onRemove: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <FormCard>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-foreground-default flex items-center gap-2 rounded-lg text-body-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2"
        >
          {collapsed ? <CaretDown size={16} weight="bold" /> : <CaretUp size={16} weight="bold" />}
          {experience.title || `Position ${index + 1}`}
          {experience.company && (
            <span className="font-normal text-foreground-muted">at {experience.company}</span>
          )}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg text-foreground-muted transition-colors hover:text-[var(--foreground-error)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2"
        >
          <Trash size={18} weight="regular" />
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-foreground-default text-caption font-medium">Job title</label>
              <Input
                placeholder="e.g. Software Engineer"
                value={experience.title}
                onChange={(e) => onChange({ title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-foreground-default text-caption font-medium">Company</label>
              <Input
                placeholder="e.g. Solaris Energy Co."
                value={experience.company}
                onChange={(e) => onChange({ company: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-foreground-default text-caption font-medium">Start date</label>
              <Input
                type="month"
                value={experience.startDate}
                onChange={(e) => onChange({ startDate: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-foreground-default text-caption font-medium">End date</label>
              <Input
                type="month"
                value={experience.endDate}
                onChange={(e) => onChange({ endDate: e.target.value })}
                disabled={experience.isCurrent}
                placeholder={experience.isCurrent ? "Present" : ""}
              />
              <CheckboxWithLabel
                label="I currently work here"
                checked={experience.isCurrent}
                onCheckedChange={(checked) =>
                  onChange({
                    isCurrent: checked === true,
                    endDate: checked ? "" : experience.endDate,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-foreground-default text-caption font-medium">
              Description (optional)
            </label>
            <Textarea
              placeholder="What did you work on?"
              value={experience.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={2}
              maxLength={2000}
            />
          </div>
        </div>
      )}
    </FormCard>
  );
}

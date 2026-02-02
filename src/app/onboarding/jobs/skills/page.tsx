"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "@phosphor-icons/react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { PathwaySelector } from "@/components/onboarding/pathway-selector";
import { CategorySelector } from "@/components/onboarding/category-selector";
import { Input } from "@/components/ui/input";
import { FormCard, FormField } from "@/components/ui/form-section";
import { TALENT_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const skillSuggestions = [
  "Project Management",
  "Data Analysis",
  "Python",
  "Sustainability Reporting",
  "Carbon Accounting",
  "ESG",
  "Policy Analysis",
  "GIS",
  "Environmental Science",
  "Business Development",
  "Solar Energy",
  "Wind Energy",
  "Circular Economy",
];

export default function TalentSkillsPage() {
  const router = useRouter();
  const { talentData, setTalentData } = useOnboardingForm();
  const [skillInput, setSkillInput] = useState("");
  const [showCustomSkills, setShowCustomSkills] = useState(
    talentData.skills.length > 0
  );

  const step = TALENT_STEPS[1]; // skills
  const canContinue =
    talentData.pathways.length > 0 && talentData.categories.length > 0;

  function addSkill(skill: string) {
    const trimmed = skill.trim();
    if (trimmed && !talentData.skills.includes(trimmed)) {
      setTalentData({ skills: [...talentData.skills, trimmed] });
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setTalentData({ skills: talentData.skills.filter((s) => s !== skill) });
  }

  const availableSuggestions = skillSuggestions.filter(
    (s) => !talentData.skills.includes(s)
  );

  return (
    <OnboardingShell
      shell="talent"
      step={step}
      currentStepIndex={1}
      totalSteps={TALENT_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/jobs/background")}
          onContinue={() => router.push("/onboarding/jobs/preferences")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        {/* Climate industries — PathwayTag multi-select */}
        <FormCard>
          <FormField
            label="What climate industries interest you?"
            helpText="Select up to 5"
            required
          >
            <PathwaySelector
              selected={talentData.pathways}
              onChange={(pathways) => setTalentData({ pathways })}
              max={5}
            />
          </FormField>
        </FormCard>

        {/* Job functions — CategoryTag multi-select */}
        <FormCard>
          <FormField
            label="What type of work do you do?"
            helpText="Select up to 3"
            required
          >
            <CategorySelector
              selected={talentData.categories}
              onChange={(categories) => setTalentData({ categories })}
              max={3}
            />
          </FormField>
        </FormCard>

        {/* Custom skills — collapsible optional section */}
        <FormCard>
          {!showCustomSkills ? (
            <button
              type="button"
              onClick={() => setShowCustomSkills(true)}
              className={cn(
                "flex items-center gap-2 text-caption font-medium rounded-lg",
                "text-foreground-muted transition-colors",
                "hover:text-[var(--candid-foreground-brand)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2"
              )}
            >
              <Plus size={16} weight="bold" />
              Add custom skills (optional)
            </button>
          ) : (
            <FormField
              label="Custom skills"
              helpText="Add skills that showcase your strengths"
            >
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(skillInput);
                      }
                    }}
                    className="flex-1"
                  />
                </div>

                {/* Added skills */}
                {talentData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {talentData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--background-brand-subtle)] px-3 py-1 text-caption font-medium text-[var(--candid-foreground-brand)]"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-0.5 rounded transition-colors hover:text-[var(--foreground-error)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)]"
                        >
                          <X size={14} weight="bold" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {availableSuggestions.length > 0 && (
                  <div>
                    <p className="mb-2 text-caption-sm text-foreground-muted">
                      Suggestions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableSuggestions.slice(0, 8).map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="rounded-lg border border-dashed border-[var(--border-muted)] px-3 py-1 text-caption text-foreground-muted transition-colors hover:border-[var(--candid-foreground-brand)] hover:text-[var(--candid-foreground-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FormField>
          )}
        </FormCard>
      </div>
    </OnboardingShell>
  );
}

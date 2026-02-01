"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "@phosphor-icons/react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
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

export default function TalentSkillsPage() {
  const router = useRouter();
  const { talentData, setTalentData } = useOnboardingForm();
  const [skillInput, setSkillInput] = useState("");

  const step = TALENT_STEPS[1]; // skills
  const canContinue = talentData.sectors.length > 0;

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

  function toggleSector(sector: string) {
    const current = talentData.sectors;
    if (current.includes(sector)) {
      setTalentData({ sectors: current.filter((s) => s !== sector) });
    } else if (current.length < 5) {
      setTalentData({ sectors: [...current, sector] });
    }
  }

  // Filter suggestions to those not already added
  const availableSuggestions = skillSuggestions.filter(
    (s) => !talentData.skills.includes(s)
  );

  return (
    <OnboardingShell
      shell="talent"
      step={step}
      currentStepIndex={1}
      totalSteps={TALENT_STEPS.length}
    >
      <div className="space-y-6">
        {/* Skills */}
        <FormCard>
          <FormField label="Your skills" helpText="Add skills that showcase your strengths">
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
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[var(--primitive-green-100)] text-caption font-medium text-[var(--candid-foreground-brand)]"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-0.5 hover:text-[var(--primitive-red-600)] transition-colors"
                        aria-label={`Remove ${skill}`}
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
                  <p className="text-caption-sm text-foreground-muted mb-2">Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSuggestions.slice(0, 8).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="px-3 py-1 rounded-lg border border-dashed border-[var(--primitive-neutral-300)] text-caption text-foreground-muted hover:border-[var(--candid-foreground-brand)] hover:text-[var(--candid-foreground-brand)] transition-colors"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FormField>
        </FormCard>

        {/* Sectors */}
        <FormCard>
          <FormField
            label="Climate sectors you're interested in"
            helpText="Select up to 5 sectors"
            required
          >
            <div className="grid grid-cols-2 gap-3">
              {sectorOptions.map((sector) => {
                const selected = talentData.sectors.includes(sector.value);
                const disabled = !selected && talentData.sectors.length >= 5;
                return (
                  <button
                    key={sector.value}
                    type="button"
                    onClick={() => toggleSector(sector.value)}
                    disabled={disabled}
                    className={cn(
                      "p-3 rounded-xl border-2 text-left transition-all",
                      selected
                        ? "border-[var(--candid-foreground-brand)] bg-[var(--primitive-green-100)]"
                        : "border-[var(--primitive-neutral-200)] bg-white hover:border-[var(--primitive-neutral-400)]",
                      disabled && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <p className="font-medium text-caption text-foreground-default">
                      {sector.label}
                    </p>
                  </button>
                );
              })}
            </div>
            {talentData.sectors.length > 0 && (
              <p className="text-caption-sm text-foreground-muted mt-2">
                {talentData.sectors.length}/5 selected
              </p>
            )}
          </FormField>
        </FormCard>
      </div>

      <StepNavigation
        onBack={() => router.push("/onboarding/talent/background")}
        onContinue={() => router.push("/onboarding/talent/preferences")}
        canContinue={canContinue}
      />
    </OnboardingShell>
  );
}

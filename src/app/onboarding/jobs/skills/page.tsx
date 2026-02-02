"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { MultiCombobox, type ComboboxOption } from "@/components/ui/combobox";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { FormCard, FormField, FormRow } from "@/components/ui/form-section";
import { TALENT_STEPS } from "@/lib/onboarding/types";
import { pathwayLabels, type PathwayType } from "@/components/ui/pathway-tag";
import { jobCategoryLabels, type JobCategoryType } from "@/components/ui/category-tag";
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

const pathwayOptions: ComboboxOption[] = (
  Object.entries(pathwayLabels) as [PathwayType, string][]
).map(([value, label]) => ({ value, label }));

const categoryOptions: ComboboxOption[] = (
  Object.entries(jobCategoryLabels) as [JobCategoryType, string][]
).map(([value, label]) => ({ value, label }));

const remotePreferenceOptions = [
  { value: "onsite-only", label: "On-site only" },
  { value: "hybrid-preferred", label: "Hybrid preferred" },
  { value: "remote-preferred", label: "Remote preferred" },
  { value: "remote-only", label: "Remote only" },
  { value: "open-to-all", label: "Open to all" },
];

export default function TalentSkillsPage() {
  const router = useRouter();
  const { talentData, setTalentData, baseProfile } = useOnboardingForm();
  const skills = talentData.skills ?? [];
  const pathways = talentData.pathways ?? [];
  const categories = talentData.categories ?? [];
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = TALENT_STEPS[2]; // skills & preferences
  const canContinue = pathways.length > 0 && categories.length > 0;

  function addSkill(skill: string) {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setTalentData({ skills: [...skills, trimmed] });
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setTalentData({ skills: skills.filter((s) => s !== skill) });
  }

  const availableSuggestions = skillSuggestions.filter((s) => !skills.includes(s));

  async function handleContinue() {
    if (!canContinue) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete-role",
          shell: "talent",
          firstName: baseProfile.firstName,
          lastName: baseProfile.lastName,
          linkedinUrl: baseProfile.linkedinUrl || undefined,
          bio: baseProfile.bio || undefined,
          careerStage: talentData.careerStage,
          yearsExperience: talentData.yearsExperience,
          jobTitle: talentData.jobTitle || undefined,
          skills: talentData.skills,
          sectors: talentData.sectors,
          pathways: talentData.pathways,
          categories: talentData.categories,
          goals: talentData.goals.length > 0 ? talentData.goals : undefined,
          jobTypeInterests:
            talentData.jobTypeInterests.length > 0 ? talentData.jobTypeInterests : undefined,
          workExperience:
            talentData.workExperience.length > 0
              ? talentData.workExperience
                  .filter((exp) => exp.title && exp.company)
                  .map(({ id: _id, ...rest }) => rest)
              : undefined,
          roleTypes: talentData.roleTypes,
          transitionTimeline: talentData.transitionTimeline,
          locationPreference: talentData.locationPreference,
          remotePreference: talentData.remotePreference,
          salaryRange:
            talentData.salaryMin || talentData.salaryMax
              ? {
                  min: talentData.salaryMin ? parseInt(talentData.salaryMin, 10) : null,
                  max: talentData.salaryMax ? parseInt(talentData.salaryMax, 10) : null,
                }
              : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/onboarding/complete");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingShell
      shell="talent"
      step={step}
      currentStepIndex={2}
      totalSteps={TALENT_STEPS.length}
      rightPanel={
        <Image
          src="/illustrations/onboarding-skills.svg"
          alt=""
          width={400}
          height={400}
          className="max-w-[80%]"
        />
      }
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/jobs/career")}
          onContinue={handleContinue}
          canContinue={canContinue}
          loading={loading}
          continueLabel="Find my matches"
        />
      }
    >
      <div className="space-y-6">
        {/* Climate industries — MultiCombobox */}
        <FormCard>
          <FormField
            label="What climate industries interest you?"
            helpText="Select up to 5"
            required
          >
            <MultiCombobox
              options={pathwayOptions}
              value={pathways}
              onValueChange={(value) => setTalentData({ pathways: value })}
              maxItems={5}
              placeholder="Search climate industries..."
              searchPlaceholder="Type to search..."
              emptyMessage="No industries found."
            />
          </FormField>
        </FormCard>

        {/* Job functions — MultiCombobox */}
        <FormCard>
          <FormField label="What type of work do you do?" helpText="Select up to 3" required>
            <MultiCombobox
              options={categoryOptions}
              value={categories}
              onValueChange={(value) => setTalentData({ categories: value })}
              maxItems={3}
              placeholder="Search job functions..."
              searchPlaceholder="Type to search..."
              emptyMessage="No categories found."
            />
          </FormField>
        </FormCard>

        {/* Skills */}
        <FormCard>
          <FormField label="Your skills" helpText="Press enter after each skill">
            <div className="space-y-3">
              <Input
                placeholder="Search or add your skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(skillInput);
                  }
                }}
              />

              {/* Added skills as Chips */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Chip
                      key={skill}
                      variant="primary"
                      size="md"
                      onRemove={() => removeSkill(skill)}
                    >
                      {skill}
                    </Chip>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {availableSuggestions.length > 0 && (
                <div>
                  <p className="mb-2 text-caption-sm text-foreground-muted">Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSuggestions.slice(0, 8).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="rounded-lg border border-dashed border-[var(--border-muted)] px-3 py-1 text-caption text-foreground-muted transition-colors hover:border-[var(--border-interactive-focus)] hover:text-[var(--foreground-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2"
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

        {/* Separator */}
        <div className="border-t border-[var(--border-muted)]" />

        {/* Remote preference */}
        <FormCard>
          <FormField label="Remote preference">
            <div className="flex flex-wrap gap-2">
              {remotePreferenceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTalentData({ remotePreference: option.value })}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-caption font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2",
                    talentData.remotePreference === option.value
                      ? "border-[var(--border-brand-emphasis)] bg-[var(--background-brand-subtle)] text-[var(--foreground-brand)]"
                      : "border-[var(--border-muted)] bg-[var(--background-interactive-default)] text-foreground-muted hover:border-[var(--border-interactive-hover)]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FormField>
        </FormCard>

        {/* Salary range */}
        <FormCard>
          <FormField label="Salary expectations" helpText="Optional — helps us match better">
            <FormRow>
              <div>
                <Input
                  placeholder="Min (e.g. 60000)"
                  value={talentData.salaryMin}
                  onChange={(e) => setTalentData({ salaryMin: e.target.value })}
                  type="number"
                />
              </div>
              <div>
                <Input
                  placeholder="Max (e.g. 90000)"
                  value={talentData.salaryMax}
                  onChange={(e) => setTalentData({ salaryMax: e.target.value })}
                  type="number"
                />
              </div>
            </FormRow>
          </FormField>
        </FormCard>
      </div>

      {error && <p className="mt-4 text-caption text-[var(--foreground-error)]">{error}</p>}
    </OnboardingShell>
  );
}

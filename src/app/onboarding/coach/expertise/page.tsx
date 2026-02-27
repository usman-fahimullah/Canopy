"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { FormCard, FormField } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { PathwaySelector } from "@/components/onboarding/pathway-selector";
import { CategorySelector } from "@/components/onboarding/category-selector";
import { COACH_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";
import { X } from "@phosphor-icons/react";

const coachingTypeOptions = [
  { value: "career-coaching", label: "Career Coaching" },
  { value: "executive-coaching", label: "Executive Coaching" },
  { value: "leadership-development", label: "Leadership Development" },
  { value: "life-coaching", label: "Life Coaching" },
  { value: "interview-prep", label: "Interview Prep" },
  { value: "resume-branding", label: "Resume & Personal Branding" },
  { value: "salary-negotiation", label: "Salary Negotiation" },
  { value: "career-transitions", label: "Career Transitions" },
  { value: "industry-guidance", label: "Industry-Specific Guidance" },
];

const experienceLevelOptions = [
  { value: "new", label: "New coach", description: "Less than 1 year" },
  { value: "developing", label: "Developing", description: "1-3 years" },
  { value: "experienced", label: "Experienced", description: "3-7 years" },
  { value: "expert", label: "Expert", description: "7+ years" },
];

const certificationSuggestions = [
  "ICF ACC",
  "ICF PCC",
  "ICF MCC",
  "CTI CPCC",
  "iPEC CPC",
  "Marshall Goldsmith",
];

export default function CoachExpertisePage() {
  const router = useRouter();
  const { coachData, setCoachData } = useOnboardingForm();
  const [certInput, setCertInput] = useState("");

  const step = COACH_STEPS[1]; // expertise
  const canContinue =
    coachData.coachingTypes.length > 0 &&
    coachData.industryFocus.length > 0 &&
    coachData.experienceLevel !== null;

  function toggleCoachingType(value: string) {
    const current = coachData.coachingTypes;
    if (current.includes(value)) {
      setCoachData({ coachingTypes: current.filter((t) => t !== value) });
    } else if (current.length < 3) {
      setCoachData({ coachingTypes: [...current, value] });
    }
  }

  function addCertification(cert: string) {
    const trimmed = cert.trim();
    if (!trimmed || coachData.certifications.includes(trimmed)) return;
    setCoachData({ certifications: [...coachData.certifications, trimmed] });
    setCertInput("");
  }

  function removeCertification(cert: string) {
    setCoachData({
      certifications: coachData.certifications.filter((c) => c !== cert),
    });
  }

  function handleCertKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addCertification(certInput);
    }
  }

  return (
    <OnboardingShell
      shell="coach"
      step={step}
      currentStepIndex={1}
      totalSteps={COACH_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/coach/about")}
          onContinue={() => router.push("/onboarding/coach/services")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        {/* Coaching Types */}
        <FormCard>
          <FormField label="What type of coaching do you offer?" required helpText="Select up to 3">
            <div className="flex flex-wrap gap-2">
              {coachingTypeOptions.map((option) => {
                const selected = coachData.coachingTypes.includes(option.value);
                const disabled = !selected && coachData.coachingTypes.length >= 3;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleCoachingType(option.value)}
                    disabled={disabled}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-caption font-medium transition-all",
                      selected
                        ? "border-[var(--border-interactive-focus)] bg-[var(--background-interactive-selected)] text-[var(--foreground-interactive-selected)]"
                        : "border-[var(--border-muted)] bg-[var(--background-interactive-default)] text-[var(--foreground-muted)] hover:border-[var(--border-interactive-hover)]",
                      disabled && "cursor-not-allowed opacity-40"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            {coachData.coachingTypes.length > 0 && (
              <p className="mt-2 text-caption-sm text-[var(--foreground-muted)]">
                {coachData.coachingTypes.length}/3 selected
              </p>
            )}
          </FormField>
        </FormCard>

        {/* Industry Focus (PathwayTag) */}
        <FormCard>
          <FormField
            label="Which climate industries do you specialize in?"
            required
            helpText="Help clients find you by selecting the industries you know best"
          >
            <PathwaySelector
              selected={coachData.industryFocus}
              onChange={(selected) => setCoachData({ industryFocus: selected })}
              max={5}
            />
          </FormField>
        </FormCard>

        {/* Career Focus (CategoryTag) */}
        <FormCard>
          <FormField
            label="What types of roles do you help clients with?"
            helpText="Optional — Specify the career paths you help clients navigate"
          >
            <CategorySelector
              selected={coachData.careerFocus}
              onChange={(selected) => setCoachData({ careerFocus: selected })}
              max={5}
            />
          </FormField>
        </FormCard>

        {/* Experience Level */}
        <FormCard>
          <FormField label="Coaching experience" required>
            <div className="grid grid-cols-2 gap-3">
              {experienceLevelOptions.map((option) => {
                const selected = coachData.experienceLevel === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCoachData({ experienceLevel: option.value })}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left transition-all",
                      selected
                        ? "border-[var(--border-interactive-focus)] bg-[var(--background-interactive-selected)]"
                        : "border-[var(--border-muted)] bg-[var(--background-interactive-default)] hover:border-[var(--border-interactive-hover)]"
                    )}
                  >
                    <p className="text-caption font-medium text-[var(--foreground-default)]">
                      {option.label}
                    </p>
                    <p className="mt-0.5 text-caption-sm text-[var(--foreground-muted)]">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </FormField>
        </FormCard>

        {/* Certifications */}
        <FormCard>
          <FormField label="Certifications" helpText="Add any coaching certifications you hold">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. ICF PCC"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  onKeyDown={handleCertKeyDown}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => addCertification(certInput)}
                  disabled={!certInput.trim()}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-caption font-medium transition-all",
                    "border-[var(--border-muted)] bg-[var(--background-interactive-default)] text-[var(--foreground-muted)]",
                    "hover:border-[var(--border-interactive-hover)]",
                    "disabled:cursor-not-allowed disabled:opacity-40"
                  )}
                >
                  Add
                </button>
              </div>

              {/* Suggestions */}
              {coachData.certifications.length === 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {certificationSuggestions.map((cert) => (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => addCertification(cert)}
                      className="rounded-md border border-dashed border-[var(--border-muted)] px-2.5 py-1 text-caption-sm text-[var(--foreground-subtle)] transition-colors hover:border-[var(--border-interactive-hover)] hover:text-[var(--foreground-muted)]"
                    >
                      + {cert}
                    </button>
                  ))}
                </div>
              )}

              {/* Selected certifications */}
              {coachData.certifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {coachData.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--background-brand-subtle)] px-3 py-1.5 text-caption font-medium text-[var(--foreground-brand)]"
                    >
                      {cert}
                      <button
                        type="button"
                        onClick={() => removeCertification(cert)}
                        className="rounded-full p-0.5 transition-colors hover:bg-[var(--background-brand-muted)]"
                      >
                        <X size={12} weight="bold" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </FormField>
        </FormCard>
      </div>
    </OnboardingShell>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckboxWithLabel, CheckboxGroup } from "@/components/ui/checkbox";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";
import { ArrowRight, ArrowLeft } from "@phosphor-icons/react";

/**
 * Career Journey Screen - Onboarding Step 3 (Seeker Flow)
 *
 * Based on Figma design (146:3398)
 * User selects career stage, goals, and job type preferences
 */

const careerStageOptions = [
  { value: "student", label: "Student / Recent Graduate" },
  { value: "entry-level", label: "Entry Level (0-2 years)" },
  { value: "mid-career", label: "Mid-Career (3-7 years)" },
  { value: "senior", label: "Senior Level (8+ years)" },
  { value: "career-changer", label: "Career Changer" },
  { value: "returning", label: "Returning to Workforce" },
];

const goalOptions = [
  { id: "finding-job", label: "Finding a new job" },
  { id: "exploring-options", label: "Exploring career options" },
  { id: "learning-skills", label: "Learning new skills" },
  { id: "networking", label: "Building my network" },
  { id: "transitioning", label: "Transitioning to climate work" },
  { id: "career-growth", label: "Career advancement" },
];

const jobTypeOptions = [
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "freelance", label: "Freelance" },
  { id: "internship", label: "Internship" },
  { id: "volunteer", label: "Volunteer" },
];

export default function CareerJourneyPage() {
  const router = useRouter();
  const [careerStage, setCareerStage] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleBack = () => {
    router.push("/seeker/profile");
  };

  const handleContinue = async () => {
    setSaving(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "seeker-career-journey",
          data: { careerStage, selectedGoals, selectedJobTypes },
        }),
      });
    } catch (err) {
      console.error("Failed to save career journey:", err);
    }
    setSaving(false);
    router.push("/seeker/skills-pathways");
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const toggleJobType = (typeId: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const isFormValid = careerStage && selectedGoals.length > 0;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--primitive-green-800)] mb-3">
          Your career journey
        </h1>
        <p className="text-lg text-[var(--primitive-neutral-600)]">
          Help us understand where you are and what you&apos;re looking for
        </p>
      </div>

      {/* Form */}
      <div className="space-y-8 mb-8">
        {/* Career Stage */}
        <div className="space-y-2">
          <Label htmlFor="career-stage" required>
            Where are you in your career?
          </Label>
          <Dropdown value={careerStage} onValueChange={setCareerStage}>
            <DropdownTrigger id="career-stage" className="w-full">
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
        </div>

        {/* Goals */}
        <CheckboxGroup
          label="What are your goals?"
          helperText="Select all that apply"
          required
        >
          <div className="grid grid-cols-2 gap-3">
            {goalOptions.map((goal) => (
              <CheckboxWithLabel
                key={goal.id}
                id={goal.id}
                label={goal.label}
                checked={selectedGoals.includes(goal.id)}
                onCheckedChange={() => toggleGoal(goal.id)}
              />
            ))}
          </div>
        </CheckboxGroup>

        {/* Job Types */}
        <CheckboxGroup
          label="What types of work interest you?"
          helperText="Select all that apply"
        >
          <div className="grid grid-cols-3 gap-3">
            {jobTypeOptions.map((type) => (
              <CheckboxWithLabel
                key={type.id}
                id={type.id}
                label={type.label}
                checked={selectedJobTypes.includes(type.id)}
                onCheckedChange={() => toggleJobType(type.id)}
              />
            ))}
          </div>
        </CheckboxGroup>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          variant="tertiary"
          onClick={handleBack}
          leftIcon={<ArrowLeft weight="bold" size={20} />}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!isFormValid}
          loading={saving}
          className="flex-1"
          rightIcon={<ArrowRight weight="bold" size={20} />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
